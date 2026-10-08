import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const categoryData = [
  { name: "Web Development", value: 45 },
  { name: "AI & ML", value: 32 },
  { name: "Data Science", value: 27 },
  { name: "Cloud & DevOps", value: 21 },
  { name: "Cybersecurity", value: 15 },
  { name: "Maintenance", value: 9 },
];

const COLORS = [
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
];

const ProjectCategoryChart = () => {
  return (
    <div className="bg-[#180035] border border-purple-500/20 rounded-2xl p-6 shadow-lg shadow-purple-900/10">
      <h2 className="text-white text-lg font-semibold mb-6">
        Projects by Category
      </h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={4}
              stroke="white"
              strokeWidth={1}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#10002b",
                border: "1px solid #4C1D95",
                borderRadius: "10px",
                color: "#fff",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
              }}
              itemStyle={{
                color: "#fff",
                fontWeight: "500",
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={9}
              wrapperStyle={{
                color: "#d1d5db",
                fontSize: "12px",
                paddingTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectCategoryChart;