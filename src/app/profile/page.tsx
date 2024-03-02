"use server";
import Avatar from "@/components/Avatar";
import supabaseServerComponentClient from "@/utils/supabase/server";
import UserForm from "./_user_form";

const Profile = async () => {
  const supabase = await supabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profile")
    .select()
    .eq("user_id", user?.id!);

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">Profile</h1>
      <div className="mt-4 flex flex-col items-center">
        <Avatar url={profile?.[0]?.avatar_url!} uid={user?.id!} />
        <h2 className="mt-4 text-xl font-bold">
          {profile?.[0]?.name || "John Doe"}
        </h2>
      </div>

      <UserForm profile={profile?.[0]!} email={user?.email!} />
    </main>
  );
};

export default Profile;
