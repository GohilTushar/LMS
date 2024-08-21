import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../component/Loader";
import PropTypes from "prop-types";
import { getProfileAPI } from "../service/ApiCall";

const ProfileModal = ({ show, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (show) {
      fetchUserData();
    }
  }, [show]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await getProfileAPI();
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-xl border">
        <span
          className="text-gray-500 cursor-pointer text-3xl hover:text-gray-800 float-right"
          onClick={onClose}
        >
          &times;
        </span>
        <h2 className="text-xl text-center text-gray-700 font-semibold mb-4">
          User Profile
        </h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div className="w-full bg-white border border-gray-200 rounded-lg shadow ">
            <div className="flex flex-col items-center pb-10 px-6">
              <img
                className="w-36 h-36 mt-6 mb-3 rounded-full shadow-lg object-contain"
                src={userData.image}
                alt={userData.name}
              />
              <div className="flex justify-center items-center gap-6 mx-9 my-3">
                <div className="">
                  <span className="font-medium text-gray-700">
                    <strong className="text-gray-600">Name :</strong>{" "}
                    {userData.name}
                    <br />
                  </span>
                  <br />
                  <span className="font-medium text-gray-700">
                    <strong className="text-gray-600">Address :</strong>{" "}
                    {userData.address}
                    <br />
                  </span>
                  <br />
                  <span className="font-medium text-gray-700">
                    <strong className="text-gray-600">Gender :</strong>{" "}
                    {userData.gender}
                  </span>
                </div>
                <div className="">
                  <span className="font-medium text-gray-700">
                    <strong className="text-gray-600">Email :</strong>{" "}
                    {userData.email}
                    <br />
                  </span>
                  <br />
                  <span className="font-medium text-gray-700">
                    <strong className="text-gray-600">Department :</strong>{" "}
                    {userData.department}
                    <br />
                  </span>
                  <br />
                  <span className="font-medium text-gray-700">
                    <strong className="text-gray-600">Mobile No. :</strong>{" "}
                    {userData.phone}
                  </span>
                </div>
              </div>

              <hr />

              <hr />

              <Link
                className="flex items-center gap-2"
                onClick={onClose}
                to={
                  userData.role === 1
                    ? "/updateadminprofile"
                    : userData.role === 3 || userData.role === 2
                    ? "/updatestaffprofile"
                    : "/update"
                }
              >
                {
                  <span className="mt-1 py-2 px-4 ms-2 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-100 bg-gray-700 text-gray-200 border-gray-600 hover:text-white hover:bg-gray-500">
                    Update
                  </span>
                }
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ProfileModal;
