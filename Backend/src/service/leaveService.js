import UserLeave from "../model/userleave.model.js";
import LeaveRequest from "../model/leaveRequest.model.js";
import { leaveConstant } from "../config/message.constant.js";

const userLeaveCreation = async (userId) => {
  try {
    return await UserLeave.create({
      userId,
      totalLeave: leaveConstant.totalLeave,
      availableLeave: leaveConstant.availableLeave,  //constant
      usedLeave: leaveConstant.usedLeave,
      acedemicYear: leaveConstant.acedemicYear,
      totalWorkingDay: leaveConstant.totalWorkingDay,
      attendancePercentage: leaveConstant.attendancePercentage,
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getPendingLeaveRequests = async (searchQuery) => {
  try {
    return await LeaveRequest.findAll(searchQuery);
  } catch (err) {
    return err;
  }
};

const leaveAvailable = async (searchQuery) => {
  try {
    return await UserLeave.findOne(searchQuery);
  } catch (err) {
    return err;
  }
};

const leaveCheckAdmin = async (searchQuery) => {
  try {
    return await UserLeave.findAndCountAll(searchQuery);
  } catch (err) {
    return err;
  }
};

const leaveStatus = async (searchQuery) => {
  try {
    return await LeaveRequest.findAndCountAll(searchQuery);
  } catch (err) {
    return err;
  }
};

const existanceOfUserInLeaveByPk = async (id) => {
  try {
    return await LeaveRequest.findByPk(id);
  } catch (err) {
    return err;
  }
};

const findLeaveUser = async (searchQuery) => {
  try {
    return await UserLeave.findOne(searchQuery);
  } catch (err) {
    return err;
  }
};

const leaveCreation = async (
  userId,
  startDate,
  endDate,
  requestToId,
  leaveType,
  reason
) => {
  try {
    return await LeaveRequest.create({
      userId,
      startDate,
      endDate,
      requestToId,
      leaveType,
      reason,
      status: "Pending",
    });
  } catch (err) {
    return err;
  }
};

export {
  getPendingLeaveRequests,
  userLeaveCreation,
  leaveAvailable,
  leaveStatus,
  existanceOfUserInLeaveByPk,
  findLeaveUser,
  leaveCheckAdmin,
  leaveCreation,
};
