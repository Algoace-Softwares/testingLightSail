import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getAllUsers,
  updateUser,
  toggleBlockUser,
  getBlockedUsers,
  uploadSignedUrl,
} from "../controllers/userController";
import { checkSchemaError } from "../middleware/validations";
import {
  createUserSchema,
  signedUrlSchema,
  updateUserSchema,
} from "../middleware/schemas/requestSchemas";
// DEFINE EXPRESS ROUTE
const router = express.Router();
/*
 ** USER ROUTES
 */
router.route("/").post(createUserSchema, checkSchemaError, createUser);
router.route("/all").get(getAllUsers);
router.route("/").get(getUser);
router.route("/signed-url/:userId").post(signedUrlSchema, checkSchemaError, uploadSignedUrl);
router.route("/block").post(toggleBlockUser);
router.route("/block/:userId").get(getBlockedUsers);
router.route("/:userId").patch(updateUserSchema, checkSchemaError, updateUser);
router.route("/:userId").delete(deleteUser);

export default router;
