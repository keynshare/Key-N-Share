// components/PerformanceMatrices.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Dummy Data
const radarData = [
  { month: "Jan", views: 60 },
  { month: "Feb", views: 40 },
  { month: "Mar", views: 70 },
  { month: "Apr", views: 50 },
  { month: "May", views: 80 },
  { month: "Jun", views: 30 },
  { month: "Jul", views: 60 },
  { month: "Aug", views: 20 },
  { month: "Sep", views: 90 },
  { month: "Oct", views: 70 },
  { month: "Nov", views: 50 },
  { month: "Dec", views: 40 },
];

const lineData = [
  { month: "Jan", good: 10, bad: 5 },
  { month: "Feb", good: 40, bad: 20 },
  { month: "Mar", good: 60, bad: 30 },
  { month: "Apr", good: 70, bad: 25 },
  { month: "May", good: 80, bad: 40 },
  { month: "Jun", good: 60, bad: 35 },
  { month: "Jul", good: 90, bad: 45 },
  { month: "Aug", good: 70, bad: 30 },
  { month: "Sep", good: 85, bad: 20 },
  { month: "Oct", good: 95, bad: 15 },
  { month: "Nov", good: 60, bad: 10 },
  { month: "Dec", good: 30, bad: 5 },
];

export default function PerformanceMatrices() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Profile Views Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Views</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="month" />
              <PolarRadiusAxis />
              <Radar
                name="current year’s profile view"
                dataKey="views"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.6}
              />
               <Tooltip />
             
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month 
        </div>
        <div className="text-muted-foreground flex justify-center items-center gap-2 leading-none">
          January - June 2024
        </div>
        </CardFooter>
      </Card>

      {/* Reviews Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="good" stroke="#3b82f6" name="Good Reviews" />
              <Line type="monotone" dataKey="bad" stroke="#ef4444" name="Bad Reviews" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
