import express from "express";
const router = express.Router();

import {
  studentSignup,
  staffSignup,
  getProfile,
  updateProfile,
  userList,
  updateUser,
  deleteUser,
  getOneProfile,
} from "../controller/user.controller.js";

import upload from "../middleware/upload.middleware.js";
import { handleValidationErrors } from "../validator/user.validator.js";
import authenticatedUser from "../middleware/auth.middleware.js";

router.route("/student").post(upload, handleValidationErrors, studentSignup);

router.use(authenticatedUser);
router.route("/staff").post(upload, handleValidationErrors, staffSignup);
router.route("/profile").get(authenticatedUser, getProfile);
router.route("/profile/:id").get(authenticatedUser, getOneProfile);
router.route("/update").put(upload, handleValidationErrors, updateProfile);
router.route("/update/:id").put(upload, handleValidationErrors, updateUser);
router.route("/users").get(userList);
router.route("/delete/:id").delete(deleteUser);

export default router;
