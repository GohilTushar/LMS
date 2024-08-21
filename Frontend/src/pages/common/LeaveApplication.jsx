import { Formik, Form } from "formik";
import CustomField from "../../component/CustomField";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Loader from "../../component/Loader";
import { applyLeaveAPI, getAuthorityAPI } from "../../service/ApiCall";
import { applyLeaveInitialValues,applyLeaveValidationSchema } from "../../service/ValidationSchema";

const ApplyLeaveForm = ({ onClose }) => {
    const [findSuperior,setFindSuperior]=useState([])


  const authority = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    const response = await getAuthorityAPI(role)
    setFindSuperior(response.data)
  };
  useEffect(() => {
    authority();
  },[]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await applyLeaveAPI(values)
      // console.log(response);
      toast.success(response.data);
      setTimeout(()=>{
        onClose();
      },2000)
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={applyLeaveInitialValues}
      validationSchema={applyLeaveValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form className="space-y-4 w-96">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Apply for Leave</h2>
          <div>
            <Toaster />
            <label className="block text-gray-700">Start Date</label>
            <CustomField
              label="StartDate"
              type="date"
              name="startDate"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <CustomField
              label="EndDate"
              type="date"
              name="endDate"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <CustomField
              label="requestToId"
              as="select"
              name="requestToId"
              className="w-full border rounded p-2 h-10 overflow-y-auto"
            >
              <option value="">Authority</option>
              {findSuperior.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </CustomField>
          </div>
          <div>
            <CustomField
              label="LeaveType"
              as="select"
              name="leaveType"
              className="w-full border rounded p-2"
            >
              <option value="">Leave Type</option>
              <option value="First half">First Half</option>
              <option value="Second half">Second Half</option>
              <option value="Full day">Full day</option>
            </CustomField>
          </div>
          <div>
            <CustomField
              label="Reason"
              type="text"
              name="reason"
              className="w-full border rounded p-2"
            />
          </div>
          {errors.submit && (
            <div className="text-red-500 text-sm">{errors.submit}</div>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader/> : "Apply Leave"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

ApplyLeaveForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ApplyLeaveForm;
