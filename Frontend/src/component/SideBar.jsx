import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../modal/Logout";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuth from "../context/Auth";
import ApplyLeaveForm from "../pages/common/LeaveApplication";
import ApplyLeaveModal from "../modal/ApplyLeave";
import ProfileModal from "../modal/Profile";

const Sidebar = () => {

  const isAuthenticated = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  let [userRole, setuserRole] = useState(null);
  const [leaveModal, setLeaveModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem('user');
    localStorage.removeItem('UpdateUser')
    localStorage.removeItem('UpdateStaff')
    logout();
    setShowModal(false);
    console.log(isAuthenticated);

    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setuserRole(decodedToken.role);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);
  
  return (
    <div
  className={`${
    isOpen ?  "w-72" : "w-20"
  } h-full overflow-hidden bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white shadow-lg transition-all duration-300`}
>
  <div className="flex justify-end items-center my-6 mx-7">
    <button onClick={toggleSidebar}>
      {isOpen ? (
        <i className="fa-solid fa-times text-2xl text-gray-300 hover:text-white transition-colors duration-200"></i>
      ) : (
        <i className="fa-solid fa-bars text-2xl text-gray-300 hover:text-white transition-colors duration-200"></i>
      )}
    </button>
  </div>
  <div className="flex flex-col items-center py-4">
    <nav className={`flex flex-col ${!isOpen&&"justify-center items-center"} gap-4 w-full`}>

      {userRole === 4 && (
        <>
          <Link to="/student" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-solid fa-tachometer-alt text-xl text-blue-400"></i>
            {isOpen && <span className="mt-1">Student Dashboard</span>}
          </Link>

          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}
            onClick={() => setLeaveModal(true)}
          >
            <i className="fa-solid fa-home text-xl text-yellow-400"></i>
            {isOpen && <span className="mt-1">Apply Leave</span>}
          </button>
          <ApplyLeaveModal
            isOpen={leaveModal}
            onClose={() => setLeaveModal(false)}
          >
            <ApplyLeaveForm onClose={() => setLeaveModal(false)} />
          </ApplyLeaveModal>
          <Link
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}
            to="/student/leavestatus"
          >
            <i className="fa-solid fa-info-circle text-xl text-green-400"></i>
            {isOpen && <span className="mt-1">View Leave Status</span>}
          </Link>
        </>
      )}

      {userRole === 1 && (
        <>
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-solid fa-tachometer-alt text-xl text-blue-400"></i>
            {isOpen && <span className="mt-1">Admin Dashboard</span>}
          </Link>

          <Link to="/staffregister" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-solid fa-users text-xl text-purple-400"></i>
            {isOpen && <span className="mt-1">Create Staff</span>}
          </Link>

          <Link to="/admin/alluser" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-regular fa-rectangle-list text-xl text-pink-400"></i>
            {isOpen && <span className="mt-1">List Of Staff</span>}
          </Link>

          <Link to="/admin/leavereport" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-regular fa-calendar-days text-xl text-red-400"></i>
            {isOpen && <span className="mt-1">Leave Report</span>}
          </Link>
        </>
      )}

      {(userRole === 2 || userRole === 3) && (
        <>
          <Link to="/staff" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-solid fa-tachometer-alt text-xl text-blue-400"></i>
            {isOpen && <span className="mt-1">Staff Dashboard</span>}
          </Link>

          <button
            className={`flex items-center gap-3 px-[14px] py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}
            onClick={() => setLeaveModal(true)}
          >
            <i className="fa-solid fa-home text-xl text-yellow-400"></i>
            {isOpen && <span className="mt-1">Apply Leave</span>}
          </button>
          <ApplyLeaveModal
            isOpen={leaveModal}
            onClose={() => setLeaveModal(false)}
          >
            <ApplyLeaveForm onClose={() => setLeaveModal(false)} />
          </ApplyLeaveModal>

          <Link to="/staff/leavemanage" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-regular fa-calendar-days text-xl text-red-400"></i>
            {isOpen && <span className="mt-1">Manage Leave Requests</span>}
          </Link>

          <Link to="/staff/leavestatus" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}>
            <i className="fa-solid fa-info-circle text-xl text-green-400"></i>
            {isOpen && <span className="mt-1">View Leave Status</span>}
          </Link>
        </>
      )}

      {isOpen && <hr className="w-60 border-gray-600" />}

      <button
        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}
        onClick={() => setProfileModal(true)}
      >
        <i className={`fa-solid fa-user  text-xl text-gray-400`}></i>
        {isOpen && <span className="mt-1">Profile</span>}
      </button>
      <ProfileModal
        show={profileModal}
        onClose={() => setProfileModal(false)}
      />

      <button
        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isOpen ? "hover:bg-gray-700" : ""} transition-colors duration-200`}
        onClick={() => {
          setShowModal(true);
        }}
      >
        <i className={`fa-solid fa-power-off text-xl text-red-500`}></i>
        {isOpen && <span className="mt-1">LogOut</span>}
      </button>
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onConfirm={handleConfirm}
      />
    </nav>
  </div>
</div>

  );
};

export default Sidebar;
