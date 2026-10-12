import {
  FaProjectDiagram,
  FaUserTie,
  FaComments,
  FaMoneyCheckAlt,
} from "react-icons/fa";

function HowItWorks() {
  return (
    <>
      <section id="about" className="w-full min-h-screen bg-white py-24 px-10">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-purple-900">
            How DenyDev Works
          </h1>

          <p className="text-gray-600 text-lg mt-5">
            Simple and professional workflow for clients and developers.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-24">
          {/* Step 1 */}
          <div className="bg-purple-50 rounded-3xl p-10 text-center shadow-lg hover:scale-105 duration-300">
            <div className="flex justify-center">
              <FaProjectDiagram className="text-6xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-8">Post Project</h2>

            <p className="text-gray-600 mt-5 leading-7">
              Clients post project requirements, budgets, and deadlines.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-purple-50 rounded-3xl p-10 text-center shadow-lg hover:scale-105 duration-300">
            <div className="flex justify-center">
              <FaUserTie className="text-6xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-8">Hire Developers</h2>

            <p className="text-gray-600 mt-5 leading-7">
              Browse professional developers and hire the best talent.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-purple-50 rounded-3xl p-10 text-center shadow-lg hover:scale-105 duration-300">
            <div className="flex justify-center">
              <FaComments className="text-6xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-8">Collaborate</h2>

            <p className="text-gray-600 mt-5 leading-7">
              Communicate using real-time chat and project updates.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-purple-50 rounded-3xl p-10 text-center shadow-lg hover:scale-105 duration-300">
            <div className="flex justify-center">
              <FaMoneyCheckAlt className="text-6xl text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold mt-8">Payment & Delivery</h2>

            <p className="text-gray-600 mt-5 leading-7">
              Receive completed projects securely with trusted payments.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default HowItWorks;
