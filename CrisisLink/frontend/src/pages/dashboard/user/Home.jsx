// src/pages/dashboard/user/Home.jsx
import toast from "react-hot-toast";

const UserHome = () => {
  const sendSOS = () => {
    toast.success("SOS sent! Notifying responders…");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Raise SOS</h2>
      <p className="text-gray-600 mb-6">Your location will be shared with responders.</p>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={sendSOS}
          className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          Send SOS Now
        </button>
        <button className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200">
          Share Live Location (Coming soon)
        </button>
      </div>

      <div className="mt-8">
        <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-500">[ Map Placeholder ]</span>
        </div>
      </div>
    </div>
  );
};
export default UserHome;
