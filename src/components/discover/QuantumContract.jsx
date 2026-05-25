import React, { useState, useEffect } from "react";

const LEVEL_NAMES = {
  1: "건강과 활력",
  2: "안전과 안정",
  3: "사랑과 소속",
  4: "인정과 성취",
  5: "나다움 실현",
};

const VAK_LABELS = {
  V: "시각(Visual)",
  A: "청각(Auditory)",
  K: "신체감각(Kinesthetic)",
};

// 가장 극단적인 TCI 차원 → 대표 아키타입
const getDominantType = (tci) => {
  const types = [
    { score: tci.ns, high: "탐험가 기질", low: "건축가 기질" },
    { score: tci.ha, high: "수호자 기질", low: "개척자 기질" },
    { score: tci.rd, high: "연결자 기질", low: "독행자 기질" },
    { score: tci.p,  high: "마라토너 기질", low: "스프린터 기질" },
  ];
  const top = types.reduce((a, b) =>
    Math.abs(a.score - 50) >= Math.abs(b.score - 50) ? a : b
  );
  return top.score >= 50 ? top.high : top.low;
};

const todayKr = () =>
  new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ── 파티클 (축하 화면용) ──────────────────────────────────
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: (Math.random() * 1.5).toFixed(2),
  dur: (Math.random() * 2 + 1.5).toFixed(2),
}));

// ── 메인 컴포넌트 ─────────────────────────────────────────
const QuantumContract = ({
  userName,
  generatedBPS,
  tciQuickProfile,
  vakProfile,
  selectedNeedLevel,
  onComplete,
}) => {
  const [signature, setSignature] = useState("");
  const [phase, setPhase] = useState("contract"); // contract | celebration
  const [countdown, setCountdown] = useState(3);

  const tciType = getDominantType(tciQuickProfile ?? { ns:50, ha:50, rd:50, p:50 });
  const vakLabel = VAK_LABELS[vakProfile?.dominant ?? "V"];
  const today = todayKr();
  const displayName = userName || "당신";

  // 축하 화면에서 카운트다운 후 자동 전환
  useEffect(() => {
    if (phase !== "celebration") return;
    if (countdown <= 0) {
      onComplete(signature);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown, onComplete, signature]);

  const handleSign = () => {
    if (!signature.trim()) return;
    setPhase("celebration");
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      <style>{`
        @keyframes qcIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .qc-in { animation: qcIn 0.5s ease-out forwards; }

        @keyframes qcGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.1); }
        }
        .qc-glow { animation: qcGlow 2.5s ease-in-out infinite; }

        @keyframes qcParticle {
          0%   { opacity: 0; transform: scale(0.5); }
          50%  { opacity: 0.8; }
          100% { opacity: 0; transform: scale(1.5) translateY(-20px); }
        }

        @keyframes qcBurst {
          0%   { opacity: 0; transform: scale(0.6); }
          40%  { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .qc-burst { animation: qcBurst 0.6s ease-out forwards; }

        .qc-sig-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(245,158,11,0.4);
          outline: none;
          color: #fcd34d;
          font-family: cursive, serif;
          font-size: 1.1rem;
          width: 100%;
          padding: 4px 0;
          text-align: center;
        }
        .qc-sig-input::placeholder { color: #1e293b; font-family: cursive; }
      `}</style>

      {phase === "contract" && (
        <ContractPhase
          displayName={displayName}
          bpsTitle={generatedBPS?.title ?? "—"}
          levelName={LEVEL_NAMES[selectedNeedLevel] ?? "—"}
          tciType={tciType}
          vakLabel={vakLabel}
          today={today}
          signature={signature}
          setSignature={setSignature}
          onSign={handleSign}
        />
      )}

      {phase === "celebration" && (
        <CelebrationPhase countdown={countdown} />
      )}
    </div>
  );
};

// ── 계약서 화면 ───────────────────────────────────────────
const ContractPhase = ({
  displayName, bpsTitle, levelName, tciType, vakLabel,
  today, signature, setSignature, onSign,
}) => (
  <div className="qc-in flex flex-col h-full px-5 pt-10 pb-8 overflow-y-auto">
    {/* 헤더 */}
    <div className="text-center mb-7">
      <p className="text-[9px] text-amber-500/50 font-black tracking-[0.6em] uppercase mb-2">
        Step 6
      </p>
      <h2 className="text-xl font-black text-white">BPS 프로필 등록 서약</h2>
      <div className="w-12 h-px bg-amber-500/40 mx-auto mt-3" />
    </div>

    {/* 계약서 카드 */}
    <div className="flex-1 border border-amber-500/20 rounded-3xl bg-slate-900/60 px-6 py-7 flex flex-col gap-5">

      {/* 선언문 */}
      <p
        className="text-slate-300 text-[0.9rem] leading-[1.9] text-center"
        style={{ wordBreak: "keep-all" }}
      >
        나, <span className="text-amber-300 font-black">{displayName}</span>은(는){"\n"}
        Apex BPS 초기 연결을 시작하고{"\n"}
        첫 BPS 프로필을 계정에 저장합니다.
      </p>

      <div className="w-full h-px bg-white/5" />

      {/* 데이터 항목 */}
      <div className="flex flex-col gap-3.5">
        <ContractItem label="나의 비전" value={bpsTitle} highlight />
        <ContractItem label="집중 영역" value={levelName} />
        <ContractItem label="나의 기질" value={tciType} />
        <ContractItem label="나의 감각" value={vakLabel} />
      </div>

      <div className="w-full h-px bg-white/5" />

      {/* 약속 문구 */}
      <p
        className="text-slate-400 text-[0.85rem] leading-[1.9] text-center"
        style={{ wordBreak: "keep-all" }}
      >
        본 서약은 최종 Manifestation 본계약 이전 단계이며,{"\n"}
        나는 매일 작은 행동으로 BPS 정체성을 강화할 것을 약속합니다.
      </p>

      <div className="w-full h-px bg-white/5" />

      {/* 서명 + 날짜 */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[9px] text-slate-600 font-bold tracking-widest uppercase mb-2 text-center">
            서명
          </p>
          <input
            className="qc-sig-input"
            placeholder="이름이나 서명을 입력하세요"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            maxLength={20}
          />
        </div>
        <p className="text-[0.75rem] text-slate-600 text-center">
          {today}
        </p>
      </div>
    </div>

    {/* 서명 버튼 */}
    <div className="mt-5">
      <button
        onClick={onSign}
        disabled={!signature.trim()}
        className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.25)] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        서명하고 시작하기
      </button>
    </div>
  </div>
);

const ContractItem = ({ label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase w-16 shrink-0 pt-0.5">
      {label}
    </span>
    <span
      className={`text-[0.88rem] font-bold leading-snug flex-1 ${
        highlight ? "text-amber-300" : "text-slate-300"
      }`}
      style={{ wordBreak: "keep-all" }}
    >
      {value}
    </span>
  </div>
);

// ── 축하 화면 ─────────────────────────────────────────────
const CelebrationPhase = ({ countdown }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
    {/* 파티클 */}
    <div className="absolute inset-0 pointer-events-none">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-amber-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `qcParticle ${p.dur}s ${p.delay}s ease-out infinite`,
          }}
        />
      ))}
    </div>

    {/* 글로우 */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-72 h-72 rounded-full bg-amber-500/10 qc-glow" />
    </div>

    {/* 메인 */}
    <div className="relative z-10 qc-burst">
      <div className="text-6xl mb-6">✦</div>
      <p className="text-[9px] text-amber-500/60 font-black tracking-[0.5em] uppercase mb-4">
        Apex BPS 활성화
      </p>
      <h2
        className="text-2xl font-black text-white leading-snug mb-3"
        style={{ wordBreak: "keep-all" }}
      >
        당신의 Apex BPS가
        <br />
        <span className="text-amber-400">활성화되었습니다.</span>
      </h2>
      <p className="text-slate-600 text-xs mt-6">
        {countdown}초 후 시작됩니다...
      </p>
    </div>
  </div>
);

export default QuantumContract;
