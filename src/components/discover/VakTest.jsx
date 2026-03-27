import React, { useState, useEffect } from "react";

// ── 10문항 데이터 (A=V, B=A, C=K) ─────────────────────────
const QUESTIONS = [
  {
    q: "가장 기억에 남는 여행의 추억은?",
    v: "눈앞에 펼쳐진 풍경이 먼저 떠오른다",
    a: "그곳에서 들었던 소리나 음악이 먼저 떠오른다",
    k: "그때 느꼈던 바람이나 온도가 먼저 떠오른다",
  },
  {
    q: "새로운 기계를 샀을 때?",
    v: "설명서의 그림이나 영상을 먼저 본다",
    a: "누군가에게 사용법을 물어본다",
    k: "일단 만져보면서 익힌다",
  },
  {
    q: "스트레스를 받을 때 나타나는 반응은?",
    v: "머릿속에 부정적인 장면이 떠오른다",
    a: "내면의 비판적인 목소리가 들린다",
    k: "가슴이 답답하거나 몸이 무거워진다",
  },
  {
    q: "누군가를 설득할 때?",
    v: "자료나 그래프를 보여준다",
    a: "논리적으로 설명한다",
    k: "함께 직접 해보자고 제안한다",
  },
  {
    q: "좋아하는 책이나 콘텐츠는?",
    v: "사진, 인포그래픽이 많은 것",
    a: "팟캐스트, 오디오북",
    k: "직접 해볼 수 있는 워크북, 체험형",
  },
  {
    q: '"이건 좋은 아이디어야"를 표현할 때?',
    v: '"그림이 그려진다" / "밝은 전망이 보인다"',
    a: '"귀에 쏙 들어온다" / "좋은 소리다"',
    k: '"느낌이 좋다" / "감이 온다"',
  },
  {
    q: "미래의 목표를 생각할 때?",
    v: "성공한 모습의 이미지가 떠오른다",
    a: "축하받는 말이나 내면의 확신이 들린다",
    k: "가슴이 벅차오르는 느낌이 온다",
  },
  {
    q: "학습할 때 가장 효과적인 방법은?",
    v: "도표, 마인드맵으로 정리",
    a: "소리 내어 읽거나 녹음해서 듣기",
    k: "직접 써보거나 움직이며 익히기",
  },
  {
    q: "편안함을 느끼는 공간은?",
    v: "깔끔하고 조명이 예쁜 곳",
    a: "좋아하는 음악이 흐르는 곳",
    k: "소파가 편하고 온도가 적당한 곳",
  },
  {
    q: "지금 이 순간 가장 먼저 알아차리는 것은?",
    v: "화면의 글자와 색깔",
    a: "주변의 소리 (에어컨, 시계 등)",
    k: "의자에 닿는 몸의 느낌",
  },
];

// ── 채점 로직 ─────────────────────────────────────────────
const calculateVAK = (answers) => {
  const v = answers.filter((a) => a === "V").length;
  const a = answers.filter((a) => a === "A").length;
  const k = answers.filter((a) => a === "K").length;
  const total = v + a + k;
  const vPercent = Math.round((v / total) * 100);
  const aPercent = Math.round((a / total) * 100);
  const kPercent = Math.round((k / total) * 100);
  const dominant = v >= a && v >= k ? "V" : a >= v && a >= k ? "A" : "K";
  const order = [
    { key: "V", val: vPercent },
    { key: "A", val: aPercent },
    { key: "K", val: kPercent },
  ]
    .sort((x, y) => y.val - x.val)
    .map((x) => x.key)
    .join("-");
  return { vPercent, aPercent, kPercent, dominant, order };
};

// ── VAK 해석 데이터 ───────────────────────────────────────
const VAK_INFO = {
  V: {
    label: "시각",
    title: "시각적 건축가",
    desc: "당신의 뇌는 '보이는 것'에 가장 강하게 반응합니다.",
    tip: "목표를 이미지로 만드세요. 비전보드, 사진, 컬러가 당신의 연료입니다.",
    color: "#F59E0B",
  },
  A: {
    label: "청각",
    title: "청각적 작곡가",
    desc: "당신의 뇌는 '들리는 것'에 가장 강하게 반응합니다.",
    tip: "확언을 소리 내어 읽거나 녹음하세요. 말과 소리가 당신의 연료입니다.",
    color: "#F59E0B",
  },
  K: {
    label: "신체감각",
    title: "감각적 조각가",
    desc: "당신의 뇌는 '느끼는 것'에 가장 강하게 반응합니다.",
    tip: "목표를 몸으로 느끼세요. 움직임, 감정, 체험이 당신의 연료입니다.",
    color: "#F59E0B",
  },
};

const CHANNELS = [
  { key: "V", label: "V  시각" },
  { key: "A", label: "A  청각" },
  { key: "K", label: "K  신체감각" },
];

// ── 메인 컴포넌트 ─────────────────────────────────────────
const VakTest = ({ onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("quiz"); // "quiz" | "result"
  const [transitioning, setTransitioning] = useState(false);
  const [vakProfile, setVakProfile] = useState(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    if (phase === "result") {
      const t = setTimeout(() => setBarsVisible(true), 150);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleAnswer = (channel) => {
    if (transitioning) return;
    setTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, channel];
      if (newAnswers.length === 10) {
        setVakProfile(calculateVAK(newAnswers));
        setAnswers(newAnswers);
        setPhase("result");
      } else {
        setAnswers(newAnswers);
        setQuestionIndex((i) => i + 1);
      }
      setTransitioning(false);
    }, 280);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      <style>{`
        @keyframes vakIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vakOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
        .vak-in  { animation: vakIn  0.35s ease-out forwards; }
        .vak-out { animation: vakOut 0.25s ease-in  forwards; }
      `}</style>

      {phase === "quiz" ? (
        <QuizPhase
          questionIndex={questionIndex}
          transitioning={transitioning}
          onAnswer={handleAnswer}
        />
      ) : (
        <ResultPhase
          vakProfile={vakProfile}
          barsVisible={barsVisible}
          onNext={() => onComplete(vakProfile)}
        />
      )}
    </div>
  );
};

// ── 문항 화면 ─────────────────────────────────────────────
const QuizPhase = ({ questionIndex, transitioning, onAnswer }) => {
  const q = QUESTIONS[questionIndex];
  const progress = (questionIndex / 10) * 100;

  return (
    <>
      {/* 진행률 바 */}
      <div className="w-full h-0.5 bg-slate-800">
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 문항 번호 */}
      <div className="px-6 pt-8">
        <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase">
          {questionIndex + 1} / 10
        </p>
      </div>

      {/* 문항 + 보기 */}
      <div
        key={questionIndex}
        className={`flex-1 flex flex-col justify-center px-7 pb-10 ${
          transitioning ? "vak-out" : "vak-in"
        }`}
      >
        <h2
          className="text-[1.45rem] font-bold text-white leading-[1.7] mb-10"
          style={{ wordBreak: "keep-all" }}
        >
          {q.q}
        </h2>

        <div className="flex flex-col gap-3">
          <ChoiceBtn label="A" text={q.v} onPress={() => onAnswer("V")} />
          <ChoiceBtn label="B" text={q.a} onPress={() => onAnswer("A")} />
          <ChoiceBtn label="C" text={q.k} onPress={() => onAnswer("K")} />
        </div>
      </div>
    </>
  );
};

const ChoiceBtn = ({ label, text, onPress }) => (
  <button
    onClick={onPress}
    className="w-full flex items-start gap-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] border border-white/5 hover:border-amber-500/30 rounded-2xl px-5 py-4 text-left transition-all duration-150"
  >
    <span className="shrink-0 w-7 h-7 rounded-full border border-amber-500/40 text-amber-500 text-xs font-black flex items-center justify-center mt-0.5">
      {label}
    </span>
    <span
      className="text-slate-200 text-[0.9rem] leading-[1.6] font-medium"
      style={{ wordBreak: "keep-all" }}
    >
      {text}
    </span>
  </button>
);

// ── 결과 화면 ─────────────────────────────────────────────
const ResultPhase = ({ vakProfile, barsVisible, onNext }) => {
  const dominant = vakProfile.dominant;
  const info = VAK_INFO[dominant];
  const percents = {
    V: vakProfile.vPercent,
    A: vakProfile.aPercent,
    K: vakProfile.kPercent,
  };

  return (
    <div className="vak-in flex flex-col h-full px-6 pt-10 pb-8 overflow-y-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-3">
          감각 채널 분석 완료
        </p>
        <h2 className="text-2xl font-black text-white leading-tight mb-1" style={{ wordBreak: "keep-all" }}>
          당신은
        </h2>
        <h2 className="text-2xl font-black text-amber-400 leading-tight" style={{ wordBreak: "keep-all" }}>
          {info.title}
        </h2>
        <p className="text-slate-400 text-[0.9rem] mt-3 leading-relaxed" style={{ wordBreak: "keep-all" }}>
          {info.desc}
        </p>
      </div>

      {/* V/A/K 바 차트 */}
      <div className="flex flex-col gap-4 mb-8">
        {CHANNELS.map(({ key, label }, idx) => {
          const pct = percents[key];
          const isDominant = key === dominant;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-black tracking-widest ${
                    isDominant ? "text-amber-400" : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`text-xs font-bold tabular-nums ${
                    isDominant ? "text-amber-400" : "text-slate-500"
                  }`}
                >
                  {pct}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: barsVisible ? `${pct}%` : "0%",
                    transitionDelay: `${idx * 120}ms`,
                    backgroundColor: isDominant ? "#F59E0B" : "#334155",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 팁 카드 */}
      <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl px-5 py-4 mb-8">
        <p className="text-[9px] text-amber-500/60 font-black tracking-[0.4em] uppercase mb-2">
          BPS 설정 팁
        </p>
        <p
          className="text-slate-300 text-[0.88rem] leading-relaxed"
          style={{ wordBreak: "keep-all" }}
        >
          {info.tip}
        </p>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.25)]"
      >
        다음 단계로
      </button>
    </div>
  );
};

export default VakTest;
