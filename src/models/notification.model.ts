import mongoose, { Schema } from "mongoose";
import { notificationType } from "../types/entityTypes";

const notificationSchema = new Schema<notificationType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    payload: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Notifications = mongoose.model("Notifications", notificationSchema);
