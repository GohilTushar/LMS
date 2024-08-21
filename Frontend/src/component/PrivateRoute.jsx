import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types'
import useAuth  from '../context/Auth.js';
// import Cookies from 'js-cookie';

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated } = useAuth();
  const userRole=JSON.parse(localStorage.getItem("userRole"));
  // const token = JSON.parse(Cookies.get("authToken")); 
  
  
  if (!isAuthenticated ) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    console.log("Unauthorized");
    return <Navigate to="/unauthorized" />;
  }
  
  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.number).isRequired, 
};

export default PrivateRoute