import roleObj from "../config/role.constant.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { sendEmail } from "../utils/mail.js";
import handlebars from "handlebars";

import {
  uploadOnCloudinary,
  updateProfilePhoto,
  generatePublicId,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import { userLeaveCreation } from "../service/leaveService.js";

import {
  existanceOfUser,
  userCreation,
  userUpdate,
  allUsers,
  existanceOfUserByPk,
  userDelete,
  oneUser,
} from "../service/userService.js";

import { message, pageConstant } from "../config/message.constant.js";
const { userRelated ,common} = message;

const studentSignup = async (req, res) => {
  try {
    const studentData = req.body;
    const studentImage = req.file.path;
    console.log(req.file);

    const searchQuery = {
      where:{email:studentData.email}
    };
    const studentExist = await existanceOfUser(searchQuery);

    if (studentExist) {
      fs.unlinkSync(studentImage);
      return res.status(409).json({message:userRelated.error.userExisted,data:[]});
    }

    const imgUpload = await uploadOnCloudinary(
      studentImage,
      req.file.originalname
    );

    const studentCreated = await userCreation(
      studentData,
      imgUpload,
      roleObj.student
    );

    await userLeaveCreation(studentCreated.id);

    const filePath = path.join(__dirname, "../views/register.hbs");
    const template = fs.readFileSync(filePath, "utf8");
    const compiledTemplate = handlebars.compile(template);

    const emailTemplate = compiledTemplate({
      userName: studentData.name,
      userEmail: studentData.email,
      userPhone: studentData.phone,
      userAddress: studentData.address,
    });

    const mailOptions = {
      to: studentData.email,
      subject: "Welcome to LMS",
      html: emailTemplate,
    };

    await sendEmail(mailOptions);

    return res.status(201).json(userRelated.success.userCreated);
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const staffSignup = async (req, res) => {
  try {
    const { role } = req.user;

    if (role != 1) return res.status(400).json(userRelated.error.unauthorized);

    const staffData = req.body;
    const staffImage = req.file.path;

    const searchQuery = {
      where:{email:staffData.email}
    };

    const staffExist = await existanceOfUser(searchQuery);

    if (staffExist) {
      fs.unlinkSync(staffImage);
      return res.status(409).json(userRelated.error.userExisted);
    }

    const imgUpload = await uploadOnCloudinary(
      staffImage,
      req.file.originalname
    );

    const staffCreated = await userCreation(
      staffData,
      imgUpload,
      roleObj.staff
    );

    await userLeaveCreation(staffCreated.id);

    return res.status(201).json(userRelated.success.userCreated);
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

// const hodSignup = async (req, res) => {
//   try {
//     const { role } = req.user;

//     if (role != 1) return res.status(400).json(userRelated.error.unauthorized);

//     const hodData = req.body;
//     const hodImage = req.file.path;

//     const searchQuery = {
//       where:{email:hodData.email}
//     };

//     const hodExist = await existanceOfUser(searchQuery)

//     if (hodExist) {
//       fs.unlinkSync(hodImage);
//       return res.status(409).json(userRelated.error.userExisted);
//     }

//     const imgUpload = await uploadOnCloudinary(
//       hodImage, 
//       req.file.originalname
//     );

//     const hodCreated = await userCreation(
//       hodData, 
//       imgUpload, 
//       roleObj.hod
//     );

//     await userLeaveCreation(hodCreated.id);

//     return res.status(201).json(userRelated.success.userCreated);
//   } catch (err) {
//     if(err)return res.status(400).json(err); 
//     return res.status(500).json(common.serverError);
//   }
// };

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};
const getOneProfile = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != 1) return res.status(400).json(userRelated.error.unauthorized);
    const {id} = req.params;
    const user = await oneUser(id)
    return res.status(200).json(user);
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const updateProfile = async (req, res) => {
  try {

    const { id, image, email } = req.user;

    const newUpdatedData = req.body;
    const newUpdatedImage = req.file.path;

    console.log(email);
    console.log(newUpdatedData.email);

    if (email != newUpdatedData.email && (await existanceOfUser(newUpdatedData.email))) {
      if (newUpdatedImage) fs.unlinkSync(newUpdatedImage);
      return res.status(400).json(userRelated.error.userExisted);
    }

    const publicId = await generatePublicId(image);

    const imgUpload = await updateProfilePhoto(
      newUpdatedImage,
      req.file.originalname,
      publicId
    );

    if (!imgUpload) return res.status(400).json(userRelated.error.uploadTypeError);

    await userUpdate(newUpdatedData, id, imgUpload);
    return res.status(200).json({message:userRelated.success.userUpdated,body:newUpdatedData,file:imgUpload});
  } catch (err) {
    const path = req.file?.path;
    if (path) fs.unlinkSync(path);
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const userList = async (req, res) => {
  try {
    const { role } = req.user;

    if (role != 1) return res.status(400).json(userRelated.error.unauthorized);

    const {
      page = pageConstant.page,
      limit = pageConstant.limit,
      roleName = "",
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    let userRole;

    if (roleName === "student") userRole = roleObj.student;
    else if (roleName === "hod") userRole = roleObj.hod;
    else if (roleName === "staff") userRole = roleObj.staff;
    else return res.status(400).json(userRelated.error.invalidRole);

    const attr = ["password"];
    const searchQuery = {
      where: {
        role: userRole,
      },
      attributes: { exclude: attr },
      offset,
      limit: limitNumber,
    };
    const { rows: users, count: totalUsers } = await allUsers(searchQuery);

    if (totalUsers == 0) return res.status(404).json(userRelated.error.userNotExisted);

    const totalPages = Math.ceil(totalUsers / limitNumber);

    if (pageNumber > totalPages) return res.status(400).json(common.exceedLimit);

    return res.status(200).json({
      userList: users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const updateUser = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;

    if (role != 1) return res.status(400).json(userRelated.error.unauthorized);

    const newUpdatedData = req.body;
    const newUpdatedImage = req.file.path;

    const userToBeUpdated = await existanceOfUserByPk(id);

    if(!userToBeUpdated) return res.status(400).json(userRelated.error.userNotExisted);

    const searchQuery={
      where:{email:newUpdatedData.email}
    }

    if (userToBeUpdated.email != newUpdatedData.email && (await existanceOfUser(searchQuery))) {
      if (newUpdatedImage) fs.unlinkSync(newUpdatedImage);
      return res.status(400).json(userRelated.error.userExisted);
    }

    const publicId = await generatePublicId(userToBeUpdated.image);

    const imgUpload = await updateProfilePhoto(
      newUpdatedImage,
      req.file.originalname,
      publicId
    );
    if (!imgUpload) return res.status(400).json(userRelated.error.uploadTypeError);

    await userUpdate(newUpdatedData, id, imgUpload);
    return res.status(200).json(userRelated.success.userUpdated);
  } catch (err) {
    const path = req.file?.path;
    if (path) fs.unlinkSync(path);
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { role } = req.user;

    if (role != 1) return res.status(400).json(userRelated.error.unauthorized);

    const { id } = req.params;
    const userToBeDeleted = await existanceOfUserByPk(id);

    if (!userToBeDeleted) return res.status(400).json(userRelated.error.userNotExisted);

    const publicId = await generatePublicId(userToBeDeleted.image);
    if (publicId) await deleteFromCloudinary(publicId);

    const searchQuery={ where: { id } }

    await userDelete(searchQuery);
    return res.status(200).json(userRelated.success.userDeleted);
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

export {
  studentSignup,
  staffSignup,
  getProfile,
  getOneProfile,
  updateProfile,
  userList,
  updateUser,
  deleteUser,
};
