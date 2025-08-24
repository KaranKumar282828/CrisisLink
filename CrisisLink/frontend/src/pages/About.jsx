import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* About Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About ResQLink</h1>
          <p className="text-xl text-gray-600">
            Connecting communities through emergency response
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            ResQLink was born out of a simple idea: what if we could create a network of 
            everyday heroes ready to help during emergencies? Our mission is to bridge the 
            gap between people in need and those who can provide immediate assistance.
          </p>
          <p className="text-gray-700">
            We believe that everyone deserves access to quick and reliable emergency response, 
            regardless of their location or circumstances.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-4">1</div>
              <h3 className="font-semibold mb-2">Emergency Alert</h3>
              <p className="text-gray-600 text-sm">
                User sends an SOS with their location and emergency type
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">2</div>
              <h3 className="font-semibold mb-2">Volunteer Response</h3>
              <p className="text-gray-600 text-sm">
                Nearby volunteers receive the alert and can accept the request
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">3</div>
              <h3 className="font-semibold mb-2">Assistance Provided</h3>
              <p className="text-gray-600 text-sm">
                Volunteer reaches the location and provides necessary help
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            We are a dedicated team of developers, designers, and emergency response 
            professionals who are passionate about making a difference in people's lives.
          </p>
          <p className="text-gray-700">
            Our platform is built with cutting-edge technology to ensure reliability, 
            security, and speed when it matters most.
          </p>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Join Our Community
          </Link>
        </div>
      </div>
    </div>
  );
}