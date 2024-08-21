import PropTypes from "prop-types";

const ApplyLeaveModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="bg-white rounded-lg p-6 relative">
          <button
            className="text-gray-500 cursor-pointer text-3xl hover:text-gray-800 float-right"
            onClick={onClose}
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

ApplyLeaveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ApplyLeaveModal;
