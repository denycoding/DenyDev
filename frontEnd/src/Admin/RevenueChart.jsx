import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Apr", revenue: 85000 },
  { month: "May", revenue: 112000 },
  { month: "Jun", revenue: 98000 },
  { month: "Jul", revenue: 145000 },
  { month: "Aug", revenue: 172000 },
  { month: "Sep", revenue: 198000 },
];

function RevenueChart() {
  return (
    <div className="bg-[#180035] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-1">
        Monthly Revenue
      </h2>

      <p className="text-gray-400 text-sm mb-6">
        Demo revenue overview
      </p>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff20"
            />

            <XAxis
              dataKey="month"
              stroke="#9ca3af"
            />

            <YAxis
              stroke="#9ca3af"
            />

            <Tooltip
              formatter={(value) =>
                `₹${value.toLocaleString()}`
              }
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;