import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import Api from "../API";


const StatsChart = () => {
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await Api.get("/freelancerprofile");
        setTotalFreelancers(res.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFreelancers();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await Api.get("/clients");
        setTotalClients(res.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClients();
  }, []);
  const statsData = [
  {
    name: "Clients",
    value: totalClients,
  },
  {
    name: "Freelancers",
    value: totalFreelancers,
  },
  {
    name: "Projects",
    value: totalProjects,
  },
];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await Api.get("/postjobs");
        setTotalProjects(res.data.jobs.length);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);
  return (
    <div className="bg-[#180035] border border-purple-500/20 rounded-2xl p-6">
      <h2 className="text-white text-lg font-semibold mb-6">
        Platform Overview
      </h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statsData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#d1d5db", fontSize: 13 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: "rgba(124, 58, 237, 0.1)" }}
              contentStyle={{
                backgroundColor: "#180035",
                border: "1px solid #4C1D95",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="value"
              fill="#7c3aed"
              radius={[6, 6, 0, 0]}
              barSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsChart;
