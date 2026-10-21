import { redirect } from "next/navigation";
import Hero from "@/features/hero/components/hero";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to check the current user: ${error.message}`);
  }

  if (user) {
    redirect("/practice");
  }

  return <Hero />;
}
