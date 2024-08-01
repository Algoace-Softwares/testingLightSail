import express from "express";
import {
  createConnection,
  updateConnection,
  getFollowers,
  getFollowings,
  checkUserConnection,
  deleteConnection,
} from "../controllers/connectionController";
import { checkSchemaError } from "../middleware/validations";
import { createConnectionSchema, updateConnectionSchema } from "../middleware/schemas/requestSchemas";

const router = express.Router();
/*
 ** CONNECTION ROUTES
 */
router.route("/").post(createConnectionSchema, checkSchemaError, createConnection);
router.route("/:connectionId").patch(updateConnectionSchema, checkSchemaError, updateConnection);
router.route("/:connectionId").delete(deleteConnection);
router.route("/followers/:userId").get(getFollowers);
router.route("/followings/:userId").get(getFollowings);
router.route("/").get(checkUserConnection);

export default router;
