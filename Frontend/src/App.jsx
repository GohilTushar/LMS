import ChooseUser from "./pages/ChooseUser";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  StaffRegister,
  Login,
  Register,
  Update,
  StaffUpdate,
} from "./pages/Auth";
import NotFound from "./pages/NoPage";
import Layout from "./component/Layout";
import { useEffect, useState } from "react";
import { AuthProvider } from "./context/Auth";
import PrivateRoute from "./component/PrivateRoute";
import LeaveStatusTable from "./pages/common/LeaveStatus";
import LeaveManageTable from "./pages/staff/LeaveManage";
import LeaveReportTable from "./pages/admin/LeaveReport";
import UserDashboard from "./pages/common/UserDashboard";
import AllUser from "./pages/admin/AllUser";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated");
    return savedAuthState ? JSON.parse(savedAuthState) : false;
  });

  const login = (role) => {
    setIsAuthenticated(true);

    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("userRole", role);
  };

  const logout = (role) => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", false);
    localStorage.removeItem("userRole", role);
  };

  useEffect(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated");
    if (savedAuthState !== null) {
      setIsAuthenticated(JSON.parse(savedAuthState));
    }
  }, []);
  return (
    <AuthProvider value={{ isAuthenticated, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyOtp />} />
          <Route path="/reset" element={<ResetPassword />} />

          <Route path="/" element={<PrivateRoute allowedRoles={[4]} />}>
            <Route path="/" element={<Layout />}>
              <Route path="/student" element={<UserDashboard />} />
              <Route
                path="/student/leavestatus"
                element={<LeaveStatusTable />}
              />
            <Route path="/updateprofile" element={<Update />} />
            </Route>
          </Route>

          <Route path="/" element={<PrivateRoute allowedRoles={[2,3]} />}>
            <Route path="/" element={<Layout />}>
              <Route path="/staff" element={<UserDashboard />} />
              <Route path="/staff/leavestatus" element={<LeaveStatusTable />} />
              <Route path="/staff/leavemanage" element={<LeaveManageTable />} />
              <Route path="/updatestaffprofile" element={<Update />} />
            </Route>
          </Route>

          <Route path="/" element={<PrivateRoute allowedRoles={[1]} />}>
            <Route path="/" element={<Layout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/leavereport" element={<LeaveReportTable />} />
              <Route path="/staffregister" element={<StaffRegister />} />
              <Route path="/staffupdate" element={<StaffUpdate />} />
              <Route path="/admin/alluser" element={<AllUser />} />
              <Route path="/updateadminprofile" element={<Update />} />
            </Route>
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
