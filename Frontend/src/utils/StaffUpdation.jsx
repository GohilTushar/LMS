import { otherProfileAPI } from "../service/ApiCall";

const useStaffDataForUpdation = () => {

  const getStaffDataForUpdation = async (id) => {
    try {
      const response = await otherProfileAPI(id)
      localStorage.setItem('UpdateUser',JSON.stringify(response.data))
    } catch (error) {
        console.log("Error:", error);
    }
};

  return { getStaffDataForUpdation };
};

export default useStaffDataForUpdation;
