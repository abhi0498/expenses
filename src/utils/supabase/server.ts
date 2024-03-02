import { cookies } from "next/headers";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export default async function supabaseServerComponentClient() {
  return createServerComponentClient<Database>({ cookies });
}
