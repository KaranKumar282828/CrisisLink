import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
        <p className="text-lg max-w-3xl mx-auto">
          ResQLink is a real-time emergency response platform designed to
          connect people in crisis with the nearest responders, volunteers,
          and essential resources.
        </p>
      </div>

      {/* Mission & Why Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to empower communities by providing a reliable and quick
            platform to request or offer help in emergencies. Whether it’s natural
            disasters, accidents, or health-related emergencies, ResQLink ensures that
            no one feels helpless when time matters the most.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Why ResQLink?</h2>
          <p className="text-gray-600 leading-relaxed">
            Traditional emergency helplines often face delays due to congestion and
            communication gaps. ResQLink bridges this gap by using technology to instantly
            connect victims, responders, and volunteers—saving precious time and lives.
          </p>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-indigo-50 py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">Our Vision</h2>
        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto text-lg">
          We envision a world where technology-driven emergency response networks can
          drastically reduce casualties, empower citizens, and build safer communities
          for everyone.
        </p>
      </div>
    </div>
  );
};

export default About;
