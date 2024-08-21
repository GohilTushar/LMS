import { checkSchema, validationResult } from "express-validator";
import fs from "fs";

const userValidationSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Name should be at least 3 characters",
    },
    trim: true,
  },
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password should be at least 6 characters",
    },
  },
  gender: {
    notEmpty: {
      errorMessage: "Gender is required",
    },
    isIn: {
      options: [["Male", "Female"]],
      errorMessage: "Gender must be either Male or Female",
    },
  },
  phone: {
    notEmpty: {
      errorMessage: "Phone number is required",
    },
    isMobilePhone: {
      errorMessage: "Invalid phone number format",
    },
  },
  address: {
    notEmpty: {
      errorMessage: "Address is required",
    },
  },
  department: {
    notEmpty: {
      errorMessage: "Department is required",
    },
  },
  image: {
    custom: {
      options: (value, { req }) => {
        if (!req.file) throw new Error("Image is required");

        return true;
      },
    },
  },
});

const handleValidationErrors=[
  userValidationSchema,
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      if (req.file?.path) fs.unlinkSync(req.file.path);
      return res.status(400).json(err.errors[0].msg);
    }
    next();
  },
]
export { handleValidationErrors };
