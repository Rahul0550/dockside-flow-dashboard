
import { CargoTypeData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from "recharts";

interface CargoTypeChartProps {
  data: CargoTypeData[];
}

// Define colors for different cargo types
const CARGO_COLORS = {
  "Frozen": "#3b82f6", // Blue
  "Normal": "#10b981", // Green
  "Mixed": "#8b5cf6"   // Purple
};

export function CargoTypeChart({ data }: CargoTypeChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cargo Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CARGO_COLORS[entry.name] || "#ccc"} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} vehicles`, name]}
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none"
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => (
                  <span style={{ color: CARGO_COLORS[value as keyof typeof CARGO_COLORS] || "#000" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
