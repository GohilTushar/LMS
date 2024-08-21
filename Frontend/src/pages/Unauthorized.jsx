import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white text-black/50">
      <div className="text-center bg-white border rounded-md p-12 shadow-lg">
        <h1 className="text-9xl text-gray-500 m-0">403</h1>
        <h2 className="text-4xl font-semibold my-5 text-black/50">
          Unauthorized Access
        </h2>
        <p className="text-lg mb-10 text-gray-600 ">
          Sorry, you don&apos;t have permission to view this page.
        </p>
        <div className="flex justify-center gap-5">
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
