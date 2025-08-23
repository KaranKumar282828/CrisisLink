import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">Create an Account</h2>
        <form className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 font-medium">Register as</label>
            <select className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="user">User</option>
              <option value="responder">Responder</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
