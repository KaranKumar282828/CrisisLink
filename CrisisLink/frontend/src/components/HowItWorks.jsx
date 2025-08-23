import { UserPlus, BellRing, LifeBuoy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create an account and set up your emergency contacts.",
      icon: <UserPlus className="w-10 h-10 text-red-600" />,
    },
    {
      step: "2",
      title: "Send SOS",
      description: "In an emergency, press the SOS button to notify instantly.",
      icon: <BellRing className="w-10 h-10 text-red-600" />,
    },
    {
      step: "3",
      title: "Get Help",
      description: "Rescuers and authorities reach you with real-time location.",
      icon: <LifeBuoy className="w-10 h-10 text-red-600" />,
    },
  ];

  return (
    <section
      id="how"
      className="py-20 bg-gradient-to-b from-gray-50 to-white text-center px-6"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition transform"
          >
            <div className="mb-4">{step.icon}</div>
            <div className="text-red-600 text-2xl font-bold mb-2">
              Step {step.step}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
