import express from "express";
const router = express.Router();

import {
  login,
  forgotPassword,
  verifyOtp,
  logout,
  resetPassword,
} from "../controller/auth.controller.js";

import passport from "passport";
import authenticatedUser from "../middleware/auth.middleware.js";

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    // failureRedirect: "https://localhost:3030/api/auth/student",
    failureRedirect: "/login",
    session:false
  }),
  (req, res) => {
    const { user,token } = req.user;
    console.log(user,token);
    res.json(user)
    // const role=user.role;
    // res.cookie("authToken", token, {
    //   httpOnly: true,       // Inaccessible to JavaScript in the browser
    //   secure: true,         // Use HTTPS in production
    //   sameSite: "strict",   // Helps prevent CSRF attacks
    //   maxAge: 24 * 60 * 60 * 1000 // 1 day
    // });
  
    // // You can set the role as a separate cookie, if needed
    // res.cookie("userRole", role, {
    //   httpOnly: true,       // Optional, depending on your needs
    //   secure: true,         // Use HTTPS in production
    //   sameSite: "strict",   // Helps prevent CSRF attacks
    //   maxAge: 24 * 60 * 60 * 1000 // 1 day
    // });
    // setTimeout(()=>{
    //   res.redirect(`http://localhost:5173/student`);
    // },1000)
  }
);

router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword); //remove dash
router.route("/otpverify").post(verifyOtp);
router.route("/resetpassword").post(authenticatedUser, resetPassword);
router.route("/logout").get(authenticatedUser, logout);

export default router;
