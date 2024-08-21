import { message, pageConstant } from "../config/message.constant.js";
const { userRelated, leaveRelated, common } = message;
import { existanceOfUserByPk } from "../service/userService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { sendEmail } from "../utils/mail.js";
import handlebars from "handlebars";
import User from "../model/user.model.js";
import moment from "moment";
import {
  existanceOfUserInLeaveByPk,
  findLeaveUser,
  leaveAvailable,
  leaveCheckAdmin,
  leaveCreation,
  leaveStatus,
} from "../service/leaveService.js";

const applyLeave = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { startDate, endDate, requestToId, leaveType, reason } = req.body;

    const searchQuery = {
      where: { userId: id },
    };

    const userLeaveDetail = await findLeaveUser(searchQuery);

    if (!userLeaveDetail)
      return res.status(404).json(userRelated.error.userNotExisted);

    const start = moment(startDate, "YYYY-MM-DD");
    const end = moment(endDate, "YYYY-MM-DD");
    const days = leaveType == "Full day" ? 1 : 0.5;
    const leaveCount = (end.diff(start, "days") + 1) * days;

    if (userLeaveDetail.availableLeave - leaveCount < 0)
      return res.status(400).json(leaveRelated.error.insufficientLeaveBalance);

    const staffDetail = await existanceOfUserByPk(requestToId);

    if (!staffDetail)
      return res.status(404).json(leaveRelated.error.authorityNotExisted);

    if ((role == 2 || role == 3) && staffDetail.role != 1)
      return res.status(400).json(leaveRelated.error.wrongAuthorityAdmin);

    if (role == 4 && (staffDetail?.role == 1 || staffDetail?.role == 4))
      return res.status(400).json(leaveRelated.error.wrongAuthorityfaculty);

    const leaveCreated = await leaveCreation(
      id,
      startDate,
      endDate,
      requestToId,
      leaveType,
      reason
    );

    if (!leaveCreated)
      return res.status(400).json(leaveRelated.error.leaveApplyfailed);

    const studentDetail = await existanceOfUserByPk(id);

    const filePath = path.join(__dirname, "../views/applyLeave.hbs");
    const template = fs.readFileSync(filePath, "utf8");
    const compiledTemplate = handlebars.compile(template);

    const emailTemplate = compiledTemplate({
      facultyName: staffDetail.name,
      startDate,
      endDate,
      reason,
      studentName: studentDetail.name,
      studentEmail: studentDetail.email,
    });

    const mailOptions = {
      to: staffDetail.email,
      subject: "Apply For the leave",
      html: emailTemplate,
    };

    await sendEmail(mailOptions);

    return res.status(200).json(leaveRelated.success.leaveApplySuccess);
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const leaveReport = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role == 4) return res.status(400).json(common.notAuthorized);

    const {
      page = pageConstant.page,
      limit = pageConstant.limit,
      sortField = null,
      sortOrder = "asc",
      status=null
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const attr = ["password"];
    const excludeAttr = [
      "password",
      "class",
      "roleId",
      "createdAt",
      "updatedAt",
    ];
    const searchQuery = {
      where: {
        requestToId: id,
      },
      attributes: { exclude: attr },
      offset,
      limit: limitNumber,
      include: {
        model: User,
        as: "requestedBy",
        attributes: { exclude: excludeAttr },
      },
    };
    if (sortField) {
      if (['name', 'email', 'phone', 'department'].includes(sortField)) {
        searchQuery.order = [[{ model: User, as: "requestedBy" }, sortField, sortOrder]];
      } else {
        searchQuery.order = [[sortField, sortOrder]];
      }
    }
    if (status) {
      searchQuery.where.status = status;
    }
    const { rows: leaveList, count: totalLeave } =
      await leaveStatus(searchQuery);

    if (totalLeave == 0)
      return res.status(404).json(leaveRelated.error.noLeaveData);
    const totalPages = Math.ceil(totalLeave / limitNumber);

    if (pageNumber > totalPages)
      return res.status(400).json(common.exceedLimit);

    return res.status(200).json({
      leaveList,
      pagination: {
        totalLeave,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const adminLeaveReport = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != 1) return res.status(400).json(common.notAuthorized);
   
    const {
      page = pageConstant.page,
      limit = pageConstant.limit,
      sortField = null,
      sortOrder = "asc",
      status=null
    } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const attr = ["password"];
    const excludeAttr = [
      "password",
      "address",
      "roleId",
      "createdAt",
      "updatedAt",
    ];

    const searchQuery = {
      where:{},
      attributes: { exclude: attr },
      offset,
      limit: limitNumber,
      include: {
        model: User,
        as: "requestedBy",
        attributes: {
          exclude: excludeAttr,
        },
      },
    };
    if (sortField) {
      if (['name', 'email', 'phone', 'department'].includes(sortField)) {
        searchQuery.order = [[{ model: User, as: "requestedBy" }, sortField, sortOrder]];
      } else {
        searchQuery.order = [[sortField, sortOrder]];
      }
    }
    
    if (status) {
      console.log(status);
      searchQuery.where.status = status;
    }

    const { rows: leaveList, count: totalLeave } =
      await leaveStatus(searchQuery);
    
    if (totalLeave == 0)
      return res.status(404).json(leaveRelated.error.noLeaveData);
    const totalPages = Math.ceil(totalLeave / limitNumber);

    if (pageNumber > totalPages)
      return res.status(400).json(common.exceedLimit);

    return res.status(200).json({
      leaveList,
      pagination: {
        totalLeave,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const leaveCalender = async (req, res) => {
  try {
    const attr = ["password"];
    const excludeAttr = [
      "password",
      "address",
      "roleId",
      "createdAt",
      "updatedAt",
    ];

    const searchQuery = {
      attributes: { exclude: attr },
      include: {
        model: User,
        as: "requestedBy",
        attributes: {
          exclude: excludeAttr,
        },
      },
    };

    const { rows: leaveList, count: totalLeave } =
      await leaveStatus(searchQuery);
    
    if (totalLeave == 0)
      return res.status(404).json(leaveRelated.error.noLeaveData);
    return res.status(200).json(leaveList);
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const leaveApproval = async (req, res) => {
  try {
    const { role, name, email } = req.user;
    if (role == 4) return res.status(400).json(common.denyToShow);

    const { id } = req.params;
    const leaveDetail = await existanceOfUserInLeaveByPk(id);

    if (!leaveDetail)
      return res.status(404).json(userRelated.error.userNotExisted);

    const start = moment(leaveDetail.startDate, "YYYY-MM-DD");
    const end = moment(leaveDetail.endDate, "YYYY-MM-DD");
    const days = leaveDetail.leaveType == "Full day" ? 1 : 0.5;
    const leaveCount = (end.diff(start, "days") + 1) * days;

    const leaveTakerDetail = await existanceOfUserByPk(leaveDetail.userId);
    const searchQuery = {
      where: { userId: leaveDetail.userId },
    };
    const leaveUser = await findLeaveUser(searchQuery);

    leaveDetail.status = "Approved";
    await leaveDetail.save();

    leaveUser.usedLeave += leaveCount;
    leaveUser.availableLeave = leaveUser.totalLeave - leaveUser.usedLeave;
    leaveUser.totalWorkingDay -= leaveCount;
    leaveUser.attendancePercentage = (leaveUser.totalWorkingDay / 236) * 100;

    await leaveUser.save();

    const filePath = path.join(__dirname, "../views/approveLeave.hbs");
    const template = fs.readFileSync(filePath, "utf8");
    const compiledTemplate = handlebars.compile(template);

    const emailTemplate = compiledTemplate({
      leaveGiverName: name,
      leaveGiverEmail: email,
      startDate: leaveDetail.startDate,
      endDate: leaveDetail.endDate,
      reason: leaveDetail.reason,
      leaveTakerName: leaveTakerDetail.name,
    });

    const mailOptions = {
      to: leaveTakerDetail.email,
      subject: "Leave Approval",
      html: emailTemplate,
    };

    await sendEmail(mailOptions);

    return res.status(200).json(leaveRelated.success.leaveApprove);
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const leaveRejection = async (req, res) => {
  try {
    const { role, name } = req.user;
    if (role == 4) return res.status(400).json(common.denyToShow);

    const { id } = req.params;
    const leaveDetail = await existanceOfUserInLeaveByPk(id);

    if (!leaveDetail)
      return res.status(404).json(userRelated.error.userNotExisted);

    const leaveTakerDetail = await existanceOfUserByPk(leaveDetail.userId);

    leaveDetail.status = "Rejected";
    await leaveDetail.save();

    const filePath = path.join(__dirname, "../views/rejectLeave.hbs");
    const template = fs.readFileSync(filePath, "utf8");
    const compiledTemplate = handlebars.compile(template);

    const emailTemplate = compiledTemplate({
      leaveGiverName: name,
      startDate: leaveDetail.startDate,
      endDate: leaveDetail.endDate,
      leaveTakerName: leaveTakerDetail.name,
    });

    const mailOptions = {
      to: leaveTakerDetail.email,
      subject: "Leave Rejection",
      html: emailTemplate,
    };

    await sendEmail(mailOptions);

    return res.status(200).json(leaveRelated.error.leaveReject);
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const leaveStatusCheck = async (req, res) => {
  try {
    const { id } = req.user;

    const {
      page = pageConstant.page,
      limit = pageConstant.limit,
      sortField = null,
      sortOrder = "ASC",
      status=null
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const attr = ["password"];
    const excludeAttr = [
      "password",
      "address",
      "roleId",
      "createdAt",
      "updatedAt",
    ];
    const searchQuery = {
      where: {
        userId: id,
      },
      attributes: { exclude: [attr] },
      offset,
      limit: limitNumber,
      include: {
        model: User,
        as: "requestedBy",
        attributes: {
          exclude: excludeAttr,
        },
      },
    };
    if (status) {
      searchQuery.where.status = status;
    }
    if (sortField) {
      if (['name', 'email', 'phone', 'department'].includes(sortField)) {
        searchQuery.order = [[{ model: User, as: "requestedBy" }, sortField, sortOrder]];
      } else {
        searchQuery.order = [[sortField, sortOrder]];
      }
    }
    const { rows: leaveList, count: totalLeave } =
      await leaveStatus(searchQuery);

    if (totalLeave == 0)
      return res.status(404).json(leaveRelated.error.noLeaveData);
    const totalPages = Math.ceil(totalLeave / limitNumber);

    if (pageNumber > totalPages)
      return res.status(400).json(common.exceedLimit);

    return res.status(200).json({
      leaveList,
      pagination: {
        totalLeave,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const leaveAvailabilityCheck = async (req, res) => {
  try {
    const { id } = req.user;
    const { page = pageConstant.page, limit = pageConstant.limit } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const attr = ["password"];
    const excludeAttr = [
      "password",
      "address",
      "roleId",
      "createdAt",
      "updatedAt",
    ];
    const searchQuery = {
      where: {
        userId: id,
      },
      attributes: { exclude: attr },
      offset,
      limit: limitNumber,
      include: {
        model: User,
        attributes: {
          exclude: excludeAttr,
        },
      },
    };
    const leaveList = await leaveAvailable(searchQuery);

    return res.status(200).json(leaveList);
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const adminLeaveAvailabilityCheck = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != 1) return res.status(400).json(common.notAuthorized);

    const {
      page = pageConstant.page,
      limit = pageConstant.limit,
      sortField = null,
      sortOrder = "asc",
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const attr = ["password"];
    const excludeAttr = [
      "password",
      "address",
      "roleId",
      "createdAt",
      "updatedAt",
    ];

    const searchQuery = {
      attributes: { exclude: attr },
      offset,
      limit: limitNumber,
      include: {
        model: User,
        attributes: {
          exclude: excludeAttr,
        },
      },
    };
    if (sortField) {
      if (['name', 'email', 'phone', 'department'].includes(sortField)) {
        searchQuery.order = [[{ model: User, as: "requestedBy" }, sortField, sortOrder]];
      } else {
        searchQuery.order = [[sortField, sortOrder]];
      }
    }
    const { rows: leaveList, count: totalLeave } =
      await leaveCheckAdmin(searchQuery);

    if (totalLeave == 0) return res.status(404).json(leaveRelated.noLeaveData);
    const totalPages = Math.ceil(totalLeave / limitNumber);

    if (pageNumber > totalPages)
      return res.status(400).json(common.exceedLimit);

    return res.status(200).json({
      leaveList,
      pagination: {
        totalLeave,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (err) {
    if (err) return res.status(400).json(err);
    return res.status(500).json(common.serverError);
  }
};

const authorityName = async (req, res) => {
  try {
    const { role } = req.query;
    let findAuthority;
    if (role === "2" || role === "3") {
      findAuthority = 1;
    } else if (role === "4") {
      findAuthority = [2, 3];
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const authority = await User.findAll({
      where: {
        role: findAuthority,
      },
    });

    return res.status(200).json(authority);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  applyLeave,
  leaveReport,
  adminLeaveReport,
  leaveCalender,
  leaveApproval,
  leaveStatusCheck,
  leaveAvailabilityCheck,
  adminLeaveAvailabilityCheck,
  leaveRejection,
  authorityName,
};
