
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityData } from "@/lib/data";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

interface ActivityChartProps {
  data: ActivityData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none"
                }} 
              />
              <Legend />
              <Bar dataKey="arrivals" name="Truck Arrivals" fill="#0f4c81" />
              <Bar dataKey="departures" name="Truck Departures" fill="#00a0a0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface VolumeChartProps {
  data: { hour: string; trucks: number }[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hourly Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "none"
                }}
              />
              <Area type="monotone" dataKey="trucks" name="Trucks" stroke="#0f4c81" fill="#0f4c81" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
