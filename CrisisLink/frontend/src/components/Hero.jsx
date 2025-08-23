import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleSOS = () => {
    navigate("/signup"); // Redirect to Signup page
  };

  return (
    <section className="bg-red-600 text-white h-[80vh] flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Emergency Assistance, Anytime, Anywhere 🚨
      </h1>
      <p className="text-lg md:text-xl mb-6 max-w-2xl">
        ResQLink helps you connect with emergency services instantly. 
        One click can save lives.
      </p>
      <button 
        onClick={handleSOS}
        className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition"
      >
        Send SOS Now
      </button>
    </section>
  );
};

export default Hero;
