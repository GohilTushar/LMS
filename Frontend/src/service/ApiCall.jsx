import axios from "axios";
import {
  applyLeave,
  approveLeave,
  deleteUser,
  forgotPassword,
  getAdminLeaveReport,
  getAllUser,
  getAuthority,
  getAvailableLeave,
  getLeaveReport,
  getLeaveStatus,
  getProfile,
  leaveCalender,
  logIn,
  rejecteLeave,
  resetPassword,
  staffRegister,
  studentRegister,
  updateProfile,
  updateUser,
  verifyOtp,
} from "./Api";
import ApiClient from "./ApiClient";

const getAllUserAPI = async (page, sortField, sortOrder) => {
  const response = await ApiClient.get(getAllUser, {
    params: {
      page,
      limit: 5,
      sortField,
      sortOrder,
    },
  });
  return response;
};

const deleteUserAPI = async (id) => {
  const response = await ApiClient.delete(`${deleteUser}/${id}`);
  return response;
};

const adminLeaveReportAPI = async (page, sortField, sortOrder, status) => {
  const response = await ApiClient.get(getAdminLeaveReport, {
    params: {
      page,
      limit: 5,
      sortField,
      sortOrder,
      status,
    },
  });
  return response;
};

const approveLeaveAPI = async (id) => {
  const response = await ApiClient.get(`${approveLeave}/${id}`);
  return response;
};
const rejectLeaveAPI = async (id) => {
  const response = await ApiClient.get(`${rejecteLeave}/${id}`);
  return response;
};

const getAuthorityAPI = async (role) => {
  const response = await ApiClient.get(`${getAuthority}?role=${role}`);
  return response;
};

const applyLeaveAPI = async (values) => {
  const response = await ApiClient.post(applyLeave, values, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

const getLeaveStatusAPI = async (page, sortField, sortOrder, status) => {
  const response = await ApiClient.get(getLeaveStatus, {
    params: {
      page,
      limit: 5,
      sortField,
      sortOrder,
      status,
    },
  });
  return response;
};

const getLeaveReportAPI = async (page, sortField, sortOrder, status) => {
  const response = await ApiClient.get(getLeaveReport, {
    params: {
      page,
      limit: 5,
      sortField,
      sortOrder,
      status,
    },
  });
  return response;
};

const loginAPI = async (values) => {
  const response = await axios.post(logIn, values);
  return response;
};

const studentRegisterAPI = async (formData) => {
  const response = await axios.post(studentRegister, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const updateProfileAPI = async (newValue) => {
  const response = await ApiClient.put(updateProfile, newValue, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const staffRegisterAPI = async (formData) => {
  const response = await ApiClient.post(staffRegister, formData);
  return response;
};

const updateUserAPI = async (id, newValue) => {
  const response = await ApiClient.put(`${updateUser}/${id}`, newValue, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const forgotPasswordAPI = async (values) => {
  const response = await axios.post(forgotPassword, { email: values.email });
  return response;
};

const verifyOtpAPI = async (values) => {
  const response = await axios.post(verifyOtp, values);
  console.log(response);

  return response;
};

const resetPasswordAPI = async (values) => {
  const response = await axios.post(resetPassword, values, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("resetPasswordToken"),
    },
  });
  return response;
};

const otherProfileAPI = async (id) => {
  const response = await ApiClient.get(`${getProfile}/${id}`);
  return response;
};

const getProfileAPI = async () => {
  const response = await ApiClient.get(getProfile);
  return response;
};

const leaveCalenderAPI = async () => {
  const response = await axios.get(leaveCalender);
  return response;
};

const getAvailableLeaveAPI = async () => {
  const response = await ApiClient.get(getAvailableLeave);
  return response;
};

export {
  getAllUserAPI,
  deleteUserAPI,
  adminLeaveReportAPI,
  approveLeaveAPI,
  rejectLeaveAPI,
  getAuthorityAPI,
  applyLeaveAPI,
  getLeaveStatusAPI,
  getLeaveReportAPI,
  loginAPI,
  studentRegisterAPI,
  updateProfileAPI,
  staffRegisterAPI,
  updateUserAPI,
  forgotPasswordAPI,
  verifyOtpAPI,
  resetPasswordAPI,
  otherProfileAPI,
  getProfileAPI,
  leaveCalenderAPI,
  getAvailableLeaveAPI,
};

// const getAllUserAPI = async (page, sortField, sortOrder) => {
//   const response = await axios.get(getAllUser, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     params: {
//       page,
//       limit: 5,
//       sortField,
//       sortOrder,
//     },
//   });
//   return response;
// };

// const deleteUserAPI = async (id) => {
//   const response = await axios.delete(`${deleteUser}/${id}`, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const adminLeaveReportAPI = async (page, sortField, sortOrder, status) => {
//   const response = await axios.get(getAdminLeaveReport, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     params: {
//       page,
//       limit: 5,
//       sortField,
//       sortOrder,
//       status,
//     },
//   });
//   return response;
// };

// const approveLeaveAPI = async (id) => {
//   const response = await axios.get(`${approveLeave}/${id}`, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };
// const rejectLeaveAPI = async (id) => {
//   const response = await axios.get(`${rejecteLeave}/${id}`, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const getAuthorityAPI = async (role) => {
//   const response = await axios.get(`${getAuthority}?role=${role}`, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const applyLeaveAPI = async (values) => {
//   const response = await axios.post(applyLeave, values, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const getLeaveStatusAPI = async (page, sortField, sortOrder, status) => {
//   const response = await axios.get(getLeaveStatus, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     params: {
//       page,
//       limit: 5,
//       sortField,
//       sortOrder,
//       status,
//     },
//   });
//   return response;
// };

// const getLeaveReportAPI = async (page, sortField, sortOrder, status) => {
//   const response = await axios.get(getLeaveReport, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     params: {
//       page,
//       limit: 5,
//       sortField,
//       sortOrder,
//       status,
//     },
//   });
//   return response;
// };

// const loginAPI = async (values) => {
//   const response = await axios.post(logIn, values);
//   return response;
// };

// const studentRegisterAPI = async (formData) => {
//   const response = await axios.post(studentRegister, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response;
// };

// const updateProfileAPI = async (newValue) => {
//   const response = await axios.put(updateProfile, newValue, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const staffRegisterAPI = async (formData) => {
//   const response = await axios.post(staffRegister, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const updateUserAPI = async (id, newValue) => {
//   const response = await axios.put(`${updateUser}/${id}`, newValue, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const forgotPasswordAPI = async (values) => {
//   const response = await axios.post(forgotPassword, { email: values.email });
//   return response;
// };

// const verifyOtpAPI = async (values) => {
//   const response = await axios.post(verifyOtp, values);
//   return response;
// };

// const resetPasswordAPI = async (values) => {
//   const response = await axios.post(resetPassword, values, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("resetPasswordToken"),
//     },
//   });
//   return response;
// };

// const otherProfileAPI = async (id) => {
//   const response = await axios.get(`${getProfile}/${id}`, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const getProfileAPI = async () => {
//   const response = await axios.get(getProfile, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };

// const leaveCalenderAPI = async () => {
//   const response = await axios.get(leaveCalender);
//   return response;
// };

// const getAvailableLeaveAPI = async () => {
//   const response = await axios.get(getAvailableLeave, {
//     headers: {
//       Authorization: "Bearer " + localStorage.getItem("token"),
//     },
//   });
//   return response;
// };
