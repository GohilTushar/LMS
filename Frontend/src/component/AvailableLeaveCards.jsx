import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Loader from "../component/Loader";
import { getAvailableLeaveAPI } from "../service/ApiCall";

const AvailableLeaveCards = () => {

  const colors = ["bg-red-400", "bg-green-400", "bg-yellow-400", "bg-blue-400", "bg-purple-400"];
  const token = localStorage.getItem("token");

  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.log("Failed to decode token:", error);
    }
  }

  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaveBalance = async () => {
    setLoading(true);
    try {
      const response = await getAvailableLeaveAPI()

      userRole != 1 &&
        setLeaveBalance([
          response.data.usedLeave,
          response.data.availableLeave,
          response.data.totalLeave,
          response.data.totalWorkingDay,
          response.data.attendancePercentage,
        ]);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeaveBalance();
  }, []);


  return (
    <>
    
      <div className="flex flex-wrap w-screen justify-evenly items-center">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) :  (
          <>
            {leaveBalance.map((item, index) => (
              <>
                <div
                  key={index}
                  className={`h-44 w-64 flex flex-col justify-center items-center gap-3 cursor-auto max-w-sm p-6 border border-blue-900 rounded-xl shadow-lg hover:bg-indigo-50 transform hover:scale-105 transition-transform duration-300 ${colors[index]}`}
                >
                  <h5 className="text-xl text-center font-bold tracking-tight text-blue-900">
                    {index == 0 && (<>Used Leave <i className="fa-solid fa-calendar-minus ml-3 absolute top-3 right-3 text-2xl"></i></>)}
                    {index == 1 && (<>Available Leave <i className="fa-solid fa-calendar-check ml-3 absolute top-3 right-3 text-2xl"></i></>)}
                    {index == 2 && (<>Total Leave <i className="fa-solid fa-calendar-alt ml-3 absolute top-3 right-3 text-2xl"></i></>)}
                    {index == 3 && (<>Total Working Day <i className="fa-solid fa-briefcase ml-3 absolute top-3 right-3 text-2xl"></i></>)}
                    {index == 4 && (<>Attendance Percentage <i className="fa-solid fa-percentage ml-3 absolute top-3 right-3 text-2xl"></i></>)}
                  </h5>
                  <p className="font-medium text-gray-700">{item}</p>
                </div>
              </>
            ))}
          </>
        ) }
      </div>
    </>
  );
};

export default AvailableLeaveCards;
