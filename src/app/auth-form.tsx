"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Database } from "@/types/supabase";

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>();
  const [type, setType] = useState<"login" | "signup">("login");

  return (
    <>
      {/* <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={`tab ${type === "login" ? "tab-active" : ""}`}
          onClick={() => setType("login")}
        >
          Login
        </a>
        <a
          role="tab"
          className={`tab ${type === "signup" ? "tab-active" : ""}`}
          onClick={() => setType("signup")}
        >
          Signup
        </a>
      </div> */}
      <Auth
        supabaseClient={supabase}
        view={
          type === "login"
            ? "sign_in"
            : type === "signup"
            ? "sign_up"
            : "forgotten_password"
        }
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        showLinks={true}
        providers={[]}
        redirectTo={new URL(
          "/",
          typeof window !== "undefined"
            ? window.location.href
            : "http://localhost:3000/"
        ).toString()}
      />
    </>
  );
}

export const preRender = false;
