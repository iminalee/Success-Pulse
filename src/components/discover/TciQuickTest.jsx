import React, { useState, useEffect } from "react";

// ── 15문항 데이터 ──────────────────────────────────────────
const QUESTIONS = [
  // NS (자극추구) — Q1~4
  { q: "새로운 식당이 생기면?",              a: "바로 가본다",                        b: "리뷰가 쌓일 때까지 기다린다" },
  { q: "주말에 갑자기 비어있는 시간이 생기면?", a: "즉흥적으로 뭔가 새로운 걸 한다",      b: "미리 정해둔 일을 한다" },
  { q: "같은 루틴을 매일 반복하는 것은?",      a: "지루해서 못 견딘다",                  b: "오히려 편안하다" },
  { q: "여행 계획을 세울 때?",               a: "대충 정하고 현지에서 즉흥으로",         b: "세세한 일정을 미리 짠다" },
  // HA (위험회피) — Q5~8
  { q: "새로운 프로젝트를 시작할 때?",        a: "잘 안 되면 어쩌지 하는 걱정이 먼저 든다", b: "일단 시작하고 보자는 편이다" },
  { q: "중요한 결정 앞에서?",               a: "충분히 생각한 뒤 신중하게 결정한다",    b: "직감을 믿고 빠르게 결정한다" },
  { q: "불확실한 상황에서?",                a: "불안하고 최악의 경우를 먼저 떠올린다",   b: "어떻게든 되겠지 하고 넘어간다" },
  { q: "타인의 비판이나 부정적 피드백을 받으면?", a: "오래 마음에 남는다",               b: "금방 털어버린다" },
  // RD (사회적 민감성) — Q9~12
  { q: "주변 사람들의 칭찬이나 인정은?",      a: "나에게 큰 동기가 된다",               b: "있으면 좋지만 없어도 괜찮다" },
  { q: "혼자 일하는 것 vs 팀으로 일하는 것?", a: "팀에서 에너지를 받는다",              b: "혼자가 더 효율적이다" },
  { q: "누군가 도움을 요청하면?",            a: "내 일을 미뤄서라도 도와준다",           b: "내 일부터 마무리한다" },
  { q: "사람들과 오래 만나지 못하면?",        a: "외롭고 연락하고 싶어진다",             b: "그다지 신경 쓰이지 않는다" },
  // P (인내력) — Q13~15
  { q: "보상이 바로 오지 않는 장기 프로젝트에서?", a: "꾸준히 해나갈 수 있다",           b: "중간에 지쳐서 포기하는 편이다" },
  { q: "운동이나 다이어트 같은 자기관리?",    a: "일단 시작하면 꽤 오래 유지한다",       b: "삼일을 넘기기 어렵다" },
  { q: "어려운 퍼즐이나 문제를 만나면?",      a: "풀릴 때까지 파고든다",                b: "답답하면 다른 걸로 넘어간다" },
];

// ── 채점 로직 ────────────────────────────────────────────
const calculateTciQuick = (answers) => {
  const ns = Math.round(((answers[0]+answers[1]+answers[2]+answers[3]) / 4) * 100);
  const ha = Math.round(((answers[4]+answers[5]+answers[6]+answers[7]) / 4) * 100);
  const rd = Math.round(((answers[8]+answers[9]+answers[10]+answers[11]) / 4) * 100);
  const p  = Math.round(((answers[12]+answers[13]+answers[14]) / 3) * 100);
  return { ns, ha, rd, p };
};

// ── 해석 데이터 (스펙 + TCI_VAK_BPS_PRINCIPLES 통합) ─────
const DIMS = [
  {
    key: "ns",
    label: "자극추구",
    high: {
      title: "탐험가",
      desc: "새로운 것에 빠르게 끌리는 탐험가 기질. 다양한 시도를 좋아하지만, 하나에 오래 집중하기 어려울 수 있어요.",
    },
    low: {
      title: "건축가",
      desc: "익숙한 것에서 안정감을 느끼는 신중한 기질. 한번 시작하면 꾸준하지만, 첫 시작이 어려울 수 있어요.",
    },
  },
  {
    key: "ha",
    label: "위험회피",
    high: {
      title: "수호자",
      desc: "신중하고 안전을 중시하는 기질. 위험을 미리 감지하는 능력이 뛰어나지만, 변화 앞에서 망설일 수 있어요.",
    },
    low: {
      title: "개척자",
      desc: "도전과 변화에 거리낌이 없는 대담한 기질. 빠르게 실행하지만, 때로 위험을 과소평가할 수 있어요.",
    },
  },
  {
    key: "rd",
    label: "사회적 민감성",
    high: {
      title: "연결자",
      desc: "관계와 인정이 중요한 연결형 기질. 사람들과의 유대에서 에너지를 얻지만, 타인의 평가에 민감할 수 있어요.",
    },
    low: {
      title: "독행자",
      desc: "독립적이고 자기 기준이 확고한 기질. 홀로서기에 강하지만, 고립될 수 있어요.",
    },
  },
  {
    key: "p",
    label: "인내력",
    high: {
      title: "마라토너",
      desc: "끈기와 집중력이 뛰어난 마라토너 기질. 장기전에 강하지만, 유연성이 부족할 수 있어요.",
    },
    low: {
      title: "스프린터",
      desc: "빠른 전환과 적응이 강점인 스프린터 기질. 순발력은 좋지만, 장기 프로젝트에서 에너지 관리가 필요해요.",
    },
  },
];

// ── 메인 컴포넌트 ─────────────────────────────────────────
const TciQuickTest = ({ onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("quiz"); // "quiz" | "result"
  const [transitioning, setTransitioning] = useState(false);
  const [tciProfile, setTciProfile] = useState(null);
  const [barsVisible, setBarsVisible] = useState(false);

  // 결과 화면 진입 시 바 애니메이션 트리거
  useEffect(() => {
    if (phase === "result") {
      const t = setTimeout(() => setBarsVisible(true), 150);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleAnswer = (value) => {
    if (transitioning) return;
    setTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, value];
      if (newAnswers.length === 15) {
        setTciProfile(calculateTciQuick(newAnswers));
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
        @keyframes tciIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tciOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
        .tci-in  { animation: tciIn  0.35s ease-out forwards; }
        .tci-out { animation: tciOut 0.25s ease-in  forwards; }
        @keyframes barFill {
          from { width: 0%; }
        }
      `}</style>

      {phase === "quiz" ? (
        <QuizPhase
          questionIndex={questionIndex}
          transitioning={transitioning}
          onAnswer={handleAnswer}
        />
      ) : (
        <ResultPhase
          tciProfile={tciProfile}
          barsVisible={barsVisible}
          onNext={() => onComplete(tciProfile)}
        />
      )}
    </div>
  );
};

// ── 문항 화면 ─────────────────────────────────────────────
const QuizPhase = ({ questionIndex, transitioning, onAnswer }) => {
  const q = QUESTIONS[questionIndex];
  const progress = ((questionIndex) / 15) * 100;

  return (
    <>
      {/* 상단 진행률 바 */}
      <div className="w-full h-0.5 bg-slate-800">
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 문항 번호 */}
      <div className="px-6 pt-8 pb-0">
        <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase">
          {questionIndex + 1} / 15
        </p>
      </div>

      {/* 문항 + 버튼 */}
      <div
        key={questionIndex}
        className={`flex-1 flex flex-col justify-center px-7 pb-10 ${
          transitioning ? "tci-out" : "tci-in"
        }`}
      >
        <h2
          className="text-[1.45rem] font-bold text-white leading-[1.7] mb-12"
          style={{ wordBreak: "keep-all" }}
        >
          {q.q}
        </h2>

        <div className="flex flex-col gap-4">
          <ChoiceBtn label="A" text={q.a} onPress={() => onAnswer(1)} />
          <ChoiceBtn label="B" text={q.b} onPress={() => onAnswer(0)} />
        </div>
      </div>
    </>
  );
};

const ChoiceBtn = ({ label, text, onPress }) => (
  <button
    onClick={onPress}
    className="w-full flex items-start gap-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] border border-white/5 hover:border-amber-500/30 rounded-2xl px-5 py-5 text-left transition-all duration-150"
  >
    <span className="shrink-0 w-7 h-7 rounded-full border border-amber-500/40 text-amber-500 text-xs font-black flex items-center justify-center mt-0.5">
      {label}
    </span>
    <span
      className="text-slate-200 text-[0.95rem] leading-[1.6] font-medium"
      style={{ wordBreak: "keep-all" }}
    >
      {text}
    </span>
  </button>
);

// ── 결과 화면 ─────────────────────────────────────────────
const ResultPhase = ({ tciProfile, barsVisible, onNext }) => {
  return (
    <div className="tci-in flex flex-col h-full px-6 pt-10 pb-8 overflow-y-auto">
      {/* 타이틀 */}
      <div className="mb-8">
        <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-3">
          기질 프로파일 완료
        </p>
        <h2 className="text-2xl font-black text-white leading-tight" style={{ wordBreak: "keep-all" }}>
          당신의 기질 지도가<br />
          <span className="text-amber-400">완성되었습니다.</span>
        </h2>
      </div>

      {/* 4개 차원 바 */}
      <div className="flex flex-col gap-5 mb-10">
        {DIMS.map((dim, idx) => {
          const score = tciProfile[dim.key];
          const isHigh = score >= 50;
          const info = isHigh ? dim.high : dim.low;
          return (
            <DimBar
              key={dim.key}
              label={dim.label}
              title={info.title}
              desc={info.desc}
              score={score}
              visible={barsVisible}
              delay={idx * 120}
            />
          );
        })}
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

const DimBar = ({ label, title, desc, score, visible, delay }) => (
  <div>
    {/* 레이블 행 */}
    <div className="flex items-baseline justify-between mb-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{label}</span>
        <span className="text-sm font-black text-amber-400">{title}</span>
      </div>
      <span className="text-xs text-slate-500 font-bold tabular-nums">{score}%</span>
    </div>

    {/* 바 */}
    <div className="w-full h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
      <div
        className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
        style={{
          width: visible ? `${score}%` : "0%",
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>

    {/* 해석 텍스트 */}
    <p
      className="text-[0.8rem] text-slate-500 leading-[1.65]"
      style={{ wordBreak: "keep-all" }}
    >
      {desc}
    </p>
  </div>
);

export default TciQuickTest;
