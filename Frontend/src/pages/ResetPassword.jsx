import toast, { Toaster } from "react-hot-toast";
import CustomField from "../component/CustomField"; // Assuming you have a CustomField component
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { resetPasswordAPI } from "../service/ApiCall";
import {
  resetPasswordInitialValues,
  resetPasswordValidationSchema,
} from "../service/ValidationSchema";

const ResetPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await resetPasswordAPI(values);
      console.log(response);
      toast.success(response.data);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <Toaster />
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg p-8 transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
        <Formik
          enableReinitialize
          initialValues={resetPasswordInitialValues}
          validationSchema={resetPasswordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                Reset Password
              </h2>
              <CustomField
                label="New Password"
                name="password"
                type="password"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
