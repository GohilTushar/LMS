import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { leaveCalenderAPI } from "../service/ApiCall";

const localizer = momentLocalizer(moment);

const LeaveCalendar = () => {
  
  const [events, setEvents] = useState([]);

  const fetchLeaves = async () => {
    try {
      const response = await leaveCalenderAPI();

      const leaveList  = response.data;

      const mappedEvents = leaveList.map((leave) => ({
        id: leave.id,
        title: `${leave.requestedBy.name}'s leave is ${leave.status}`,
        start: new Date(leave.startDate),
        end: new Date(leave.endDate),
        status: leave.status,
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.log("Failed to fetch leave data", error);
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, []);

  const eventStyleGetter = (event) => {
    
    let backgroundColor = "";
    let color = "";
    let cursor = ""
    switch (event.status) {
      case "Pending":
        backgroundColor = "yellow";
        color="black";
        cursor="auto"
        break;
      case "Approved":
        backgroundColor = "green";
        color="black"
        cursor="auto"
        break;
      case "Rejected":
        backgroundColor = "red";
        color="black"
        cursor="auto"
        break;
      default:
        backgroundColor = "black"; // Default color
        cursor="auto"
    }
    return { style: { backgroundColor ,color,cursor} };
  };

  return (
    <div className="w-full mt-12 flex flex-col justify-center gap-9">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default LeaveCalendar;
