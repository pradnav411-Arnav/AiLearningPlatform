import { createClient } from '@supabase/supabase-js'

// https://supabase.com/docs/guides/auth/choosing-a-server-package

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!)
