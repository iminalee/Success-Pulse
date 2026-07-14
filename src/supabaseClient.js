import { createClient } from "@supabase/supabase-js";

// Vite 환경변수 (VITE_ 접두어 필수).
// 로컬은 .env.local, 배포는 Vercel 프로젝트 환경변수에 설정.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // env 미설정 시 원인을 명확히 알림 (createClient가 불명확하게 실패하는 것 방지)
  console.error(
    "[supabaseClient] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 환경변수가 없습니다. .env.local(로컬) 또는 Vercel 설정에 추가해주세요."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    storageKey: "pulse-auth-token",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
