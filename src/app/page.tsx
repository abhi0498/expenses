"use client";
import AddButton from "@/components/AddButton";
import BarChart from "@/components/BarChart";
import Loader from "@/components/Loader";
import { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

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
  const [profile, setProfile] =
    useState<Database["public"]["Tables"]["profile"]["Row"]>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profile")
        .select()
        .eq("user_id", user?.user?.id!)
        .limit(1)
        .single();

      setProfile(profile!);
      setUser(user.user!);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="p-6">
      {loading && <Loader />}
      <h1 className="text-4xl font-bold">Welcome back, {profile?.name}!</h1>

      <AddButton />

      <div className="flex flex-col w-full h-[40vh]">
        <h1 className="text-2xl font-bold mt-4">This week</h1>
        <BarChart data={data} />
      </div>
    </main>
  );
}
