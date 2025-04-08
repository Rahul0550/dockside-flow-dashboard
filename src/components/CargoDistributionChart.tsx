
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "@/lib/data";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CargoDistributionChartProps {
  trucks: Truck[];
}

export function CargoDistributionChart({ trucks }: CargoDistributionChartProps) {
  // Count trucks by cargo type
  const cargoDistribution = trucks.reduce((acc: Record<string, number>, truck) => {
    const cargoType = truck.cargoType || "Unknown";
    if (!acc[cargoType]) {
      acc[cargoType] = 0;
    }
    acc[cargoType] += 1;
    return acc;
  }, {});

  // Convert to array format for recharts
  const data = Object.entries(cargoDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // Colors for different cargo types
  const CARGO_COLORS: Record<string, string> = {
    "Frozen": "#0ea5e9",
    "Normal": "#10b981",
    "Both": "#8b5cf6",
    "Mixed": "#8b5cf6",
    "Unknown": "#6b7280",
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cargo Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CARGO_COLORS[entry.name] || "#" + ((Math.random() * 0xffffff) << 0).toString(16)} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} vehicles`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "none"
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No cargo data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
