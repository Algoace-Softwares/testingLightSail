import { APIGatewayEvent } from "aws-lambda";
import { Users } from "../models/user.models";

export class ApiUtils {
  constructor() {
    console.debug("api utils cons called");
  }
  /*
   ** getting item if from path
   */
  getIdFromPath(event: APIGatewayEvent): string | undefined {
    console.debug("event.pathParameters[]: ", event.pathParameters);
    if (event?.pathParameters?.id) {
      const itemId: string = event.pathParameters.id;
      console.debug("userId: ", itemId);
      return itemId;
    } else {
      throw new Error("Path parameter required");
    }
  }
  /*
   ** Validate  item id from database
   */
  async validateIdFromPath(event: APIGatewayEvent): Promise<string | undefined> {
    console.debug("event.pathParameters[]: ", event.pathParameters);
    if (event?.pathParameters?.id) {
      const userId: string = event.pathParameters.id;
      console.debug("userId: ", userId);
      // database operations
      const user = await Users.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return userId;
    } else {
      throw new Error("id required");
    }
  }
  /*
   ** getting item data from authorizer available only when using custom authorizer
   */
  getParamFromAuthContext(event: APIGatewayEvent, param: string): string {
    const paramVal = event.requestContext?.authorizer?.claims?.[param];
    console.debug(`event.requestContext.${param}: ${paramVal}`);
    return paramVal;
  }
}
