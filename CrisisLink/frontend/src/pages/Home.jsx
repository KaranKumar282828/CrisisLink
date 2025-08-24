import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Emergency Response Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            ResQLink connects people in emergency situations with nearby volunteers 
            who can provide immediate assistance. Your safety is our priority.
          </p>
          
          {!user && (
            <div className="flex justify-center space-x-6">
              <Link
                to="/signup?role=user"
                className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700"
              >
                I Need Help
              </Link>
              <Link
                to="/signup?role=volunteer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700"
              >
                Become a Volunteer
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold mb-3">Instant SOS</h3>
            <p className="text-gray-600">
              Send emergency alerts with your location to nearby volunteers with just one click.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-3">Volunteer Network</h3>
            <p className="text-gray-600">
              Connect with trained volunteers ready to provide immediate assistance in your area.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-purple-600 text-3xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
            <p className="text-gray-600">
              Live location sharing and real-time updates for efficient emergency response.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1K+</div>
              <div className="text-gray-600">Lives Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">24/7</div>
              <div className="text-gray-600">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}