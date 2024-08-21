import * as Yup from "yup";

const loginInitialValues = {
  email: "",
  password: "",
};

const registrationInitialValues = {
  name: "",
  email: "",
  password: "",
  gender: "",
  department: "",
  phone: "",
  address: "",
  image: null,
};

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const registrationValidationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  gender: Yup.string().required("Gender is required"),
  department: Yup.string().required("Department is required"),
  phone: Yup.string().min(10).max(10).required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  image: Yup.mixed().required("File is required"),
});

const updateValidationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  gender: Yup.string().required("Gender is required"),
  department: Yup.string().required("Department is required"),
  phone: Yup.string().min(10).max(10).required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  image: Yup.mixed().required("File is required"),
});

const forgotPasswordInitialValues = {
  email: "",
};

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const resetPasswordInitialValues = {
  password: "",
};

const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const verifyOtpInitialValues = {
  email: "",
  otp: "",
};

const verifyOtpValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  otp: Yup.string().required("OTP is required"),
});

const applyLeaveInitialValues = {
  startDate: "",
  endDate: "",
  requestToId: "",
  leaveType: "",
  reason: "",
};

const applyLeaveValidationSchema = Yup.object().shape({
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  requestToId: Yup.string().required("Request to ID is required"),
  leaveType: Yup.string().required("Leave type is required"),
  reason: Yup.string().required("Reason is required"),
});

export {
  registrationInitialValues,
  loginInitialValues,
  loginValidationSchema,
  registrationValidationSchema,
  updateValidationSchema,
  forgotPasswordInitialValues,
  forgotPasswordValidationSchema,
  resetPasswordInitialValues,
  resetPasswordValidationSchema,
  verifyOtpInitialValues,
  verifyOtpValidationSchema,
  applyLeaveInitialValues,
  applyLeaveValidationSchema,
};
