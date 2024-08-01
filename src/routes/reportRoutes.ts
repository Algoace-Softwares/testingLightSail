import express from "express";

import { checkSchemaError } from "../middleware/validations";

import {
  createReport,
  getAllReports,
  getReportById,
  getReportByUserId,
  searchReports,
  updateReport,
} from "../controllers/reportController";
import { createReportSchema, updateReportSchema } from "../middleware/schemas/requestSchemas";

const router = express.Router();

/*
 ** REPORT ROUTES
 */
router.route("/").post(createReportSchema, checkSchemaError, createReport);
router.route("/all").get(getAllReports);
router.route("/search").post(searchReports);
router.route("/:reportId").get(getReportById);
router.route("/user/:reportedId").get(getReportByUserId);
router.route("/:reportId").patch(updateReportSchema, checkSchemaError, updateReport);

export default router;
