"use client";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ data }: { data: any }) => {
  return (
    <ResponsiveBar
      data={data}
      keys={["degress"]}
      theme={{
        text: { fill: "#fff" },
      }}
      indexBy="day"
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      padding={0.4}
      valueScale={{ type: "linear" }}
      colors="#3182CE"
      animate={true}
      enableLabel={false}
      axisTop={null}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "degrees",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: "degrees",
        legendPosition: "middle",
        legendOffset: 60,
      }}
    />
  );
};

export default BarChart;
