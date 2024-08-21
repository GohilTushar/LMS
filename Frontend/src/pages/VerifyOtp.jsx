import toast, { Toaster } from "react-hot-toast";
import CustomField from "../component/CustomField"; // Assuming you have a CustomField component
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpAPI } from "../service/ApiCall";
import { verifyOtpInitialValues,verifyOtpValidationSchema } from "../service/ValidationSchema";


const VerifyOtp = () => {
    const navigate=useNavigate();
    const location=useLocation()
    verifyOtpInitialValues.email=location.state?.email;
    
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await verifyOtpAPI(values)
      toast.success(response.data.message);
      localStorage.setItem("resetPasswordToken",response.data.token)
      setTimeout(()=>{
        navigate("/reset")
      },2000)
    } catch (err) {
      console.log(err.response || "An error occurred");
      toast.error(err.response?.data || "An error occurred");
      setTimeout(()=>{
        (navigate("/verify"))
      },1000)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
    <Toaster/>
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg p-8 transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
        <Formik
          enableReinitialize
          initialValues={verifyOtpInitialValues}
          validationSchema={verifyOtpValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                Verify OTP
              </h2>
              <CustomField
                label="Email address"
                name="email"
                type="email"
              />
              <CustomField
                label="OTP"
                name="otp"
                type="number"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default VerifyOtp;
