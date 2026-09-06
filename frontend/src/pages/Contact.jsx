import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      value: "support@careerconnect.com",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: <FaPhone />,
      title: "Call Us",
      value: "+92 300 1234567",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Our Location",
      value: "Islamabad, Pakistan",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      value: "Mon - Fri, 9:00 AM - 6:00 PM",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#070B2B] text-white py-20 sm:py-24">

        {/* Purple Glow */}
        <div className="absolute -right-40 top-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          <div className="max-w-3xl mx-auto text-center">

            <p className="text-purple-400 font-medium mb-3">
              Get In Touch
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              Contact <span className="text-purple-500">Us</span>
            </h1>

            <p className="text-gray-300 mt-6 text-base sm:text-lg leading-8">
              Have a question, feedback or need help? Our team is here to
              help you with anything related to CareerConnect.
            </p>

          </div>

        </div>

      </section>


      {/* Contact Section */}
      <section className="py-14 sm:py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Information */}
            <div>

              <p className="text-purple-600 font-semibold">
                Contact Information
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                Let's Talk
              </h2>

              <p className="text-gray-500 mt-4 leading-7">
                Whether you are a candidate looking for your next opportunity
                or a company searching for great talent, feel free to reach
                out to us.
              </p>


              <div className="space-y-4 mt-8">

                {contactInfo.map((item) => (

                  <div
                    key={item.title}
                    className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
                  >

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${item.iconBg} ${item.iconColor}`}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 break-words">
                        {item.value}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* Contact Form */}
            <div className="lg:col-span-2">

              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">

                <div className="mb-7">

                  <h2 className="text-2xl font-bold text-gray-900">
                    Send Us a Message
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Fill out the form below and we'll get back to you soon.
                  </p>

                </div>


                <form className="space-y-5">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                      />
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                      />
                    </div>

                  </div>


                  {/* Subject */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>

                    <input
                      type="text"
                      placeholder="Enter subject"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    />

                  </div>


                  {/* Message */}
                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>

                    <textarea
                      rows="6"
                      placeholder="Write your message..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                    ></textarea>

                  </div>


                  {/* Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-purple-600 hover:bg-yellow-600 text-white px-7 py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <FaPaperPlane />
                    Send Message
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Bottom CTA */}
      <section className="pb-16 sm:pb-20">

        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="bg-[#070B2B] rounded-2xl p-8 sm:p-12 text-center shadow-2xl">

            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to Take the Next Step?
            </h2>

            <p className="text-gray-300 mt-3">
              Explore thousands of opportunities and start building your
              future today.
            </p>

            <button className="mt-6 bg-purple-600 hover:bg-yellow-600 text-white px-7 py-3 rounded-lg transition">
              Browse Jobs
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;