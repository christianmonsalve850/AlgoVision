import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export function useUserProfile() {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const supabase = createClient()

    useEffect(() => {
        async function loadUser() {
            const { data: {user} } = await supabase.auth.getUser();
            if (user?.user_metadata) {
                // Google uses 'avatar_url' or 'picture', GitHub uses 'avatar_url'
                const url = user.user_metadata.avatar_url || user.user_metadata.profile;
                
                setAvatarUrl(url)
            }
        }

        loadUser();
    }, [])

    return { avatarUrl }
}