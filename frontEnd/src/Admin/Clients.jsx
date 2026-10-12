import Adminheader from "./Adminheader";
import { useEffect, useState } from "react";
import Api from "../API";
import { useNavigate } from "react-router-dom";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await Api.get("/clients");

        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      <Adminheader />

      <div className="min-h-screen bg-[#10002b] text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Clients</h1>

              <p className="text-gray-400 mt-1">
                Manage all registered clients
              </p>
            </div>

            <div className="bg-purple-900 px-5 py-3 rounded-xl">
              <p className="text-sm text-gray-300">Total Clients</p>

              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-10 text-gray-400">
              Loading clients...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* No Clients */}
          {!loading && !error && clients.length === 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center">
              <p className="text-gray-400">No clients found.</p>
            </div>
          )}

          {/* Clients Table */}
          {!loading && clients.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-900/50">
                    <tr>
                      <th className="text-left px-6 py-4">#</th>

                      <th className="text-left px-6 py-4">Name</th>

                      <th className="text-left px-6 py-4">Company</th>

                      <th className="text-left px-6 py-4">Joined At</th>

                      <th className="text-left px-6 py-4">Status</th>

                      <th className="text-left px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clients.map((client, index) => (
                      <tr
                        key={client.clientId || client._id}
                        className="border-t border-white/10 hover:bg-white/5 transition"
                      >
                        {/* Sr. No. */}
                        <td className="px-6 py-4 text-gray-400">{index + 1}</td>

                        {/* Name */}
                        <td className="px-6 py-4 font-medium text-white">
                          {client.clientName ||
                            client.fullName ||
                            client.name ||
                            "N/A"}
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4 text-gray-300">
                          {client.hasProfile ? (
                            client.companyName || "N/A"
                          ) : (
                            <span className="text-yellow-500 text-xs font-medium">
                              Profile not created
                            </span>
                          )}
                        </td>

                        {/* Joined At */}
                        <td className="px-6 py-4 text-gray-400">
                          {client.createdAt
                            ? new Date(client.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {client.accountType === "Blocked" ? (
                            <span className="text-red-500 font-semibold">
                              Blocked
                            </span>
                          ) : (
                            <span className="text-green-500 font-semibold">
                              Active
                            </span>
                          )}
                        </td>

                        {/* View Profile */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate(`/admin/client/${client.clientId}`)
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Clients;
