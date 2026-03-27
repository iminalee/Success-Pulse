import React, { useState } from "react";

// ── 5단계 데이터 (5 → 1, 피라미드 위에서 아래) ────────────
const LEVELS = [
  {
    level: 5,
    title: "나다움 실현",
    quote: "진짜 내가 되고 싶다",
    emoji: "✦",
    widthClass: "max-w-[68%]",
  },
  {
    level: 4,
    title: "인정과 성취",
    quote: "능력을 인정받고 싶다",
    emoji: "◆",
    widthClass: "max-w-[78%]",
  },
  {
    level: 3,
    title: "사랑과 소속",
    quote: "깊은 관계를 원한다",
    emoji: "◈",
    widthClass: "max-w-[87%]",
  },
  {
    level: 2,
    title: "안전과 안정",
    quote: "경제적/심리적으로 안전하고 싶다",
    emoji: "◉",
    widthClass: "max-w-[94%]",
  },
  {
    level: 1,
    title: "건강과 활력",
    quote: "몸과 마음이 건강하고 싶다",
    emoji: "●",
    widthClass: "max-w-full",
  },
];

// ── TCI 기반 추천 로직 ────────────────────────────────────
const suggestLevel = (tci) => {
  if (!tci) return null;
  if (tci.ha >= 70)
    return {
      level: 2,
      hint: "당신의 기질은 안정감을 우선시합니다. 2단계부터 시작하면 마음이 편할 수 있어요.",
    };
  if (tci.rd >= 70)
    return {
      level: 3,
      hint: "관계에서 에너지를 얻는 기질이에요. 3단계가 자연스러운 출발점이 될 수 있습니다.",
    };
  if (tci.ns >= 70)
    return {
      level: 5,
      hint: "새로운 도전을 좋아하는 기질이에요. 자아실현부터 시작해도 좋습니다.",
    };
  return null;
};

// ── 메인 컴포넌트 ─────────────────────────────────────────
const NeedLevelScreen = ({ tciQuickProfile, onComplete }) => {
  const [selected, setSelected] = useState(null);
  const suggestion = suggestLevel(tciQuickProfile);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      <style>{`
        @keyframes nlIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nl-in { animation: nlIn 0.4s ease-out forwards; }
        @keyframes nlSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nl-slide-up { animation: nlSlideUp 0.35s ease-out forwards; }
      `}</style>

      <div className="nl-in flex flex-col h-full px-5 pt-10 pb-6 overflow-y-auto">
        {/* 헤더 */}
        <div className="mb-7 px-1">
          <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-3">
            욕구 단계 선택
          </p>
          <h2
            className="text-[1.4rem] font-black text-white leading-snug"
            style={{ wordBreak: "keep-all" }}
          >
            지금 가장 갈망하는
            <br />
            <span className="text-amber-400">단 하나를 선택하세요.</span>
          </h2>
        </div>

        {/* TCI 추천 힌트 */}
        {suggestion && (
          <div className="mb-5 px-1">
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-amber-500 text-xs mt-0.5">✦</span>
              <p
                className="text-amber-300/80 text-[0.8rem] leading-relaxed"
                style={{ wordBreak: "keep-all" }}
              >
                {suggestion.hint}
              </p>
            </div>
          </div>
        )}

        {/* 피라미드 카드 목록 (5 → 1) */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {LEVELS.map((item, idx) => {
            const isSelected = selected === item.level;
            const isSuggested = suggestion?.level === item.level;

            return (
              <button
                key={item.level}
                onClick={() => setSelected(item.level)}
                className={`
                  ${item.widthClass} w-full
                  flex items-center gap-3
                  rounded-2xl px-4 py-3.5
                  border transition-all duration-200
                  text-left active:scale-[0.98]
                  ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : "bg-slate-900/70 border-white/5 hover:border-amber-500/20 hover:bg-slate-800/80"
                  }
                `}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* 레벨 번호 */}
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-colors
                    ${
                      isSelected
                        ? "bg-amber-500 border-amber-500 text-slate-950"
                        : "border-slate-700 text-slate-500"
                    }
                  `}
                >
                  {item.level}
                </span>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-black leading-tight ${
                        isSelected ? "text-amber-300" : "text-slate-200"
                      }`}
                      style={{ wordBreak: "keep-all" }}
                    >
                      {item.title}
                    </span>
                    {isSuggested && (
                      <span className="text-[9px] text-amber-500 font-black tracking-widest uppercase border border-amber-500/40 rounded-full px-1.5 py-0.5">
                        추천
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[0.78rem] mt-0.5 leading-snug ${
                      isSelected ? "text-amber-400/70" : "text-slate-600"
                    }`}
                    style={{ wordBreak: "keep-all" }}
                  >
                    "{item.quote}"
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 선택 후 안내 + 버튼 */}
        {selected ? (
          <div className="nl-slide-up mt-auto px-1">
            <p
              className="text-slate-500 text-[0.8rem] text-center leading-relaxed mb-5"
              style={{ wordBreak: "keep-all" }}
            >
              나중에 나머지 4단계도 설정할 수 있어요.
              <br />
              지금은 가장 절실한 것 하나에 집중합시다.
            </p>
            <button
              onClick={() => onComplete(selected)}
              className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.25)]"
            >
              다음 단계로
            </button>
          </div>
        ) : (
          <div className="mt-auto px-1">
            <p className="text-slate-700 text-[0.78rem] text-center tracking-wide">
              하나를 탭하여 선택하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedLevelScreen;
