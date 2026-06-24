import { createClient } from "@/lib/supabase/client"

const supabase = createClient();

export async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.log(error);
    }
}