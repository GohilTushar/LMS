import LeaveCalendar from "../../component/Calender";
import AvailableLeaveCards from "../../component/AvailableLeaveCards";

const UserDashboard = () => {

  return (
    <>
    
      <div className="flex flex-wrap justify-evenly items-center">
        <AvailableLeaveCards/>
        <LeaveCalendar />
      </div>
    </>
  );
};

export default UserDashboard;
