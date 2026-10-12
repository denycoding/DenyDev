const testimonials = [
  {
    id: 1,
    name: "James Carter",
    role: "Startup Founder",
    review:
      "DenyDev helped us build our SaaS platform quickly with highly professional developers.",
    rating: "5.0",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },

  {
    id: 2,
    name: "Sophia Miller",
    role: "Business Owner",
    review:
      "The developers were experienced, responsive, and delivered our website perfectly.",
    rating: "4.9",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },

  {
    id: 3,
    name: "Michael Brown",
    role: "Project Manager",
    review:
      "Excellent communication and project tracking system. Highly recommended platform.",
    rating: "5.0",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
];

function Testimonials() {
  return (
    <>
      <section
        id="reviews"
        className="w-full min-h-screen bg-[#10002b] py-24 px-10"
      >
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">What Clients Say</h1>

          <p className="text-gray-300 text-lg mt-5">
            Trusted by startups, businesses, and entrepreneurs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20 place-items-center">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-8 shadow-2xl w-[360px] hover:scale-105 duration-300"
            >
              {/* User */}
              <div className="flex items-center gap-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                />

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-blue-600 font-medium">{item.role}</p>
                </div>
              </div>

              {/* Review */}
              <p className="text-gray-600 leading-8 mt-8">"{item.review}"</p>

              {/* Rating */}
              <div className="mt-8">
                <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-semibold">
                  ⭐ {item.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Testimonials;
