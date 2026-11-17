import { createBrowserClient } from "https://esm.sh/@supabase/ssr@0.12.7";

const supabaseUrl = "https://fuyifufesnxkbudkngxh.supabase.co";
const supabaseKey = "sb_publishable_PNCFEzK1uMrcAq9W6_BImw_VjqBK0sf";

export const supabaseClient = createBrowserClient(
    supabaseUrl,
    supabaseKey
);

window.supabaseClient = supabaseClient;
window.profileDB = supabaseClient;
