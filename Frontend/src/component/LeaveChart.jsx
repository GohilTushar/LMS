import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { leaveCalenderAPI } from "../service/ApiCall";

const LeaveStatusChart = () => {
  
  const [getData, setGetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveCalenderAPI()
      setGetData(response.data);
    } catch (error) {
      console.log("Failed to fetch leave data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeaves();
  }, []);

  const processLeaveData = (leaveList) => {
    const leaveCounts = {};

    leaveList.forEach((leave) => {
      const user = leave.requestedBy.name;
      const status = leave.status;

      if (!leaveCounts[user]) {
        leaveCounts[user] = { approved: 0, pending: 0, rejected: 0, total: 0 };
      }

      if (status === "Approved") {
        leaveCounts[user].approved += 1;
      } else if (status === "Pending") {
        leaveCounts[user].pending += 1;
      } else if (status === "Rejected") {
        leaveCounts[user].rejected += 1;
      }
      leaveCounts[user].total += 1;
    });

    return leaveCounts;
  };

  if (!getData || getData.length === 0) {
    return <p>No leave data available.</p>;
  }

  const leaveCounts = processLeaveData(getData);

  const data = Object.keys(leaveCounts).map((user) => {
    const { approved, pending, rejected, total } = leaveCounts[user];
    const proportion = total / getData.length;
    return { name: user, value: proportion, approved, pending, rejected };
  });

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };

  const COLORS = data.map(() => getRandomColor());

  return(
    loading ?
        (
        <Loader/>
        )
        :
        (
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Leave Status by User
            </h3>
            <div className="w-full flex justify-center items-center">
              <PieChart width={550} height={300}>
                <Pie
                  data={data}
                  cx={250}
                  cy={125}
                  labelLine={true}
                  label={({ name, value }) =>
                    `${name} (${(value * 100).toFixed(1)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        )
    )
};


export default LeaveStatusChart;
