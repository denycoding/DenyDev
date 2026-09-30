import Adminheader from "./Adminheader";
import RevenueChart from "./RevenueChart";

function Admindashboard() {
  return (
    <>
      <Adminheader />

      <div className="min-h-screen pb-10 bg-[#10002b]">
        {/* =====================================================
            WELCOME SECTION
        ====================================================== */}
        <section className="px-6 sm:px-10 pt-6">
          <div>
            <h1 className="text-white font-serif text-3xl font-bold">
              <span className="text-purple-400">│</span> Welcome back, Admin
            </h1>

            <p className="text-gray-300 text-sm ml-5 mt-3">
              Here's what's happening on DenyDev today.
            </p>
          </div>
        </section>

        {/* =====================================================
            STATISTICS CARDS
        ====================================================== */}
        <section className="px-6 sm:px-10 lg:px-16 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Total Clients */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-purple-900/50 hover:border-purple-500/30 transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Total Clients
                  </p>

                  <h3 className="text-3xl font-bold text-white mt-2">48</h3>

                  <p className="text-gray-400 text-xs mt-2">
                    Registered clients
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            {/* Total Freelancers */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-purple-900/50 hover:border-purple-500/30 transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Total Freelancers
                  </p>

                  <h3 className="text-3xl font-bold text-white mt-2">86</h3>

                  <p className="text-gray-400 text-xs mt-2">
                    Registered freelancers
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl">💻</span>
                </div>
              </div>
            </div>

            {/* Total Projects */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-purple-900/50 hover:border-purple-500/30 transition duration-300 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">
                    Total Projects
                  </p>

                  <h3 className="text-3xl font-bold text-white mt-2">124</h3>

                  <p className="text-gray-400 text-xs mt-2">Projects posted</p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-600/30 flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROJECT PROGRESS / REVENUE
        ====================================================== */}
        <section className="px-6 sm:px-10 lg:px-16 py-4">
          <div className="mb-6">
            <h1 className="text-white text-3xl font-serif font-bold">
              Project Progress
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Overview of platform revenue and project activity.
            </p>
          </div>

          {/* Center Chart */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl">
              <RevenueChart />
            </div>
          </div>
        </section>

        {/* =====================================================
            RECENT ACTIVITY
        ====================================================== */}
        <section className="px-6 sm:px-10 lg:px-16 pt-12">
          <div className="mb-6">
            <h1 className="text-white text-3xl font-serif font-bold">
              Recent Activity
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Latest projects and users on DenyDev.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* =================================================
                RECENT PROJECTS
            ================================================== */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h2 className="text-xl font-semibold text-white">
                  Recent Projects
                </h2>

                <span className="w-fit text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                  3 Projects
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Projects posted in the last 24 hours
              </p>

              <ol className="space-y-3">
                {/* Project 1 */}
                <li className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                  <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
                    1
                  </span>

                  <div className="min-w-0">
                    <p className="text-gray-200 font-medium">Hotel Website</p>

                    <p className="text-gray-400 text-sm">Xyz Company</p>
                  </div>
                </li>

                {/* Project 2 */}
                <li className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                  <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
                    2
                  </span>

                  <div className="min-w-0">
                    <p className="text-gray-200 font-medium">AI Chatbot</p>

                    <p className="text-gray-400 text-sm">Xyz Company</p>
                  </div>
                </li>

                {/* Project 3 */}
                <li className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                  <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
                    3
                  </span>

                  <div className="min-w-0">
                    <p className="text-gray-200 font-medium">AWS Services</p>

                    <p className="text-gray-400 text-sm">Xyz Company</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* =================================================
                RECENT USERS
            ================================================== */}
            <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h2 className="text-xl font-semibold text-white">
                  Recent Users
                </h2>

                <span className="w-fit text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                  3 Users
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Users registered in the last 24 hours
              </p>

              <div className="space-y-3">
                {/* User 1 */}
                <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    KM
                  </div>

                  <div>
                    <p className="text-white font-medium">Kazi Mohammad</p>

                    <p className="text-gray-400 text-sm">Freelancer</p>
                  </div>
                </div>

                {/* User 2 */}
                <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    AK
                  </div>

                  <div>
                    <p className="text-white font-medium">Aman Khan</p>

                    <p className="text-gray-400 text-sm">Client</p>
                  </div>
                </div>

                {/* User 3 */}
                <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    RS
                  </div>

                  <div>
                    <p className="text-white font-medium">Rahul Shah</p>

                    <p className="text-gray-400 text-sm">Freelancer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Admindashboard;
