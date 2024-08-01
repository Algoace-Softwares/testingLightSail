import { Request, Response } from "express";
import { Users } from "../models/user.models";
import { STATUS_CODE } from "../config";
import { formatedError } from "../utils/formatedError";
import { Reports } from "../models/report.model";
import { Posts } from "../models/post.model";
/*
 ** Create a new report
 */
export const createReport = async (req: Request, res: Response) => {
  const { postId, reporterId, reportedId, reportType, reason } = req.body;

  try {
    const report = await Reports.create({
      postId,
      reportedId,
      reporterId,
      reportType,
      reason,
    });
    await Users.findByIdAndUpdate(reportedId, { $inc: { reportCount: 1 } });
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: report });
  } catch (error: unknown) {
    console.log("🚀 ~ createReport ~ error:", error);

    return formatedError(res, error);
  }
};
/*
 ** Get all reports
 */
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await Reports.find().populate([
      { path: "reportedId", select: "name nickName profileImage email accountStatus" },
      { path: "reporterId", select: "name nickName profileImage email accountStatus" },
      { path: "postId", select: "authorId desciption media location" },
    ]);
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: reports });
  } catch (error: unknown) {
    console.log("🚀 ~ getAllReports ~ error:", error);
    return formatedError(res, error);
  }
};
/*
 ** Get a report by ID
 */
export const getReportById = async (req: Request & { params: { reportId: string } }, res: Response) => {
  const { reportId } = req.params;
  try {
    const report = await Reports.findById(reportId).populate([
      { path: "reportedId", select: "name nickName profileImage email accountStatus" },
      { path: "reporterId", select: "name nickName profileImage email accountStatus" },
      { path: "postId", select: "authorId desciption media location" },
    ]);
    if (!report) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ success: false, message: "Report not found" });
    }
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: report });
  } catch (error: unknown) {
    console.log("🚀 ~ getReportById: error:", error);
    return formatedError(res, error);
  }
};
/*
 ** Get a report by ID
 */
export const getReportByUserId = async (req: Request & { params: { reportedId: string } }, res: Response) => {
  const { reportedId } = req.params;
  try {
    const report = await Reports.find({ reportedId }).populate([
      { path: "reportedId", select: "name nickName profileImage email accountStatus" },
      { path: "reporterId", select: "name nickName profileImage email accountStatus" },
      { path: "postId", select: "authorId desciption media location" },
    ]);
    if (!report) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ success: false, message: "Report not found" });
    }
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: report });
  } catch (error: unknown) {
    console.log("🚀 ~ getReportById: error:", error);
    return formatedError(res, error);
  }
};

/*
 ** Update a report (e.g., change ticket status, add admin feedback)
 */
export const updateReport = async (req: Request & { params: { reportId: string } }, res: Response) => {
  const { reportId } = req.params;
  const { ticketStatus, adminFeedback, action } = req.body;

  try {
    const report = await Reports.findByIdAndUpdate(
      reportId,
      { ticketStatus, adminFeedback },
      { new: true, runValidators: true },
    ).populate("reportedId");
    if (action === "BANNED" && report?.reportType === "USER") {
      // UPDATE USER RECORD IN DB
      await Users.findByIdAndUpdate(
        report?.reportedId,
        {
          accountStatus: "BANNED",
        },
        { new: true, runValidators: true },
      );
    } else if (action === "DELETED" && report?.reportType === "USER") {
      await Users.findByIdAndDelete(report?.reportedId);
    } else if (action === "WARNING") {
      console.log("send warning");
    } else if (action === "DELETED" && report?.reportType === "POST") {
      await Posts.findByIdAndDelete(report?.postId);
    }

    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: "Report successfully updated" });
  } catch (error: unknown) {
    return formatedError(res, error);
  }
};
/*
 ** Search for reports based on criteria
 */
export const searchReports = async (req: Request, res: Response) => {
  const { searchCriteria } = req.body;

  try {
    const reports = await Reports.find(searchCriteria).populate("post reporter reported");
    return res.status(STATUS_CODE.SUCCESS).json({ success: true, data: reports });
  } catch (error: unknown) {
    return formatedError(res, error);
  }
};
