import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-lg">Page Not Found</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
