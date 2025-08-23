// src/pages/dashboard/user/Profile.jsx
import toast from "react-hot-toast";

const UserProfile = () => {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4">
        <input className="border rounded-xl px-4 py-3" placeholder="Full Name" />
        <input className="border rounded-xl px-4 py-3" placeholder="Phone" />
        <input className="border rounded-xl px-4 py-3 md:col-span-2" placeholder="Email" />
        <input className="border rounded-xl px-4 py-3 md:col-span-2" placeholder="Emergency Contact 1" />
        <input className="border rounded-xl px-4 py-3 md:col-span-2" placeholder="Emergency Contact 2" />
        <button className="mt-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 w-max">
          Save Changes
        </button>
      </form>
    </div>
  );
};
export default UserProfile;
