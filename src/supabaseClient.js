import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ihhfgoqpsubjdqlytzvs.supabase.co"; // 이미지에 있던 URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaGZnb3Fwc3ViamRxbHl0enZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDYxMDEsImV4cCI6MjA4MjY4MjEwMX0.1ZtWo4LiiOOJIFyKyvhPNXFwrvUgGeMTKTNp39kz61M"; // 이미지에 있던 Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    storageKey: "pulse-auth-token",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});