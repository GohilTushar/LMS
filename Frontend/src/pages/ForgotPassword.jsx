import toast, { Toaster } from "react-hot-toast";
import CustomField from "../component/CustomField";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { forgotPasswordAPI } from "../service/ApiCall";
import { forgotPasswordInitialValues,forgotPasswordValidationSchema } from "../service/ValidationSchema";


const ForgotPassword = () => {
    const navigate=useNavigate()

  const handleSubmit = async (values) => {
    
    try {
      const response = await forgotPasswordAPI(values)
      toast.success(response.data);
      setTimeout(()=>{
        navigate("/verify",{ state: { email: values.email } })
      },1000)
    } catch (err) {
      console.log(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
    <Toaster/>
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg p-8 transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
        <Formik
          enableReinitialize
          initialValues={forgotPasswordInitialValues}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleSubmit}
        >
         {({ isSubmitting }) => (
            <Form className="p-2">
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                Forgot Password
              </h2>
              <CustomField
                label="Email address"
                name="email"
                type="email"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </Form>
          )}
      </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
