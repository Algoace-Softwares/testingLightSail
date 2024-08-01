import mongoose, { Schema } from "mongoose";
import { UserType } from "../types/entityTypes";
/*
 ** Social token schema for user database used for when user is social signup
 */
const socialTokenSchema = new Schema({
  socialId: { type: String, required: true },
  socialPlatform: { type: String, required: true },
});
/*
 ** fcm token schema
 */
const fcmTokenSchema = new Schema({
  token: { type: String, required: true },
  deviceType: { type: String, required: true },
});

/*
 ** User database schema
 */
const userSchema = new Schema<UserType>(
  {
    cognitoId: {
      type: String,
      required: [true, "cognitoId is required"],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, default: "" },
    nickName: { type: String, default: "" },
    postCount: { type: Number, required: [true, "postCount is required"], default: 0, min: 0 },
    followerCount: {
      type: Number,
      required: [true, "followerCount is required"],
      default: 0,
      min: 0,
    },
    followingCount: {
      type: Number,
      required: [true, "followingCount is required"],
      default: 0,
      min: 0,
    },
    privacyStatus: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      required: [true, "privacyStatus is required"],
      default: "PRIVATE",
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
    },
    dateOfBirth: { type: String, default: "" },
    profileDescription: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    notification: { type: Boolean, required: [true, "notification is required"], default: true },
    profileSetup: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      required: [true, "isDeleted is required"],
      default: false,
    },
    socialTokens: {
      type: [socialTokenSchema],
      default: [],
    },
    fcmTokens: {
      type: [fcmTokenSchema],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ["NOT-VERIFIED", "VERIFIED", "PENDING"],
      required: [true, "verificationStatus is required"],
      default: "NOT-VERIFIED",
    },
    accountStatus: {
      type: String,
      enum: ["NOT-ACTIVE", "ACTIVE", "DISABLED"],
      required: [true, "accountStatus is required"],
      default: "NOT-ACTIVE",
    },
    blockedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "Users",
      default: [],
    },
    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

export const Users = mongoose.model("Users", userSchema);
