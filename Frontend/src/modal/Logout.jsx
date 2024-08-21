import { useEffect } from 'react';
import PropTypes from "prop-types";

const Modal = ({ show, onClose, onConfirm }) => {
  
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg text-gray-800 text-center font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6 text-black">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-green-600 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg">Logout</button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  };

export default Modal;
