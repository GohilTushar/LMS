import LeaveCalendar from "../../component/Calender";
import LeaveStatusChart from "../../component/LeaveChart";
const AdminDashboard = () => {
  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-6">
        <LeaveCalendar />
        <LeaveStatusChart />
      </div>
    </>
  );
};

export default AdminDashboard;
