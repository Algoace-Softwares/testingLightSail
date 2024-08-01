import { locationType } from "../types/appTypes";

// GENERATE QUERY BASED ON LOCATION SEARCH
const getLocationQuery = (location: locationType) => {
  console.log("🚀 ~ getLocationQuery ~ location:", location.type, location.coordinates);

  // HANDLE POLYGON QUERY
  if (location.type === "Polygon") {
    return {
      $match: {
        location: {
          $geoWithin: {
            $geometry: {
              type: "Polygon",
              coordinates: [location.coordinates],
            },
          },
        },
      },
    };
  }
  // HANDLE POINT QUERY
  else if (location.type === "Point") {
    return {
      $geoNear: {
        near: {
          type: location.type,
          coordinates: location.coordinates,
        },
        maxDistance: location.maxDistance || 300,
        distanceField: "distance",
        spherical: true,
      },
    };
  } else {
    return {
      // BECAUSE EMPTY WAS GIVING ERROR
      $addFields: {},
    };
  }
};

// ALL AGGREGATIONS FOR POST APIS
const postAggregations = {
  getAllPosts: (location: locationType) => {
    // QUERY FOR FILTERING WITH LOCATION
    const locationQuery = getLocationQuery(location);
    return [
      locationQuery,
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: {
          path: "$authorData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // { $skip: page * rows },
      // { $limit: rows },
    ];
  },
};

export default postAggregations;
