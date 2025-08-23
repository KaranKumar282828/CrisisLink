const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-gray-100 text-center px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Have questions or want to get in touch? Reach out to us anytime.
      </p>
      <form className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />
        <textarea
          placeholder="Your Message"
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Send
        </button>
      </form>
    </section>
  );
};

export default Contact;
