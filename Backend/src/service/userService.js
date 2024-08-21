import User from "../model/user.model.js";

const existanceOfUser = async (searchQuery) => {
  try {
    return await User.findOne(searchQuery);
  } catch (err) {
    return err;
  }
};

const existanceOfUserByPk = async (userId, attr = "password") => {
  try {
    return await User.findByPk(userId, { attributes: { exclude: [attr] } });
  } catch (err) {
    return err;
  }
};
//error
const userCreation = async (studentData, imgUpload, userRole) => {
  try {
    return await User.create({
      ...studentData,
      image: imgUpload,
      role: userRole,
    });
  } catch (err) {
    return err;
  }
};

const userUpdate = async (newData, id, imgUpload) => {
  try {
    return await User.update(
      { ...newData, image: imgUpload },
      { where: { id }, individualHooks: true }
    );
  } catch (err) {
    return err;
  }
};

const allUsers = async (searchQuery) => {
  try {
    return await User.findAndCountAll(searchQuery);
  } catch (err) {
    return err;
  }
};
const oneUser = async (id) => {
  try {
    return await User.findByPk(id);
  } catch (err) {
    return err;
  }
};

const userDelete = async (searchQuery) => {
  try {
    return await User.destroy(searchQuery);
  } catch (err) {
    return err;
  }
};

//otpService

const userPasswordReset = async (userDataWithNewPassword, searchQuery) => {
  try {
    return await User.update(userDataWithNewPassword, searchQuery);
  } catch (err) {
    return err;
  }
};

//leaveService

const findUserForCron = async (id) => {
  try {
    return await User.findOne({ where: { id } });
  } catch (err) {
    return err;
  }
};

export {
  existanceOfUser,
  userCreation,
  existanceOfUserByPk,
  userUpdate,
  allUsers,
  oneUser,
  userDelete,
  findUserForCron,
  userPasswordReset,
};
