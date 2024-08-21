import express from "express";
const router = express.Router();

import {
  adminLeaveAvailabilityCheck,
  adminLeaveReport,
  applyLeave,
  authorityName,
  leaveApproval,
  leaveAvailabilityCheck,
  leaveCalender,
  leaveRejection,
  leaveReport,
  leaveStatusCheck,
} from "../controller/leave.controller.js";

import { handleValidationErrorsForLeave } from "../validator/leave.validator.js";
import authenticatedUser from "../middleware/auth.middleware.js";
router.route("/leavecalender").get(leaveCalender);

router.use(authenticatedUser);
router.route("/applyleave").post(handleValidationErrorsForLeave, applyLeave); //authenticatedUser
router.route("/approveleave/:id").get(leaveApproval);
router.route("/rejectleave/:id").get(leaveRejection);
router.route("/leavereport").get(leaveReport);
router.route("/adminleavereport").get(adminLeaveReport);
router.route("/leavestatus").get(leaveStatusCheck);
router.route("/leaveavailable").get(leaveAvailabilityCheck);
router.route("/adminleaveavailable").get(adminLeaveAvailabilityCheck);
router.route("/authority").get(authorityName);

export default router;

