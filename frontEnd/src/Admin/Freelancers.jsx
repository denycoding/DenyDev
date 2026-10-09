import { useEffect, useState } from "react";
import Adminheader from "./Adminheader";
import Api from "../API";
import { useNavigate } from "react-router-dom";

function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await Api.get("/freelancerprofile");

        setFreelancers(res.data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  return (
    <>
      <Adminheader />

      <div className="min-h-screen bg-[#10002b] text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* PAGE HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Freelancers</h1>

              <p className="text-gray-400 mt-2">
                Manage and view all registered freelancers
              </p>
            </div>

            {/* TOTAL */}
            <div className="bg-purple-900 px-5 py-3 rounded-xl">
              <p className="text-sm text-gray-300">Total Freelancers</p>

              <p className="text-2xl font-bold">{freelancers.length}</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-[#180035] border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">
                Loading freelancers...
              </div>
            ) : freelancers.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No freelancers found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-900/50">
                    <tr className="text-left text-gray-400">
                      <th className="px-6 py-4">Sr. No.</th>

                      <th className="px-6 py-4">Name</th>

                      <th className="px-6 py-4">Skills</th>

                      <th className="px-6 py-4">Joined At</th>

                      <th className="px-6 py-4">Status</th>

                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {freelancers.map((freelancer, index) => (
                      <tr
                        key={freelancer._id}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >
                        {/* SR NO */}
                        <td className="px-6 py-4 text-gray-400">{index + 1}</td>

                        {/* NAME */}
                        <td className="px-6 py-4 font-medium text-white">
                          {freelancer.freelancerName ||
                            freelancer.fullName ||
                            freelancer.name ||
                            "N/A"}
                        </td>

                        {/* SKILLS */}
                        <td className="px-6 py-4 text-gray-300">
                          {freelancer.hasProfile ? (
                            Array.isArray(freelancer.skills) &&
                            freelancer.skills.length > 0 ? (
                              freelancer.skills.length > 3 ? (
                                `${freelancer.skills.slice(0, 6).join(", ")}...`
                              ) : (
                                freelancer.skills.join(", ")
                              )
                            ) : (
                              "No skills listed"
                            )
                          ) : (
                            <span className="text-yellow-500 text-xs font-medium">
                              Profile not created
                            </span>
                          )}
                        </td>

                        {/* JOINED */}
                        <td className="px-6 py-4 text-gray-400">
                          {freelancer.createdAt
                            ? new Date(
                                freelancer.createdAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* VIEW PROFILE */}
                        <td className="px-6 py-4">
                          <p>
                            {freelancer.accountType === "Blocked" ? (
                              <span className="text-red-500 font-semibold">
                                Blocked
                              </span>
                            ) : (
                              <span className="text-green-500 font-semibold">
                                Active
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate(`/admin/freelancer/${freelancer.userId}`)
                            }
                            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Freelancers;
