import express from "express";
import { checkSchemaError } from "../middleware/validations";
import {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  getPostComments,
} from "../controllers/commentController";
import { createCommentSchema, updateCommentSchema } from "../middleware/schemas/requestSchemas";

const router = express.Router();
/*
 ** COMMENTS ROUTES
 */
router.route("/").post(createCommentSchema, checkSchemaError, createComment);
router.route("/:commentId").patch(updateCommentSchema, checkSchemaError, updateComment);
router.route("/post/:postId").get(getPostComments);
router.route("/:commentId").delete(deleteComment);
router.route("/:commentId/like").post(likeComment);

export default router;
