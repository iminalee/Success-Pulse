import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const SignupGate = ({ tciQuickProfile, vakProfile, onComplete }) => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || password.length < 6) return;
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
        },
      });

      if (signUpError) throw signUpError;

      // 세션이 즉시 발급된 경우(이메일 확인 미사용) → TCI/VAK 즉시 저장
      const userId = data?.user?.id;
      if (userId) {
        await supabase.from("pulse_data").upsert({
          user_id: userId,
          user_name: name.trim(),
          tci_profile: {
            ns: { score: tciQuickProfile?.ns ?? 50 },
            ha: { score: tciQuickProfile?.ha ?? 50 },
            rd: { score: tciQuickProfile?.rd ?? 50 },
            p:  { score: tciQuickProfile?.p  ?? 50 },
          },
          vak_profile: vakProfile ?? {},
          updated_at: new Date(),
        });
      }

      // onAuthStateChange가 App.js user를 업데이트하고,
      // handleOnboardingComplete 호출 시 auto-save가 나머지를 처리함
      onComplete(name.trim());
    } catch (e) {
      setError(e.message || "가입 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const isValid = name.trim().length > 0 && email.includes("@") && password.length >= 6;

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center px-8">
      <style>{`
        @keyframes sgIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sg-in { animation: sgIn 0.5s ease-out forwards; }
        .sg-input {
          width: 100%;
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 14px 16px;
          color: #e2e8f0;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .sg-input:focus { border-color: rgba(245,158,11,0.35); }
        .sg-input::placeholder { color: #334155; }
      `}</style>

      <div className="sg-in w-full max-w-sm">

        {/* 헤더 */}
        <div className="text-center mb-10">
          <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-5">
            진단 완료
          </p>
          <h2
            className="text-[1.4rem] font-black text-white leading-snug mb-3"
            style={{ wordBreak: "keep-all" }}
          >
            진단 결과를 저장하고,
            <br />
            <span className="text-amber-400">당신만의 미래를 설계합니다.</span>
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed" style={{ wordBreak: "keep-all" }}>
            무료 가입으로 모든 여정이 저장됩니다.
          </p>
        </div>

        {/* 입력 필드 */}
        <div className="flex flex-col gap-3 mb-5">
          <input
            className="sg-input"
            placeholder="이름 또는 닉네임"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <input
            className="sg-input"
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="sg-input"
            placeholder="비밀번호 (6자 이상)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
          />
        </div>

        {/* 에러 */}
        {error && (
          <p className="text-red-400 text-xs mb-4 text-center" style={{ wordBreak: "keep-all" }}>
            {error}
          </p>
        )}

        {/* 가입 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? "가입 중..." : "가입하고 계속하기"}
        </button>

        <p className="text-slate-700 text-[10px] text-center mt-4 leading-relaxed">
          가입 시 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
        </p>
      </div>
    </div>
  );
};

export default SignupGate;
