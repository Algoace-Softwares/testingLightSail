import { checkSchema, ParamSchema } from "express-validator";
import {
  accountStatusSchema,
  connectionStatusSchema,
  emailSchema,
  genderSchema,
  idSchema,
  privacyStatusSchema,
  socialTokenSchema,
  textSchema,
  urlSchema,
  verificationStatusSchema,
} from "../../utils/commonSchemas";
import { Types } from "mongoose";
/*
 ** Create user request schema
 */
export const createUserSchema = checkSchema({
  email: emailSchema({}) as unknown as ParamSchema,
  cognitoId: idSchema({ label: "cognitoId" }) as unknown as ParamSchema,
  ...socialTokenSchema,
});

// Validation schema for updating a user
export const updateUserSchema = checkSchema({
  profileImage: urlSchema({ label: "profileImage", required: false }) as unknown as ParamSchema,
  name: textSchema({ label: "name", required: false }) as unknown as ParamSchema,
  nickName: textSchema({ label: "nickName", required: false }) as unknown as ParamSchema,
  dateOfBirth: textSchema({ label: "dateOfBirth" }) as unknown as ParamSchema,
  gender: genderSchema({ required: true }) as unknown as ParamSchema,
  profileDescription: textSchema({
    label: "profileDescription",
    required: false,
  }) as unknown as ParamSchema,
  privacyStatus: privacyStatusSchema({
    label: "privacyStatus",
    required: false,
  }) as unknown as ParamSchema,
  accountStatus: accountStatusSchema({
    label: "accountStatus",
    required: false,
  }) as unknown as ParamSchema,
  verificationStatus: verificationStatusSchema({
    label: "verificationStatus",
    required: false,
  }) as unknown as ParamSchema,
});
// Validation schema for getting signed url a user
export const signedUrlSchema = checkSchema({
  fileName: textSchema({ label: "fileName" }) as unknown as ParamSchema,
  fileType: textSchema({ label: "fileType" }) as unknown as ParamSchema,
  folderName: textSchema({ label: "folderName", required: false }) as unknown as ParamSchema,
});

/*
 ** Create connection request schema
 */
export const createConnectionSchema = checkSchema({
  followingId: idSchema({ label: "followingId" }) as unknown as ParamSchema,
  followerId: idSchema({ label: "followerId" }) as unknown as ParamSchema,
});
/*
 ** Update connection request schema
 */
export const updateConnectionSchema = checkSchema({
  connectionStatus: connectionStatusSchema({
    required: true,
  }) as unknown as ParamSchema,
});
/*
 ** Creating user comments request schema
 */
export const createCommentSchema = checkSchema({
  comments: textSchema({ label: "comments" }) as unknown as ParamSchema,
  postId: idSchema({ label: "postId" }) as unknown as ParamSchema,
  userId: idSchema({ label: "userId" }) as unknown as ParamSchema,
});
/*
 ** updating user comments request schema
 */
export const updateCommentSchema = checkSchema({
  comments: textSchema({ label: "comments" }) as unknown as ParamSchema,
});
/*
 ** like a post or comments schema
 */
export const reactionSchema = checkSchema({
  postId: idSchema({ label: "postId" }) as unknown as ParamSchema,
  userId: idSchema({ label: "userId" }) as unknown as ParamSchema,
  interactionType: {
    in: ["body"],
    isString: {
      errorMessage: "Interaction status must be a string",
    },
    matches: {
      options: [/\b(?:LIKE|PRAY|STRONG|THANK_YOU|APPLAUSE)\b/],
      errorMessage: `interactionStatus should be LIKE | PRAY | STRONG | THANK_YOU | APPLAUSE`,
    },
  },
});
/*
 ** Creating connection request type
 */
export interface createConnectionType {
  readonly followingId: Types.ObjectId;
  readonly followerId: Types.ObjectId;
}

export const createReportSchema = checkSchema({
  reporterId: idSchema({ label: "reporterId" }) as unknown as ParamSchema,
  reportedId: idSchema({ label: "reportedId" }) as unknown as ParamSchema,
  reportType: { isIn: { options: [["POST", "USER"]] } },
  reason: textSchema({ label: "reason" }) as unknown as ParamSchema,
});

export const updateReportSchema = checkSchema({
  ticketStatus: { isIn: { options: [["PENDING", "RESOLVED"]] } },
  adminFeedback: { optional: true, isString: true },
  action: { isIn: { options: [["DELETE", "BANNED", "WARNING"]] } },
});
