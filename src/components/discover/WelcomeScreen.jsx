import React from "react";

// 모듈 로드 시 1회 생성 — 리렌더마다 재계산 방지
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.4,
  delay: (Math.random() * 5).toFixed(2),
  duration: (Math.random() * 3 + 3).toFixed(2),
  opacity: (Math.random() * 0.35 + 0.08).toFixed(2),
}));

// 첫 화면 — 두 갈래 중 하나 선택 (동등한 크기)
//  1) 5분 설문 시작 (Act1)  →  onStart
//  2) 로그인 / 회원가입       →  onExistingAccount
const WelcomeScreen = ({ onStart, onExistingAccount }) => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden px-6 select-none">
      <style>{`
        @keyframes wsTwinkle {
          0%   { opacity: 0.05; transform: scale(1); }
          100% { opacity: 0.65; transform: scale(1.4); }
        }
        @keyframes wsGlow { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.11; } }
        @keyframes wsUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .ws-glow { animation: wsGlow 4s ease-in-out infinite; }
        .ws-up { animation: wsUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* 파티클 */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animation: `wsTwinkle ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* 앰버 글로우 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center ws-glow">
        <div className="w-96 h-96 rounded-full bg-amber-500/10 blur-[90px]" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-3xl ws-up">
        {/* 브랜드 */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
            THE <span className="text-amber-500">PULSE</span>
          </h1>
          <p className="text-[13px] md:text-sm text-slate-400 mt-4 leading-relaxed" style={{ wordBreak: "keep-all" }}>
            미래의 나를 오늘로 데려오는 정체성 코칭
          </p>
          <p className="text-[12px] md:text-[13px] text-slate-500 mt-3 uppercase tracking-[0.35em] font-bold">
            어떻게 시작할까요?
          </p>
        </div>

        {/* 두 갈래 — 동등한 크기 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {/* 5분 설문 시작 */}
          <button
            type="button"
            onClick={onStart}
            className="group flex flex-col items-start text-left h-full min-h-[190px] md:min-h-[220px] p-6 md:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/15 active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(245,158,11,0.12)]"
          >
            <span className="text-3xl md:text-4xl mb-4">✦</span>
            <span className="text-lg md:text-xl font-black text-white">5분 설문으로 시작</span>
            <span className="text-[13px] md:text-sm text-slate-300 mt-2 leading-relaxed" style={{ wordBreak: "keep-all" }}>
              나의 기질·감각을 진단하고 나만의 Apex BPS 정체성을 만듭니다.
            </span>
            <span className="mt-auto pt-5 text-[13px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              시작하기 →
            </span>
          </button>

          {/* 로그인 / 회원가입 */}
          <button
            type="button"
            onClick={onExistingAccount}
            className="group flex flex-col items-start text-left h-full min-h-[190px] md:min-h-[220px] p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-white/25 hover:bg-slate-900/80 active:scale-[0.98] transition-all"
          >
            <span className="text-3xl md:text-4xl mb-4">👤</span>
            <span className="text-lg md:text-xl font-black text-white">로그인 / 회원가입</span>
            <span className="text-[13px] md:text-sm text-slate-300 mt-2 leading-relaxed" style={{ wordBreak: "keep-all" }}>
              이미 계정이 있으신가요? 바로 로그인해 이어서 진행합니다.
            </span>
            <span className="mt-auto pt-5 text-[13px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              계정으로 계속 →
            </span>
          </button>
        </div>

        {/* 보조 안내 */}
        <p className="text-center text-[12px] md:text-[13px] text-slate-500 mt-8 leading-relaxed" style={{ wordBreak: "keep-all" }}>
          설문은 나중에 <span className="text-slate-400 font-bold">My Lab · 현재의 나</span>에서 언제든 할 수 있어요.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
