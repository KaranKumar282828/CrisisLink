import React from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">Forgot Password</h2>
        <form className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
