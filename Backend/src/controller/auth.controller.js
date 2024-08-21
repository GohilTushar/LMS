import bcrypt from "bcrypt";
import generateAuthToken from "../utils/generateToken.js";
import {
  findUserForOTP,
  otpCreation,
  otpDeletion,
} from "../service/otpService.js";

import { existanceOfUser, userPasswordReset } from "../service/userService.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { message } from "../config/message.constant.js";
import otpGeneration from "../utils/generateOtp.js";
import { sendEmail } from "../utils/mail.js";
import handlebars from "handlebars";
const { userRelated, otpRelated ,common} = message;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const searchQuery={ where: { email } }

    const userExist = await existanceOfUser(searchQuery);

    if (!userExist) return res.status(404).json(userRelated.error.userNotExisted);

    const isValidUser = await bcrypt.compare(password, userExist.password);

    if (!isValidUser) return res.status(400).json(userRelated.error.failedLogin);

    const token = generateAuthToken({
      id: userExist.id,
      email: userExist.email,
      role: userExist.role
    });

    //prettier eslint
    

    return res
    .status(200)
    .cookie("token", token, {  //cookie token (LS)
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    })
    .json({ message: userRelated.success.successLogin, token ,userExist, role: userExist.role});
  } catch (err) {
    if(err)return res.status(400).json(err); //err serverError
    return res.status(500).json(common.serverError);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const searchQuery={ where: { email } }
    const userData = await existanceOfUser(searchQuery);

    if (!userData) return res.status(404).json(userRelated.error.userNotExisted);

    const otp = await otpGeneration();

    const filePath = path.join(__dirname, "../views/sendOtp.hbs");
    const template = fs.readFileSync(filePath, "utf8");
    const compiledTemplate = handlebars.compile(template);

    const emailTemplate = compiledTemplate({
      userName: userData.name,
      otp: otp,
    });

    const mailOptions = {
      to: userData.email,
      subject: "Password Reset",
      html: emailTemplate,
    };

    await sendEmail(mailOptions);

    await otpCreation(email, otp, userData.id, userData.role);


    setTimeout(async () => {
      await otpDeletion(searchQuery);
    }, 60 * 10 * 1000);

    return res.status(200).json(otpRelated.success.otpSent);
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const searchQuery={
      where: { email }
    }
    const otpUserDetails = await findUserForOTP(searchQuery);
    
    
    if (!otpUserDetails) return res.status(400).json(otpRelated.error.otpResend);
    
    if (otpUserDetails.otp != otp) return res.status(400).json(otpRelated.error.otpNotVerified);

    const token = generateAuthToken({
      id: otpUserDetails.id,
      email: otpUserDetails.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ message: otpRelated.success.otpVerificationSuccess, token: token });
  } catch (err) {
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const oldUserData = req.user;

    const searchQuery = {
      where: { id: oldUserData.id },
      individualHooks: true,
    };

    await userPasswordReset({ ...oldUserData, password }, searchQuery);

    res.clearCookie("token");

    return res.status(200).json(userRelated.success.userUpdated);
  } catch (err) {
    console.log(err);
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json(userRelated.error.userNotExisted);
    res.clearCookie("token");
    res.status(200).send(userRelated.success.successLogout);
  } catch (err) {
    console.log(err);
    if(err)return res.status(400).json(err); 
    return res.status(500).json(common.serverError);
  }
};

export { login, forgotPassword, verifyOtp, logout, resetPassword };


