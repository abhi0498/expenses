"use client";
import AddButton from "@/components/AddButton";
import ThisWeek from "@/components/ThisWeek";
import Loader from "@/components/Loader";
import { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ThisMonth from "@/components/ThisMonth";

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
      <AddButton />
      <h1 className="text-4xl font-bold">Welcome back, {profile?.name}!</h1>

      <div className="overflow-y-scroll pb-32">
        <ThisWeek />
      </div>
    </main>
  );
}
