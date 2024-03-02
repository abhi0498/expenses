// import AuthForm from "../auth-form";

// export default function Home() {
//   return (
//     <main className="p-6">
//       <div className="col-6 auth-widget p-6">
//         <AuthForm />
//       </div>
//     </main>
//   );
// }
"use client";
import { supabase } from "@/utils/supabase/client";
import supabaseServerComponentClient from "@/utils/supabase/server";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">Welcome to Minnie Book</h1>
      <p className="text-sm font-normal mt-4">Manage your expenses with ease</p>

      <Image src={"/cat.jpg"} alt="cat" width={500} height={500} />
      <form id="login">
        <div className="mt-12 flex flex-col items-center w-full  gap-5">
          <label className="input input-bordered flex items-center gap-2 w-full">
            Email
            <input
              type="text"
              className="grow"
              placeholder="example@site.com"
              name="email"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full">
            Password
            <input
              name="password"
              type="password"
              className="grow"
              placeholder="Password"
            />
          </label>

          <button
            className="btn btn-primary w-full mx-12"
            type="submit"
            formAction={async (formData) => {
              console.log("formData", formData);

              try {
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: formData.get("email") as string,
                  password: formData.get("password") as string,
                });
                if (error) {
                  toast.error(error.message);
                }

                router.push("/");
              } catch (error) {}
            }}
          >
            Login
          </button>
        </div>
      </form>
      <button
        className="btn btn-secondary w-full mx-auto mt-4"
        onClick={async () => {
          const form = document.getElementById("login") as HTMLFormElement;
          const formData = new FormData(form);
          const { data, error } = await supabase.auth.signUp({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          });

          if (error) {
            toast.error(error.message);
          } else {
            router.push("/profile");
          }
        }}
      >
        Sign up
      </button>
    </main>
  );
}
