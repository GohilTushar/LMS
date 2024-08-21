const message = {
  //messages
  userRelated: {
    //user
    success: {
      userCreated: "User Created Successfully",
      userUpdated: "User updated Successfully",
      successLogin: "LogIn Successful",
      userDeleted: "User Deleted Successfully",
      successLogout: "Logout successful",
    },
    error: {
      userExisted: "User Already Exist",
      unauthorized: "You are not authorized",
      userNotExisted: "User Not Exist",
      failedLogin: "Invalid Credentials",
      noToken: "Access Denied: No Token Provided!",
      invalidToken: "Invalid Token",
      uploadTypeError: "Images Only!",
      invalidRole: "Invalid role entered",
    },
  },
  leaveRelated: {
    success:{
      leaveApplySuccess: "You have successfully apply for the leave",
      leaveApprove: "Leave approved successfully",
    },
    error:{
      leaveApplyfailed: "Failure occured during the leave apply",
      leaveReject: "Leave has been rejected",
      insufficientLeaveBalance: "You have no leave balance",
      noLeaveData: "No leave request founded",
      authorityNotExisted: "Please select a valid authority",
      wrongAuthorityAdmin: "You can only request your leave to Admin ",
      wrongAuthorityfaculty: "You can only request your leave to faculty "
    }
  },
  otpRelated: {
    success:{
      otpSent: "OTP sent successfully",
      otpVerificationSuccess: "OTP verified successfully",
    },
    error:{
      otpResend: "Since OTP has been expired,Please resend the OTP",
      otpNotVerified: "OTP not verified",
    }
  },
  common:{
    exceedLimit: "Page number cannot be greater than total pages",
    notAuthorized: "You are not authorized",
    denyToShow: "You are not authorized for leave approval",
    serverError: "Internal Server Error",
  }
  
};

const pageConstant = {
  page: 1,
  limit: 10,
};

const leaveConstant = {
  totalLeave: 12,
  availableLeave: 12,  //constant
  usedLeave: 0,
  acedemicYear: new Date().getFullYear(),
  totalWorkingDay: 236,
  attendancePercentage: 100,
}
 
//user leave otp error success
export { message, pageConstant ,leaveConstant};
