import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          🚨 ResQLink
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <HashLink
            smooth
            to="/#features"
            className="text-gray-700 hover:text-blue-600"
          >
            Features
          </HashLink>
          <HashLink
            smooth
            to="/#how"
            className="text-gray-700 hover:text-blue-600"
          >
            How It Works
          </HashLink>
          <HashLink
            smooth
            to="/#contact"
            className="text-gray-700 hover:text-blue-600"
          >
            Contact
          </HashLink>
          {/* About Page */}
          <Link to="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
