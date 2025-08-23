const Features = () => {
  const features = [
    {
      title: "Instant SOS Alerts",
      description: "Send emergency alerts to authorities and nearby helpers with one click.",
      icon: "🚨",
    },
    {
      title: "Real-time Location",
      description: "Share your live location instantly for faster assistance.",
      icon: "📍",
    },
    {
      title: "Multi-role Dashboard",
      description: "Separate dashboards for Users, Admins, and Rescuers to coordinate seamlessly.",
      icon: "📊",
    },
  ];

  return (
    <section id="features" className="py-16 bg-gray-100 text-center px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-10">Key Features</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
