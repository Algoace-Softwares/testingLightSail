import express from "express";
import { checkSchemaError } from "../middleware/validations";
import {
  createReaction,
  getPostLikedReaction,
  getPostReactions,
  getUserPostReaction,
} from "../controllers/reactionController";
import { reactionSchema } from "../middleware/schemas/requestSchemas";

const router = express.Router();

router.route("/").post(reactionSchema, checkSchemaError, createReaction);
router.route("/post/:postId").get(getPostReactions);
router.route("/like/:postId").get(getPostLikedReaction);
router.route("/:postId/:userId").get(getUserPostReaction);

export default router;
