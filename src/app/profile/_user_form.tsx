"use client";
import Loader from "@/components/Loader";
import { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import React, { useState } from "react";

const UserForm = ({
  profile,
  email,
}: {
  profile: Database["public"]["Tables"]["profile"]["Row"];
  email: string;
}) => {
  const [name, setName] = useState(profile?.name || "");
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    setLoading(true);
    await supabase.from("profile").update({ name: name }).eq("id", profile?.id);
    setLoading(false);
  };
  return (
    <div className="mt-4 flex flex-col items-center w-full px-8 gap-4">
      {loading && <Loader />}
      <label className="input input-bordered flex items-center gap-2 w-full">
        Email
        <input type="text" className="grow" placeholder={email} disabled />
      </label>
      <label className="input input-bordered flex items-center gap-2 w-full">
        Name
        <input
          type="text"
          className="grow"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <button className="btn btn-primary w-full mx-12" onClick={saveProfile}>
        Save
      </button>

      <form action="/auth/signout" method="post" className="w-full mx-12">
        <button className="btn btn-primary bg-red-500 w-full" type="submit">
          Sign out
        </button>
      </form>
    </div>
  );
};

export default UserForm;
