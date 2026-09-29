import Header from "../Header";
import Adminheader from "./Adminheader";

function Admindashboard() {
  return (
    <>
      <Adminheader />
      <div className="mb-8">
        <section>
          <div className="text-center  justify-center mt-5">
            <h1 className="text-white text-left ml-9 font-serif text-3xl font-bold">
              │ Welcome back, Admin{" "}
            </h1>
            <p className="text-gray-300 text-sm text-left ml-16 mt-3">
              Here's what's happening on DenyDev today.{" "}
            </p>
          </div>
        </section>
        <section className=" p-10 text-center grid grid-cols-3 gap-4 mx-11">
          <div className="bg-purple-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-3 sm:p-6">
            <h3 className="text-white">Total Client</h3>
            <p className="text-white">48</p>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-3 sm:p-6">
            <h3 className="text-white">Total Client</h3>
            <p className="text-white">48</p>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-3 sm:p-6">
            <h3 className="text-white">Total Client</h3>
            <p className="text-white">48</p>
          </div><div className="bg-purple-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-3 sm:p-6">
            <h3 className="text-white">Total Client</h3>
            <p className="text-white">48</p>
          </div><div className="bg-purple-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-3 sm:p-6">
            <h3 className="text-white">Total Client</h3>
            <p className="text-white">48</p>
          </div><div className="bg-purple-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-3 sm:p-6">
            <h3 className="text-white">Total Client</h3>
            <p className="text-white">48</p>
          </div>
        </section>
        <section>
          <h1 className="ml-10 text-white text-3xl font-serif font-medium">
            Project progress
          </h1>
          <div>chart</div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5 mx-20">
          {/* Recent Projects */}
          <div className="bg-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">
                Recent Projects in Last 24h
              </h2>

              <span className="text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                3 Projects
              </span>
            </div>

            <ol className="space-y-3">
              <li className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
                  1
                </span>
                <span className="text-gray-200">Hotel Website</span>
                <p className="text-white">-</p>
                <span className="text-gray-400 text-sm">Xyz Company</span>
              </li>

              <li className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
                  2
                </span>
                <span className="text-gray-200">AI Chatbot</span>
                <p className="text-white">-</p>
                <span className="text-gray-400 text-sm">Xyz Company</span>
              </li>

              <li className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-semibold">
                  3
                </span>
                <span className="text-gray-200">AWS Services</span>
                <p className="text-white">-</p>
                <span className="text-gray-400 text-sm">Xyz Company</span>
              </li>
            </ol>
          </div>

          {/* Recent Users */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">
                Recent Users in Last 24h
              </h2>

              <span className="text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
                3 Users
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  KM
                </div>

                <div>
                  <p className="text-white font-medium">Kazi Mohammad</p>
                  <p className="text-gray-400 text-sm">Freelancer</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  AK
                </div>

                <div>
                  <p className="text-white font-medium">Aman Khan</p>
                  <p className="text-gray-400 text-sm">Client</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  RS
                </div>
                <div>
                  <p className="text-white font-medium">Rahul Shah</p>
                  <p className="text-gray-400 text-sm">freelancer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
             <h1 className="text-white text-left ml-9 font-serif my-5 text-3xl font-bold">
              Recent Activity
            </h1>        </section>
      </div>
    </>
  );
}
export default Admindashboard;
