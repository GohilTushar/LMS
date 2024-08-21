import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "../../component/Pagination";
import toast, { Toaster } from "react-hot-toast";
import FilterDropdown from "../../component/Filter";
import Loader from "../../component/Loader";
import {
  adminLeaveReportAPI,
  approveLeaveAPI,
  rejectLeaveAPI,
} from "../../service/ApiCall";

const LeaveReportTable = () => {
  
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveLoading, setLeaveLoading] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, sortField, sortOrder, leaveLoading, status]);

  const handleFilterChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminLeaveReportAPI(
        page,
        sortField,
        sortOrder,
        status
      );
      setLeaveList(response.data.leaveList);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setLeaveList([]);
      console.log("Error fetching leave status data", error);
    }
    setLoading(false);
  };

  const handleSort = (field) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortField(field);
    setPage(1);
  };

  const handleApprove = async (id) => {
    setLeaveLoading((prevState) => ({ ...prevState, [id]: true }));
    try {
      const response = await approveLeaveAPI(id);
      toast.success(response.data);
      setLeaveLoading((prevState) => ({ ...prevState, [id]: false }));
    } catch (error) {
      console.error("Error", error);
    }
  };
  const handleReject = async (id) => {
    setLeaveLoading((prevState) => ({ ...prevState, [id]: true }));
    try {
      const response = await rejectLeaveAPI(id);
      toast.success(response.data);
      setLeaveLoading((prevState) => ({ ...prevState, [id]: false }));
    } catch (error) {
      console.error("Error", error);
    }
  };

  const renderSkeleton = () =>
    Array.from({ length: 10 }).map((_, index) => (
      <tr key={index}>
        <td className="border px-4 py-2">
          <Skeleton />
        </td>
        <td className="border px-4 py-2">
          <Skeleton />
        </td>
        <td className="border px-4 py-2">
          <Skeleton />
        </td>
        <td className="border px-4 py-2">
          <Skeleton />
        </td>
        <td className="border px-4 py-2">
          <Skeleton />
        </td>
      </tr>
    ));

  return (
    <div>
      <Toaster />
      <div className="flex justify-end mb-4">
        <FilterDropdown onFilterChange={handleFilterChange} />
      </div>
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("name")}
            >
              Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("email")}
            >
              Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("department")}
            >
              Department{" "}
              {sortField === "department" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("phone")}
            >
              Mobile No.{" "}
              {sortField === "phone" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("startDate")}
            >
              Start Date{" "}
              {sortField === "startDate" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("endDate")}
            >
              End Date{" "}
              {sortField === "endDate" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("leaveType")}
            >
              Leave Type{" "}
              {sortField === "leaveType" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("reason")}
            >
              Reason{" "}
              {sortField === "reason" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-6 px-4 cursor-pointer border uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            renderSkeleton()
          ) : leaveList.length > 0 ? (
            leaveList.map((leave) => (
              <tr
                key={leave.id}
                className="odd:bg-blue-50 even:bg-white hover:bg-indigo-100 transition-colors duration-300"
              >
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.requestedBy.name}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.requestedBy.email}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.requestedBy.department}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.requestedBy.phone}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.startDate}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.endDate}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.leaveType}
                </td>
                <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
                  {leave.reason}
                </td>

                <td className="p-5 border">
                  <div className="flex justify-center items-center">
                    {leave.status === "Approved" ? (
                      <button
                        disabled
                        className="inline-flex rounded-lg bg-green-200/50 px-3 py-1 text-sm font-medium text-green-400 cursor-not-allowed"
                      >
                        Approved
                      </button>
                    ) : leave.status === "Rejected" ? (
                      <button
                        disabled
                        className="inline-flex rounded-lg bg-red-200/50 px-3 py-1 text-sm font-medium text-red-400 cursor-not-allowed"
                      >
                        Rejected
                      </button>
                    ) : leaveLoading[leave.id] ? (
                      <Loader />
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(leave.id)}
                          disabled={leaveLoading[leave.id]}
                          className={`bg-green-500 text-white py-1 w-24 rounded hover:bg-green-700 mr-2 ${
                            leaveLoading[leave.id]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(leave.id)}
                          disabled={leaveLoading[leave.id]}
                          className={`bg-red-500 text-white py-1 w-24 rounded hover:bg-red-700 ${
                            leaveLoading[leave.id]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <td colSpan={9} className="p-5 border text-center">
              No Data Founded
            </td>
          )}
        </tbody>
      </table>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default LeaveReportTable;
