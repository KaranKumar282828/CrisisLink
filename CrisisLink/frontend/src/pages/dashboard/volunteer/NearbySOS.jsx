// src/pages/dashboard/volunteer/NearbySOS.jsx
import toast from "react-hot-toast";
import Badge from "../../../components/ui/Badge";

const dummy = [
  { id: "RQ-1046", distance: "0.8 km", type: "Accident", urgency: "High" },
  { id: "RQ-1047", distance: "1.2 km", type: "Medical", urgency: "Medium" },
];

const VolNearby = () => {
  const accept = (id) => toast.success(`Request ${id} accepted`);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Nearby SOS</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {dummy.map((r) => (
          <div key={r.id} className="border rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.id}</div>
              <div className="text-gray-600 text-sm">
                {r.type} • {r.distance}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={r.urgency === "High" ? "red" : "yellow"}>{r.urgency}</Badge>
              <button
                onClick={() => accept(r.id)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default VolNearby;
