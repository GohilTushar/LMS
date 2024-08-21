import otpGen from "otp-generator";

const otpGeneration = async () => {
  try {
    const generatedOtp=otpGen.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    return generatedOtp
  } catch (err) {
    return err;
  }
};

export default otpGeneration;
