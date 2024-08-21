import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Pagination from '../../component/Pagination';
import toast, { Toaster } from 'react-hot-toast';
import FilterDropdown from "../../component/Filter";
import { getLeaveStatusAPI } from '../../service/ApiCall';


const LeaveStatusTable = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [status,setStatus]=useState(null)

  useEffect(() => {
    fetchData();
  }, [page, sortField, sortOrder,setLeaveList,status]);

  const handleFilterChange = (value) => {
    setStatus(value)
    setPage(1)
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getLeaveStatusAPI(page,sortField,sortOrder,status)
      console.log(response);
      setLeaveList(response.data.leaveList);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      if(error){
        setLeaveList([])
        toast.error(error.response.data)
        console.log('Error fetching leave status data', error);
        return;
      }
    }
    finally{
      setLoading(false);
    }
  };

    const handleSort = (field) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortField(field);
    setPage(1)
  };

  const renderSkeleton = () => (
    Array.from({ length: 10 }).map((_, index) => (
      <tr key={index}>
        <td className="border px-4 py-2"><Skeleton /></td>
        <td className="border px-4 py-2"><Skeleton /></td>
        <td className="border px-4 py-2"><Skeleton /></td>
        <td className="border px-4 py-2"><Skeleton /></td>
        <td className="border px-4 py-2"><Skeleton /></td>
      </tr>
    ))
  );

  return (
    <div>
      <Toaster/>
      <div className="flex justify-end mb-4">
        <FilterDropdown onFilterChange={handleFilterChange} />
      </div>
      <table className="min-w-full bg-white border rounded-lg shadow-lg overflow-auto">
        <thead className='bg-blue-900 text-white'>
          <tr>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort('startDate')}
            >
              Start Date {sortField === 'startDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort('endDate')}
            >
              End Date {sortField === 'endDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort('leaveType')}
            >
              Leave Type {sortField === 'leaveType' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase"
              onClick={() => handleSort('reason')}
            >
              Reason {sortField === 'reason' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-6 px-4 cursor-pointer border uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? renderSkeleton() :leaveList.length>0 ?leaveList.map((leave) => (
            <tr key={leave.id} className="odd:bg-blue-50 even:bg-white hover:bg-indigo-100 transition-colors duration-300">
              <td className="px-6 py-4 border whitespace-nowrap text-gray-700">{leave.startDate}</td>
              <td className="px-6 py-4 border whitespace-nowrap text-gray-700">{leave.endDate}</td>
              <td className="px-6 py-4 border whitespace-nowrap text-gray-700">{leave.leaveType}</td>
              <td className="px-6 py-4 border whitespace-nowrap text-gray-700">{leave.reason}</td>
              <td className="px-6 py-4 border whitespace-nowrap text-gray-700">
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
                      ) :(
                        <button
                          disabled
                          // className="bg-yellow-300 text-yellow-700 py-1 w-24 rounded cursor-not-allowed"
                          className="inline-flex rounded-lg bg-yellow-200/50 px-3 py-1 text-sm font-medium text-yellow-400 cursor-not-allowed"
                        >
                          Pending
                        </button>
                      )}
                      </div>
              </td>
            </tr>
          )):(
            <td colSpan={5} className="p-5 border text-center">No Data Founded</td>
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

export default LeaveStatusTable;
