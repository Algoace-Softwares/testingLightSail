import { Request, Response } from "express";
import { Notifications } from "../models/notification.model";
import { STATUS_CODE } from "../config";
import { formatedError } from "../utils/formatedError";

export const getAllNotifications = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const notifications = await Notifications.find({ userId }).sort({ createdAt: -1 });

    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: notifications });
  } catch (error: unknown) {
    console.log("🚀 ~ getAllNotifications ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { userId, notificationId } = req.params;

  try {
    const notification = await Notifications.findOneAndDelete({ _id: notificationId, userId });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: notification });
  } catch (error: unknown) {
    console.log("🚀 ~ deleteNotification ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    await Notifications.deleteMany({ userId });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, message: "All notifications deleted successfully" });
  } catch (error: unknown) {
    console.log("🚀 ~ deleteAllNotifications ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
