import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

import { ResponsiveBar } from "@nivo/bar";
import BarChart from "@/components/BarChart";
import AddButton from "@/components/AddButton";

const data = [
  {
    day: "Monday",
    degress: 59,
  },
  {
    day: "Tuesday",
    degress: 61,
  },
  {
    day: "Wednesday",
    degress: 55,
  },
  {
    day: "Thursday",
    degress: 78,
  },
  {
    day: "Friday",
    degress: 71,
  },
  {
    day: "Saturday",
    degress: 56,
  },
  {
    day: "Sunday",
    degress: 67,
  },
];

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">Welcome back!</h1>

      <AddButton />

      <div className="flex w-full h-[40vh]">
        <BarChart data={data} />
      </div>
    </main>
  );
}
