import React, { useState } from "react";

const CARDS = [
  {
    line1: "당신의 미래에는 이미",
    line2: "최고의 버전이 존재합니다.",
  },
  {
    line1: "지금부터 그 사람을 찾아가는",
    line2: "짧은 여정을 시작합니다.",
  },
  {
    line1: "약 5분이면 충분합니다.",
    line2: "편안하게 답해주세요.",
    showButton: true,
  },
];

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

const WelcomeScreen = ({ onStart, onExistingAccount }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const card = CARDS[cardIndex];

  const advance = () => {
    if (transitioning || card.showButton) return;
    setTransitioning(true);
    setTimeout(() => {
      setCardIndex((i) => i + 1);
      setTransitioning(false);
    }, 380);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      onClick={advance}
    >
      <style>{`
        @keyframes wsTwinkle {
          0%   { opacity: 0.05; transform: scale(1); }
          100% { opacity: 0.65; transform: scale(1.4); }
        }
        @keyframes wsCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wsCardOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
        .ws-card-in  { animation: wsCardIn  0.45s ease-out forwards; }
        .ws-card-out { animation: wsCardOut 0.3s ease-in  forwards; }
        @keyframes wsGlow {
          0%, 100% { opacity: 0.04; }
          50%       { opacity: 0.09; }
        }
        .ws-glow { animation: wsGlow 4s ease-in-out infinite; }
      `}</style>

      {/* ── 파티클 레이어 ── */}
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

      {/* ── 앰버 글로우 ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center ws-glow">
        <div className="w-80 h-80 rounded-full bg-amber-500/10 blur-[80px]" />
      </div>

      {/* ── 카드 ── */}
      <div
        key={cardIndex}
        className={`relative z-10 text-center px-10 max-w-sm w-full ${
          transitioning ? "ws-card-out" : "ws-card-in"
        }`}
      >
        {/* 진행 표시 */}
        <p className="text-[9px] text-amber-500/40 font-black tracking-[0.6em] uppercase mb-10">
          {cardIndex + 1} / {CARDS.length}
        </p>

        {/* 메인 텍스트 */}
        <h2 className="text-[1.55rem] font-bold text-slate-200 leading-[1.75] mb-0.5" style={{ wordBreak: "keep-all" }}>
          {card.line1}
        </h2>
        <h2 className="text-[1.55rem] font-bold text-amber-400 leading-[1.75]" style={{ wordBreak: "keep-all" }}>
          {card.line2}
        </h2>

        {/* 카드 3: 시작 버튼 */}
        {card.showButton ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="mt-14 w-56 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all duration-200 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
          >
            시작하기
          </button>
        ) : (
          <p className="mt-12 text-slate-700 text-[10px] tracking-[0.35em] uppercase">
            tap to continue
          </p>
        )}
      </div>

      {/* ── 하단 도트 인디케이터 ── */}
      <div className="absolute bottom-14 flex items-center gap-2">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === cardIndex ? "20px" : "6px",
              backgroundColor: i === cardIndex
                ? "rgba(245,158,11,0.8)"
                : "rgba(100,116,139,0.4)",
            }}
          />
        ))}
      </div>

      {/* ── 기존 계정 사용자 안내 링크 ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (typeof onExistingAccount === "function") {
            onExistingAccount();
          }
        }}
        className="absolute bottom-5 text-[10px] text-slate-700 hover:text-slate-400 transition-colors tracking-widest uppercase font-bold"
      >
        이미 계정이 있으신가요? 로그인 화면으로 이동하기
      </button>
    </div>
  );
};

export default WelcomeScreen;
