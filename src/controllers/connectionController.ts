import { Request, Response } from "express";
import { Connections } from "../models/connection.models";
import logger from "../utils/logger";
import { createConnectionType } from "../middleware/schemas/requestSchemas";
import { STATUS_CODE } from "../config";
import { formatedError } from "../utils/formatedError";
import { Users } from "../models/user.models";

/*
 ** Create a new connection
 */
export const createConnection = async (req: Request, res: Response) => {
  const { followingId, followerId } = req.body as createConnectionType;

  try {
    const newConnection = await Connections.create({
      followingId,
      followerId,
      connectionStatus: "PENDING",
    });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: newConnection });
  } catch (error: unknown) {
    console.log("🚀 ~ createConnection ~ error:", error);
    logger.error("Error creating connection:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** Update connection status
 */
export const updateConnection = async (req: Request & { params: { connectionId: string } }, res: Response) => {
  const connectionId = req.params.connectionId;
  const { connectionStatus } = req.body;

  try {
    // Checking if connnection exits
    const connection = await Connections.findById(connectionId);
    if (!connection) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ success: true, message: "Connection with id not found" });
    }
    if (connectionStatus === "REJECTED") {
      await Connections.findByIdAndDelete(connectionId);
      return res.status(STATUS_CODE.SUCCESS).json({ success: true, message: "Successfully updated" });
    }

    const updatedConnection = await Connections.findByIdAndUpdate(
      connectionId,
      {
        connectionStatus,
      },
      { returnNewDocument: true, runValidators: true, new: true },
    );
    if (connection.connectionStatus === "PENDING" && connectionStatus === "ACCEPTED") {
      await Users.findByIdAndUpdate(connection.followingId, { $inc: { followerCount: 1 } });
      await Users.findByIdAndUpdate(connection.followerId, { $inc: { followingCount: 1 } });
    }
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: updatedConnection });
  } catch (error: unknown) {
    logger.error("Error updating connection:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** Delete Connection
 */
export const deleteConnection = async (req: Request & { params: { connectionId: string } }, res: Response) => {
  const connectionId = req.params.connectionId;

  try {
    const connection = await Connections.findById(connectionId);
    if (!connection) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ success: true, message: "Connection with id not found" });
    }
    await Connections.findByIdAndDelete(connectionId);
    await Users.findByIdAndUpdate(connection.followingId, { $inc: { followerCount: -1 } });
    await Users.findByIdAndUpdate(connection.followerId, { $inc: { followingCount: -1 } });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, message: "Successfully deleted" });
  } catch (error: unknown) {
    logger.error("Error updating connection:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** Get all followers
 */
export const getFollowers = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const followers = await Connections.find({
      followingId: userId,
      connectionStatus: "ACCEPTED",
    }).populate({
      path: "followerId",
      select: "name nickName profileImage",
    });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: followers });
  } catch (error: unknown) {
    logger.error("Error fetching followers:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};

/*
 ** Get all following users
 */
export const getFollowings = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const followingUsers = await Connections.find({
      followerId: userId,
      connectionStatus: "ACCEPTED",
    }).populate({
      path: "followingId",
      select: "name nickName profileImage",
    });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: followingUsers });
  } catch (error: unknown) {
    logger.error("Error fetching following users:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};

/*
 ** Get user connection
 */
export const getUserConnections = async (req: Request & { params: { connectionId: string } }, res: Response) => {
  const connectionId = req.params.connectionId;

  try {
    const connection = await Connections.findOne({ _id: connectionId });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: connection });
  } catch (error: unknown) {
    logger.error("Error fetching connection:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** Check if two users are connected
 */
export const checkUserConnection = async (req: Request, res: Response) => {
  const { userId1, userId2 } = req.query;

  try {
    const connection = await Connections.findOne({
      $or: [
        { followingId: userId1, followerId: userId2, connectionStatus: "ACCEPTED" },
        { followingId: userId2, followerId: userId1, connectionStatus: "ACCEPTED" },
      ],
    });
    console.log("🚀 ~ checkUserConnection ~ connection:", connection);

    const isConnected = connection ? true : false;
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, isConnected });
  } catch (error: unknown) {
    logger.error("Error checking user connection: ", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
