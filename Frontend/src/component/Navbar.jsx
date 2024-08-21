import { useNavigate } from "react-router-dom";
import useAuth from "../context/Auth";
import ProfileModal from "../modal/Profile";
import  { useState, useEffect, useRef } from 'react';
import Modal from "../modal/Logout";

const Navbar = () => {

  const [showModal, setShowModal] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const submenuRef = useRef(null);
  const navigate=useNavigate()
  const {logout}=useAuth()

  const handleConfirm = () => {
  localStorage.removeItem("token");
  localStorage.removeItem('user');
  localStorage.removeItem('updatedUser')
  logout()
  setShowModal(false);
  navigate("/login");
  }

  const handleClickOutside = event => {
    if (submenuRef.current && !submenuRef.current.contains(event.target)) {
      setShowSubmenu(false);
    }
    
  };
  
  const userUpdatedData=JSON.parse(localStorage.getItem('updatedUser'))
  const userData=JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-600 h-16 w-full text-white px-6 shadow-lg flex justify-between items-center">
    <div className="text-xl font-bold">Leave Management System</div>
    <div className="relative">
      <div
        onClick={() => setShowSubmenu((prevState) => !prevState)}
        className="cursor-pointer flex items-center space-x-3"
      >
        <img src={userData?.role==1?userData?.image:userUpdatedData?.data?.file || userData?.image} alt="Profile" className="h-10 w-10 rounded-full transform transition-transform duration-300 hover:scale-110" />
        <span className="text-lg font-medium transition-colors duration-300 hover:text-indigo-200">{userData?.role==1?userData?.name:userUpdatedData?.data?.body?.name || userData?.name}</span>
      </div>
      {showSubmenu && (
        <div ref={submenuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
          <button
            onClick={() => setProfileModal(true)}
            className="flex items-center gap-3 px-4 py-2 text-blue-900 hover:bg-blue-100 w-full text-left transition-colors duration-300"
          >
            <i className="fa-solid fa-user text-xl"></i>
            <span>Profile</span>
          </button>
          <ProfileModal
            show={profileModal}
            onClose={() => setProfileModal(false)}
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 px-4 py-2 text-blue-900 hover:bg-red-100 hover:text-red-600 w-full text-left transition-colors duration-300"
          >
            <i className="fa-solid fa-power-off text-xl text-red-500"></i>
            <span>Log Out</span>
          </button>
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
          />
        </div>
      )}
    </div>
  </nav>
  );
};

export default Navbar;

  