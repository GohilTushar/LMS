import { Outlet } from "react-router-dom";
import Sidebar from "../component/SideBar";
import Navbar from "./Navbar";

const Layout = () => {
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <main className="flex-grow p-6 bg-gray-100 overflow-auto" style={{width:"-webkit-fill-available"}}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
