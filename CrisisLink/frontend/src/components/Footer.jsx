import React from "react";

function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto text-center space-y-3">
        <p className="text-lg font-semibold">🚨 ResQLink</p>
        <p className="text-gray-400">Your Real-Time Emergency Assistance Platform</p>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ResQLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
