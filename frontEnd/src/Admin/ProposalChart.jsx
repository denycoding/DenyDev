import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const proposalData = [
  {
    name: "Pending",
    value: 80,
  },
  {
    name: "Accepted",
    value: 35,
  },
  {
    name: "Rejected",
    value: 25,
  },
];

const ProposalChart = () => {


  return (
    <div className="bg-[#180035] border border-purple-500/20 rounded-2xl p-6">
      <h2 className="text-white text-lg font-semibold mb-6">
        Proposal Overview
      </h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={proposalData}
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
              tick={{
                fill: "#d1d5db",
                fontSize: 13,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9ca3af",
                fontSize: 12,
              }}
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

export default ProposalChart;