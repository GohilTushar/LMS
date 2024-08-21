import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserData from "../data/Chooseuser.json";

const ChooseUser = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
      console.log(userRole);
    } catch (error) {
      console.log("Failed to decode token:", error);
    }
  }

  const handleRoleClick = (role) => {
    if (userRole === 3) userRole = 2;
    if (!userRole) {
      navigate("/login");
      return;
    }
    const userRoleName =
      userRole == 4 ? "Student" : userRole == 1 ? "Admin" : "Staff";
    if (userRole !== role) {
      toast.error(`You logged in as ${userRoleName}.`);
      return;
    }
    userRole === 4
      ? navigate("/student")
      : userRole === 1
      ? navigate("/admin")
      : userRole === 2 || userRole === 3
      ? navigate("/staff")
      : navigate("/login");
  };

  return (
    <>
      <div className="flex flex-wrap h-screen justify-center items-center gap-8 bg-blue-50">
        <Toaster />
        {UserData.User.map((user, index) => (
          <div
            key={index}
            onClick={() => handleRoleClick(user.Role)}
            className="cursor-pointer max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="flex justify-center items-center gap-3">
                <h5 className="text-2xl font-bold tracking-tight text-blue-900">
                  {user.Designation}
                </h5>
                {user.Role==1?<i className="fa-solid fa-user-tie text-blue-900 text-3xl"></i>:user.Role==4?<i className="fa-solid fa-graduation-cap text-blue-900 text-3xl"></i>:<i className="fa-solid fa-users text-blue-900 text-3xl"></i>}
              </div>
              <p className="font-medium text-gray-600 text-center">
                {user.Description}
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
                Select Role
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChooseUser;
