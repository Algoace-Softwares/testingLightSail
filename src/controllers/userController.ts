import { Request, Response } from "express";
import { Users } from "../models/user.models";
import { creatUserType } from "../types/incomingDataType";
import logger from "../utils/logger";
import { STATUS_CODE } from "../config";
import { formatedError } from "../utils/formatedError";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
/*
 ** Creating user in database
 */
export const createUser = async (req: Request, res: Response) => {
  const { email, cognitoId, socialTokens = [] } = req.body as creatUserType;

  try {
    const userData = {
      cognitoId,
      socialTokens,
      email: email?.toLowerCase(),
    };
    const user = await Users.create(userData);
    console.log("🚀 ~ createUser ~ user:", user);
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: user });
  } catch (error: unknown) {
    console.log("🚀 ~ getUserData ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** updating user in database
 */
export const updateUser = async (req: Request & { params: { userId: string } }, res: Response) => {
  const userId = req.params.userId;
  const {
    profileImage,
    name,
    nickName,
    profileDescription,
    privacyStatus,
    verificationStatus,
    accountStatus,
    gender,
    dateOfBirth,
  } = req.body;

  console.log("🚀 ~ updatingData ~ userId:", userId);
  console.log("🚀 ~ updatingData ~ req.body:", req.body);

  try {
    // validation user
    const userData = await Users.findOne({ _id: userId });
    if (!userData) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ success: false, message: "user with id not found" });
    } else if (userData?.verificationStatus === "NOT-VERIFIED" && verificationStatus !== "VERIFIED") {
      return res.status(STATUS_CODE.NOT_ACCEPTABLE).json({ success: false, message: "User not verified" });
    }
    // UPDATE USER RECORD IN DB
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        profileDescription,
        profileImage,
        name,
        nickName,
        privacyStatus,
        verificationStatus,
        accountStatus,
        gender,
        dateOfBirth,
        profileSetup: true,
      },
      { new: true, runValidators: true },
    );
    console.log("🚀 ~ updateUser ~ updatedUser:", updatedUser);
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: updatedUser });
  } catch (error: unknown) {
    console.log("🚀 ~ getUserData ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** delete user in database
 */
export const deleteUser = async (req: Request & { params: { userId: string } }, res: Response) => {
  const userId = req.params.userId;
  console.log("🚀 ~ updatingData ~ userId:", userId);

  try {
    await Users.findByIdAndDelete(userId);
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: "Successfully deleted" });
  } catch (error: unknown) {
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** Get  user data by id
 */
export const getUser = async (req: Request & { params: { userId: string } }, res: Response) => {
  const { userId, cognitoId } = req.query;
  logger.info("This is an info message");

  try {
    let userData;
    if (userId) {
      userData = await Users.findOne({ _id: userId });
    } else if (cognitoId) {
      userData = await Users.findOne({ cognitoId: cognitoId });
    }

    console.log("🚀 ~ getUser ~ userData:", userData);
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: userData });
  } catch (error: unknown) {
    console.log("🚀 ~ getUserData ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** Get all users data
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    logger.info("This is an info message");
    const userData = await Users.find();
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: userData });
  } catch (error: unknown) {
    console.log("🚀 ~ getUserData ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** block user
 */
export const toggleBlockUser = async (req: Request, res: Response) => {
  const { blockerId, blockedId } = req.query;

  try {
    /*
     ** Checking if the blocked user exists
     */
    const blockedUserData = await Users.findById(blockedId);
    if (!blockedUserData) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: "Blocked user with the specified ID not found" });
    }

    /*
     ** Checking if the blocker user exists
     */
    const blockerUserData = await Users.findById(blockerId);
    if (!blockerUserData) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: "Blocker user with the specified ID not found" });
    }

    /*
     ** Checking if the blocked user is already in the blocker's blocked list
     */
    const isAlreadyBlocked = blockerUserData.blockedUsers.some((user) => user.toString() === blockedId);

    if (isAlreadyBlocked) {
      // If already blocked, remove the blocked user
      await Users.findByIdAndUpdate(
        blockerId,
        { $pull: { blockedUsers: blockedUserData._id } },
        { new: true, runValidators: true },
      );
      return res.status(200).json({ success: true, message: "User has been unblocked" });
    } else {
      await Users.findByIdAndUpdate(
        blockerId,
        { $push: { blockedUsers: blockedUserData._id } },
        { new: true, runValidators: true },
      );
      return res.status(200).json({ success: true, message: "User has been blocked" });
    }
  } catch (error: unknown) {
    console.log("🚀 ~ toggleBlockUser ~ error:", error);
    /*
     ** Formatted Error
     */
    return formatedError(res, error);
  }
};
/*
 ** Get all blocked users
 */
export const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    logger.info("This is an info message");
    // Find the user by ID and populate the blockedUsers field
    const userData = await Users.findById(userId).populate({
      path: "blockedUsers",
      select: "name nickName profileImage",
    });

    if (!userData) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ success: false, message: "User not found" });
    }
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: userData });
  } catch (error: unknown) {
    console.log("🚀 ~ getBlockedUsers ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** get signed url for image upload
 */
export const uploadSignedUrl = async (req: Request, res: Response) => {
  // Assume the client sends the file name and type
  try {
    const { fileName, fileType, folderName } = req.body;
    const userId = req.params.userId;
    /*
     ** Checking user validation
     */
    const userData = await Users.findOne({ _id: userId });
    if (!userData) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ success: false, message: "User with the specified ID not found" });
    }
    const BucketName = "loci-storage-bucket-dev";
    const s3Storage = new S3Client({});
    const command = new PutObjectCommand({
      Bucket: BucketName,
      ContentType: fileType,
      Key: `${userId}/${folderName}/${fileName}`,
    });
    console.log("command:", command);
    // getting url
    const url = await getSignedUrl(s3Storage, command, { expiresIn: 15 * 60 });
    // construction get url
    const linkUrl = `https://${BucketName}.s3.amazonaws.com/${userId}/${folderName}/${fileName}`;
    console.log("urls:", url);

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      data: {
        putUrl: url,
        getUrl: linkUrl,
      },
    });
  } catch (error: unknown) {
    console.log("🚀 ~ getUserData ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
