import { useEffect, useRef, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import CustomField from "./CustomField";
import { Toaster } from "react-hot-toast";
import useAuth from "../context/Auth";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { getProfileAPI } from "../service/ApiCall";

const AuthForm = ({
  formType,
  initialValues,
  validationSchema,
  handleSubmit,
}) => {
  
  const [userData, setUserData] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) setFieldValue("image", file);
  };

  const getDataForUpdation = async () => {
    try {
      const response = await getProfileAPI();
      console.log(response);
      setUserData(response.data);
    } catch (error) {
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    if (formType === "update") getDataForUpdation();
  }, [formType]);

  const updateData = JSON.parse(localStorage.getItem("UpdateUser"));

  const staffUpdateInitialValue = {
    name: updateData?.name,
    email: updateData?.email,
    phone: updateData?.phone,
    gender: updateData?.gender,
    department: updateData?.department,
    address: updateData?.address,
    image: updateData?.image,
  };

  const updateInitialValues = {
    name: userData.name,
    email: userData.email,
    gender: userData.gender,
    department: userData.department,
    phone: userData.phone,
    address: userData.address,
    image: userData.image,
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    if (formType === "login") {
      let role;
      setTimeout(() => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        role = decodedToken.role;
        role === 4
          ? navigate("/student")
          : role === 1
          ? navigate("/admin")
          : navigate("/staff");
        login(role);
        console.log(role);
      }, 1000);
      await handleSubmit(values, resetForm);
    } 
    else if (formType === "register") {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        if (!localStorage.getItem("token")) {
          navigate("/login");
        } else {
          navigate("/admin");
        }
      }, 2000);
      await handleSubmit(values, resetForm);
    } 
    else if (formType === "update") {
      const response = await handleSubmit(
        values,
        userData.password,
        userData.image
      );
      if (!response) {
        navigate("/update");
        return;
      }
      setTimeout(() => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;
        userRole === 4
          ? navigate("/student")
          : userRole === 1
          ? navigate("/admin")
          : navigate("/staff");
      }, 1000);
    }
    else if (formType === "staffUpdate") {
      console.log("StaffUpdate");
      const response = await handleSubmit(
        values,
        updateData.password,
        updateData.image
      );
      if (!response) {
        navigate("/staffupdate");
        return;
      }
      setTimeout(() => {
        navigate("/admin/alluser");
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <Toaster />
      <div className="max-w-md w-full bg-white border rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl border-gray-300 ">
        <Formik
          enableReinitialize
          initialValues={
            formType === "update"
              ? updateInitialValues
              : formType === "staffUpdate"
              ? staffUpdateInitialValue
              : initialValues
          }
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                {formType === "login"
                  ? "Login"
                  : formType === "register"
                  ? "Registration"
                  : "Update Profile"}
              </h2>

              {formType === "login" ? (
                <>
                  <CustomField
                    label="Email address"
                    name="email"
                    type="email"
                  />
                  <CustomField
                    label="Password"
                    name="password"
                    type="password"
                  />
                </>
              ) : (
                <>
                  <CustomField label="Full Name" name="name" type="text" />

                  <CustomField
                    label="Email address"
                    name="email"
                    type="email"
                  />
                  {formType === "register" && (
                    <CustomField
                      label="Password"
                      name="password"
                      type="password"
                    />
                  )}

                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="">
                      <div className="flex flex-row gap-2">
                        <div className="mb-4">
                          <CustomField
                            label="Gender"
                            name="gender"
                            type="radio"
                            options={[
                              { label: "Male", value: "Male" },
                              { label: "Female", value: "Female" },
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <CustomField
                        label="Department"
                        as="select"
                        name="department"
                        className="block w-full p-1 border border-gray-600 rounded-md focus:outline-none focus:ring"
                      >
                        <option value="">Department</option>
                        <option value="hr">Human Resources</option>
                        <option value="engineering">Engineering</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                        <option value="finance">Finance</option>
                      </CustomField>
                    </div>
                  </div>

                  <CustomField label="Phone number" name="phone" type="tel" />
                  <CustomField label="Address" name="address" type="text" />

                  <div className="mb-5 flex flex-row items-center gap-3">
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        ref={fileInputRef}
                        onChange={(event) =>
                          handleFileChange(event, setFieldValue)
                        }
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      />
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="text-red-600 text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {formType === "login" && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-300"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <div className="flex justify-center items-center gap-3 my-3">
                <button type="submit" className="btn-primary">
                  {formType === "login"
                    ? "Login"
                    : formType === "register"
                    ? "Register"
                    : "Update"}
                </button>
                {/* <span className="h-[1px] w-4 -mr-2 bg-black"></span>OR<span className="h-[1px] w-4 -ml-2 bg-black"></span> */}
                {formType === "login" && (
                  <span className="h-8 w-[1px] -mr-6 bg-black"></span>
                )}
                {formType === "login" && (
                  <>
                    <button
                      className="flex items-center justify-center rounded-lg text-sm w-20 px-5 py-3 text-center transition duration-300 text-white hover:opacity-90"
                      onClick={() => {
                        window.location.href =
                          "http://localhost:3030/api/auth/google";
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="90%"
                        viewBox="0 0 24 24"
                        width="90%"
                        preserveAspectRatio="xMidYMid meet"
                        focusable="false"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        ></path>
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        ></path>
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        ></path>
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        ></path>
                        <path d="M1 1h22v22H1z" fill="none"></path>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {formType === "login" ? (
                <div className="text-center">
                  <p className="text-sm pb-3 text-gray-600">
                    Don&apos;t have an account?
                    <Link
                      to="/register"
                      className="text-blue-600 hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              ) : formType === "register" ? (
                <div className="text-center">
                  <p className="text-sm pb-3 text-gray-600">
                    Already have an account?
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              ) : null}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  formType: PropTypes.oneOf(["login", "register", "update", "staffUpdate"])
    .isRequired,
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default AuthForm;
