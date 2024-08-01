import { Request, Response } from "express";
import logger from "../utils/logger";
import { Comments } from "../models/comments.model";
import { formatedError } from "../utils/formatedError";
import { STATUS_CODE } from "../config";
import { Posts } from "../models/post.model";
import { PipelineStage } from "mongoose";
import { gettingPostComments } from "../aggregations/commentAggregation";
/*
 ** creating comment in database
 */
export const createComment = async (req: Request, res: Response) => {
  const { comments, postId, userId, parentId = null } = req.body;

  try {
    /*
     ** Checking if paraent comment exits
     */
    if (parentId) {
      const parentComment = await Comments.findById(parentId);
      if (!parentComment) {
        return res.status(STATUS_CODE.NOT_FOUND).json({ success: true, message: "Parent coment not found" });
      }
    }
    const comment = await Comments.create({
      comments,
      postId,
      userId,
      parentId,
    });
    //incrementing react count
    await Posts.findByIdAndUpdate(
      postId,
      {
        $inc: { commentCount: 1 },
      },
      { runValidators: true },
    );
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: comment });
  } catch (error: unknown) {
    console.log("🚀 ~ createComment ~ error:", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** updating comment in database
 */
export const updateComment = async (req: Request & { params: { commentId: string } }, res: Response) => {
  const commentId = req.params.commentId;
  const { comments } = req.body;

  try {
    const updatedComment = await Comments.findByIdAndUpdate(commentId, { comments }, { new: true });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: updatedComment });
  } catch (error: unknown) {
    console.log("🚀 ~ error:updateComment", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** get post all comments
 */
export const getPostComments = async (req: Request & { params: { postId: string } }, res: Response) => {
  const postId = req.params.postId;
  try {
    const postComments = await Comments.aggregate(gettingPostComments(postId) as PipelineStage[]);
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: postComments });
  } catch (error: unknown) {
    console.log("🚀 ~ error:updateComment", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** deleting comment in database
 */
export const deleteComment = async (req: Request & { params: { commentId: string } }, res: Response) => {
  const commentId = req.params.commentId;

  try {
    // checking  if comment is there
    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ error: true, message: "Comment not found" });
    }
    // deleting comment from database
    await Comments.findByIdAndDelete(commentId);
    //incrementing react count
    await Posts.findByIdAndUpdate(
      comment?.postId,
      {
        $inc: { commentCount: -1 },
      },
      { runValidators: true },
    );
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: "Comment deleted successfully" });
  } catch (error: unknown) {
    console.log("🚀 ~ error:deleteComment", error);
    /*
     ** Formated Error
     */
    return formatedError(res, error);
  }
};
/*
 ** liking/unliking comment in database
 */
export const likeComment = async (req: Request & { params: { commentId: string } }, res: Response) => {
  const commentId = req.params.commentId;
  const { action } = req.body;

  try {
    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ error: true, message: "Comment not found" });
    }

    if (action === "LIKE") {
      await Comments.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });
    } else if (action === "UNLIKE") {
      await Comments.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });
    }

    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: "Sucessfully updated" });
  } catch (error) {
    logger.error("Error liking/unliking comment: ", error);
    return res.status(STATUS_CODE.NOT_FOUND).json({ error: true, message: "Unable to like/unlike comment" });
  }
};
