const baseUrl = `http://localhost:3030/api`;

const getProfile = `${baseUrl}/user/profile`;
const logIn = `${baseUrl}/auth/login`;
const studentRegister = `${baseUrl}/user/student`;
const staffRegister = `${baseUrl}/user/staff`;
const updateProfile = `${baseUrl}/user/update`;
const updateUser = `${baseUrl}/user/update`;
const deleteUser = `${baseUrl}/user/delete`;
const leaveCalender = `${baseUrl}/leave/leavecalender`;
const getAllUser = `${baseUrl}/leave/adminleaveavailable`;
const getLeaveReport = `${baseUrl}/leave/leavereport`;
const getAdminLeaveReport = `${baseUrl}/leave/adminleavereport`;
const approveLeave = `${baseUrl}/leave/approveleave`;
const rejecteLeave = `${baseUrl}/leave/rejectleave`; 
const getAuthority = `${baseUrl}/leave/Authority`; 
const applyLeave = `${baseUrl}/leave/applyleave`;
const getLeaveStatus = `${baseUrl}/leave/leavestatus`;
const getAvailableLeave = `${baseUrl}/leave/leaveavailable`;
const forgotPassword = `${baseUrl}/auth/forgotpassword`;
const resetPassword = `${baseUrl}/auth/resetpassword`;
const verifyOtp = `${baseUrl}/auth/otpverify`;

export {
  getProfile,
  logIn,
  studentRegister,
  staffRegister,
  updateProfile,
  updateUser,
  leaveCalender,
  getAllUser,
  approveLeave,
  rejecteLeave,
  getAuthority,
  applyLeave,
  getAvailableLeave,
  forgotPassword,
  verifyOtp,
  resetPassword,
  deleteUser,
  getLeaveStatus,
  getLeaveReport,
  getAdminLeaveReport,
};
