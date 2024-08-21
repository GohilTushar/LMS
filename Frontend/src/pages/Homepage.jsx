import { Link } from "react-router-dom";
import bgImage from "../assets/bgImage.jpeg";

function Homepage() {
  return (
    <>
      <div className="text-center relative h-screen bg-white flex justify-center items-center flex-col gap-3">
        <h1 className="text-3xl font-bold  mb-20">
          Welcome to Leave Management System!
        </h1>
        <div className="flex flex-row justify-center items-center">
          <img src={bgImage} alt="Background" className="h-fit w-fit mr-6"/>
          <div>
            <p className=" text-xl font-semibold">Key to employee satisfaction</p>
          <div className="h-fit p-5 w-96 border border-x-8 border-y-8 rounded-lg flex flex-col my-10">
            <p className="">
              A well-managed leave system ensures employees feel valued and
              supported, balancing work and personal life leading to higher
              moral and productivity.
            </p>
          </div>
          </div>
        </div>
        <button className="btn-primary">
            <Link to="/choose" className="no-underline  text-white">
                Dashboard
            </Link>
        </button>
      </div>
    </>
  );
}
export default Homepage;
