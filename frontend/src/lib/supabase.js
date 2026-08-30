import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nrajyfgyxjfiqgxhcrul.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYWp5Zmd5eGpmaXFneGhjcnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTQyNjMsImV4cCI6MjEwMzM5MDI2M30.ro4fiUwtKmrjJmQLwwgCuOXKWkWLJrUa_DGBJrWxEQM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
