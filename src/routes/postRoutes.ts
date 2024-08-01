import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsOfUser,
  getPostById,
  getUserSavedPosts,
  togglePost,
  updatePost,
} from "../controllers/postController";

// DEFINE EXPRESS ROUTE
const router = express.Router();

/*
 ** USER ROUTES
 */
router.route("/").post(createPost).get(getAllPosts);
router.route("/user-saved-posts").get(getUserSavedPosts);
router.route("/:id").get(getPostById).patch(updatePost).delete(deletePost);
router.route("/user/:id").get(getAllPostsOfUser);
router.route("/toggle-post").post(togglePost);

export default router;
