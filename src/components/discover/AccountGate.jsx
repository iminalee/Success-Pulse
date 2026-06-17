import React, { useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";

const AccountGate = ({ tciQuickProfile, vakProfile, onComplete, isLoggedIn = false, currentUserName = "" }) => {
  const [mode, setMode] = useState("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Keep Act1 context explicitly referenced so props are preserved through mode switches.
  // (No saving in this ticket by design.)
  const act1Context = useMemo(
    () => ({ tciQuickProfile, vakProfile }),
    [tciQuickProfile, vakProfile],
  );

  const signupValid = name.trim().length > 0 && email.includes("@") && password.length >= 6;
  const loginValid = loginEmail.includes("@") && loginPassword.length >= 6;

  const toReadableAuthError = (message, currentMode) => {
    const lower = String(message || "").toLowerCase();

    if (lower.includes("invalid login credentials")) {
      return "이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.";
    }

    if (lower.includes("email not confirmed")) {
      return "이메일 인증이 아직 완료되지 않았습니다. 메일함에서 인증 후 로그인해 주세요.";
    }

    if (currentMode === "signup" && (lower.includes("already registered") || lower.includes("already been registered"))) {
      return "이미 가입된 이메일입니다. 아래 링크로 로그인해 주세요.";
    }

    return message || "인증 처리 중 오류가 발생했습니다.";
  };

  const handleContinueWithCurrentSession = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setNotice("");

    try {
      // The parent App already verified that a user session exists before
      // rendering this branch. Avoid an extra getSession() round-trip here:
      // if Supabase session refresh hangs, the onboarding gate can get stuck
      // on "연결 중..." even though the account is already connected.
      await onComplete((currentUserName || "").trim());
    } catch (e) {
      setError(e?.message || "현재 계정 연결 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupValid || loading) return;

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      const { error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            user_name: trimmedName,
          },
        },
      });

      if (signUpError) throw signUpError;

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const user = sessionData?.session?.user;

      if (user) {
        try {
          await onComplete(trimmedName || user.user_metadata?.user_name || user.user_metadata?.full_name || trimmedEmail.split("@")[0]);
        } catch (completeError) {
          const message = completeError?.message || "온보딩 저장 단계에서 오류가 발생했습니다.";
          setError(message);
          setNotice("계정은 연결되었지만 온보딩 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
          return;
        }
        return;
      }

      setNotice("가입이 완료되었습니다. 이메일 인증 후 로그인하면 다음 단계로 진행됩니다.");
      setMode("login");
      setLoginEmail(trimmedEmail);
    } catch (e) {
      setError(toReadableAuthError(e?.message, "signup"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginValid || loading) return;

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const trimmedEmail = loginEmail.trim();

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: loginPassword,
      });

      if (loginError) throw loginError;

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const user = sessionData?.session?.user;
      if (!user) {
        throw new Error("로그인 세션을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }

      const fallbackName = user.user_metadata?.user_name
        || user.user_metadata?.full_name
        || trimmedEmail.split("@")[0];

      try {
        await onComplete(fallbackName);
      } catch (completeError) {
        const message = completeError?.message || "온보딩 저장 단계에서 오류가 발생했습니다.";
        setError(message);
        setNotice("로그인은 성공했지만 온보딩 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
    } catch (e) {
      setError(toReadableAuthError(e?.message, "login"));
    } finally {
      setLoading(false);
    }
  };

  const isSignupMode = mode === "signup";

  if (isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm text-center">
          <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-5">
            계정 연결 확인
          </p>
          <h2 className="text-[1.35rem] font-black text-white leading-snug mb-3" style={{ wordBreak: "keep-all" }}>
            현재 로그인된 계정에 Act 1 결과를 연결합니다.
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed mb-7" style={{ wordBreak: "keep-all" }}>
            로그아웃 없이 그대로 이어서 진행됩니다.
          </p>

          {error && <p className="text-red-400 text-xs mb-3 text-center" style={{ wordBreak: "keep-all" }}>{error}</p>}

          <button
            onClick={handleContinueWithCurrentSession}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "연결 중..." : "계속하기"}
          </button>
        </div>
      </div>
    );
  }

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
        <div className="text-center mb-8">
          <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-5">
            진단 완료
          </p>
          <h2 className="text-[1.4rem] font-black text-white leading-snug mb-3" style={{ wordBreak: "keep-all" }}>
            Act 1에서 만든 첫 BPS 프로필을 저장하려면,
            <br />
            <span className="text-amber-400">처음 사용자 등록이 필요합니다.</span>
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed" style={{ wordBreak: "keep-all" }}>
            처음 사용자 등록 후 Act 1 진단 결과를 계정에 연결해 다음 단계로 이어집니다.
          </p>
        </div>

        {isSignupMode ? (
          <div className="mb-5 text-center">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setNotice(""); }}
              disabled={loading}
              className="text-[11px] text-slate-400 hover:text-amber-300 underline underline-offset-2 transition"
            >
              이미 계정이 있으신가요? 로그인하기
            </button>
          </div>
        ) : (
          <div className="mb-5 text-left">
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); setNotice(""); }}
              disabled={loading}
              className="text-[11px] text-slate-400 hover:text-amber-300 underline underline-offset-2 transition"
            >
              처음 사용자 등록으로 돌아가기
            </button>
          </div>
        )}

        {isSignupMode ? (
          <div className="flex flex-col gap-3 mb-5">
            <input className="sg-input" placeholder="이름 또는 닉네임" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoFocus />
            <input className="sg-input" placeholder="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="sg-input" placeholder="비밀번호 (6자 이상)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && signupValid && handleSignup()} />
          </div>
        ) : (
          <div className="mb-5">
            <p className="text-slate-500 text-[11px] leading-relaxed mb-3" style={{ wordBreak: "keep-all" }}>
              이미 계정을 만든 경우에만 로그인해 이어서 진행해 주세요.
            </p>
            <div className="flex flex-col gap-3">
            <input className="sg-input" placeholder="이메일" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} autoFocus />
            <input className="sg-input" placeholder="비밀번호" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loginValid && handleLogin()} />
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-xs mb-3 text-center" style={{ wordBreak: "keep-all" }}>{error}</p>}
        {notice && <p className="text-amber-300 text-xs mb-3 text-center" style={{ wordBreak: "keep-all" }}>{notice}</p>}

        <button
          onClick={isSignupMode ? handleSignup : handleLogin}
          disabled={(isSignupMode ? !signupValid : !loginValid) || loading}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? (isSignupMode ? "가입 중..." : "로그인 중...") : (isSignupMode ? "가입하고 계속하기" : "로그인하고 계속하기")}
        </button>

        <p className="text-slate-700 text-[10px] text-center mt-4 leading-relaxed">
          {act1Context?.tciQuickProfile && act1Context?.vakProfile
            ? "진단 데이터는 유지된 상태로 계정 연결 후 다음 단계로 이어집니다."
            : "계정 연결 후 다음 단계로 이어집니다."}
        </p>
      </div>
    </div>
  );
};

export default AccountGate;
