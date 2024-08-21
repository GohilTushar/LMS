import toast from "react-hot-toast";
import AuthForm from "../component/AuthForm";
import {
  loginAPI,
  staffRegisterAPI,
  studentRegisterAPI,
  updateProfileAPI,
  updateUserAPI,
} from "../service/ApiCall";
import {
  loginInitialValues,
  registrationInitialValues,
  loginValidationSchema,
  registrationValidationSchema,
  updateValidationSchema,
} from "../service/ValidationSchema";

const handleLoginSubmit = async (values, resetForm) => {
  try {
    const response = await loginAPI(values);
    if (response) {
      localStorage.setItem("user", JSON.stringify(response.data.userExist));
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
    }
  } catch (error) {
    toast.error(error.response.data);
    console.log(error);
  } finally {
    resetForm();
  }
};
const handleRegistrationSubmit = async (values, resetForm) => {
  const formData = new FormData();

  for (const key in values) {
    formData.append(key, values[key]);
  }

  try {
    const response = await studentRegisterAPI(formData);
    if (response) {
      toast.success(response.data);
    }
  } catch (error) {
    if (!error.response.data.data.length) {
      toast.error(error.response.data.message);
      return;
    }
  } finally {
    resetForm();
  }
};
const handleStaffRegistrationSubmit = async (values, resetForm) => {
  const formData = new FormData();

  for (const key in values) {
    formData.append(key, values[key]);
  }

  try {
    const response = await staffRegisterAPI(formData);
    if (response) {
      console.log(response);
      toast.success(response.data);
    }
  } catch (error) {
    if (!error.response.data.data.length) {
      toast.error(error.response.data.message);
      return;
    }
  } finally {
    resetForm();
  }
};

const handleUpdateSubmit = async (values, password) => {
  try {
    const newValue = {
      ...values,
      password,
    };
    const response = await updateProfileAPI(newValue);
    console.log(response);

    localStorage.setItem("updatedUser", JSON.stringify(response));
    if (response.status == 200) {
      toast.success(response.data.message);
    }
    return true;
  } catch (error) {
    if (error) {
      toast.error(error.response.data);
      console.log("Error fetching leave balance:", error);
      return false;
    }
  }
};

const handleStaffUpdateSubmit = async (values, password) => {
  try {
    const newValue = {
      ...values,
      password,
    };
    const idForUpdation = JSON.parse(localStorage.getItem("UpdateUser")).id; //6
    const response = await updateUserAPI(idForUpdation, newValue);
    if (response.status == 200) {
      toast.success(response.data);
    }
    return true;
  } catch (error) {
    if (error) {
      toast.error(error.response.data);
      console.log("Error fetching leave balance:", error);
      return false;
    }
  }
};

const Login = () => (
  <AuthForm
    formType="login"
    initialValues={loginInitialValues}
    validationSchema={loginValidationSchema}
    handleSubmit={handleLoginSubmit}
  />
);

const Register = () => (
  <AuthForm
    formType="register"
    initialValues={registrationInitialValues}
    validationSchema={registrationValidationSchema}
    handleSubmit={handleRegistrationSubmit}
  />
);
const StaffRegister = () => (
  <AuthForm
    formType="register"
    initialValues={registrationInitialValues}
    validationSchema={registrationValidationSchema}
    handleSubmit={handleStaffRegistrationSubmit}
  />
);
const Update = () => (
  <AuthForm
    formType="update"
    initialValues={registrationInitialValues}
    validationSchema={updateValidationSchema}
    handleSubmit={handleUpdateSubmit}
  />
);
const StaffUpdate = () => (
  <AuthForm
    formType="staffUpdate"
    initialValues={registrationInitialValues}
    validationSchema={updateValidationSchema}
    handleSubmit={handleStaffUpdateSubmit}
  />
);
export { Login, Register, StaffRegister, Update, StaffUpdate };
