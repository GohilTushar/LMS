import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "../../component/Pagination";
import toast, { Toaster } from "react-hot-toast";
import useStaffDataForUpdation from "../../utils/StaffUpdation";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../modal/Delete";
import { deleteUserAPI, getAllUserAPI } from "../../service/ApiCall";

const AllUser = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState({});
  const { getStaffDataForUpdation } = useStaffDataForUpdation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, sortField, sortOrder, setLeaveList]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllUserAPI(page, sortField, sortOrder);
      setLeaveList(response.data.leaveList);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching leave status data", error);
    }
    setLoading(false);
  };

  const handleSort = (field) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortField(field);
    setPage(1);
  };

  const handleEdit = async (id) => {
    console.log("Editing", id);
    setEditLoading((prevState) => ({ ...prevState, [id]: true }));
    await getStaffDataForUpdation(id);
    navigate("/staffupdate");
    setEditLoading((prevState) => ({ ...prevState, [id]: false }));
  };

  const handleDelete = (user, id) => {
    setUserToDelete({ user, id });
    console.log(user, id);
    setIsModalVisible(true);
  };
  
  const handleConfirmDelete = async () => {
    setDeleteLoading((prevState) => ({ ...prevState, [id]: true }));
    const id = userToDelete?.id;
    console.log(id, userToDelete.user);

    try {
      const response = await deleteUserAPI(id);
      setIsModalVisible(false);
      toast.success(response.data);
      setLeaveList((prevLeaveList) =>
        prevLeaveList.filter((leave) => leave.User.id !== id)
      );
    } catch (error) {
      console.log("Error", error);
    }
    setDeleteLoading((prevState) => ({ ...prevState, [id]: false }));
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
      <table className="min-w-full bg-white border rounded-lg shadow-lg ">
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
              onClick={() => handleSort("usedLeave")}
            >
              Used Leave{" "}
              {sortField === "usedLeave" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("availableLeave")}
            >
              Available Leave{" "}
              {sortField === "availableLeave" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("totalWorkingDay")}
            >
              Total Working Day{" "}
              {sortField === "totalWorkingDay" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort("attendancePercentage")}
            >
              Attendance Percentage{" "}
              {sortField === "attendancePercentage" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-6 px-4 cursor-auto border uppercase">Action</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.User.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.User.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.User.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.User.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.usedLeave}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.availableLeave}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.totalWorkingDay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {leave.attendancePercentage}
                </td>
                <td className="p-5 border flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(leave.User.id)}
                    disabled={
                      editLoading[leave.User.id] || deleteLoading[leave.User.id]
                    }
                    className={`text-blue-500 hover:text-blue-700 transition-colors ${
                      editLoading[leave.User.id] || deleteLoading[leave.User.id]
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <i className="fa-solid fa-edit mx-1 text-xl"></i>
                  </button>

                  <button
                    onClick={() => handleDelete(leave.User.name, leave.User.id)}
                    className={`text-red-500 hover:text-red-700 transition-colors ${
                      editLoading[leave.User.id] || deleteLoading[leave.User.id]
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <i className="fa-solid fa-trash mx-1 text-xl"></i>
                  </button>
                  <DeleteConfirmationModal
                    show={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onConfirm={handleConfirmDelete}
                    itemName={userToDelete?.name}
                  />
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

export default AllUser;
