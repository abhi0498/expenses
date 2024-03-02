import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

import { ResponsiveBar } from "@nivo/bar";
import BarChart from "@/components/BarChart";
import AddButton from "@/components/AddButton";
import supabaseServerComponentClient from "@/utils/supabase/server";

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

export default async function Home() {
  const supabase = await supabaseServerComponentClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profile")
    .select()
    .eq("user_id", user?.user?.id!)
    .limit(1)
    .single();

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">Welcome back, {profile?.name}!</h1>

      <AddButton />

      <div className="flex flex-col w-full h-[40vh]">
        <h1 className="text-2xl font-bold mt-4">This week</h1>
        <BarChart data={data} />
      </div>
    </main>
  );
}
