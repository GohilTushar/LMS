import Otp from "../model/otp.model.js";

const findUserForOTP = async (searchQuery) => {
  try {
    const otpUserData = await Otp.findOne(searchQuery);
    if (!otpUserData) return false;
    return otpUserData;
  } catch (err) {
    return err;
  }
};

const otpCreation = async (email, otp, userId, roleId) => {
  try {
    return await Otp.create({
      email,
      otp,
      userId,
      roleId,
    });
  } catch (err) {
    return err;
  }
};

const otpDeletion = async (searchQuery) => {
  try {
    return await Otp.destroy(searchQuery);
  } catch (err) {
    return err;
  }
};

export { findUserForOTP, otpCreation, otpDeletion };
