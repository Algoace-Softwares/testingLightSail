import express from "express";
import { getAllNotifications, deleteNotification, deleteAllNotifications } from "../controllers/notificationController";

const router = express.Router();

router.route("/:userId").get(getAllNotifications);
router.route("/:userId/:notificationId").delete(deleteNotification);
router.route("/:userId").delete(deleteAllNotifications);

export default router;
