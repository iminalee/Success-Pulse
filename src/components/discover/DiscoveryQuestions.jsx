import React, { useState, useRef, useEffect } from "react";

// ── 질문 풀: needLevel × VAK dominant ─────────────────────
// 각 질문은 {YEAR} 플레이스홀더를 TCI 기반으로 교체함
// TCI HA ≥ 70 → "1년 후" / 기본 → "5년 후"

const QUESTION_POOL = {
  // ── 1단계: 건강과 활력 ────────────────────────────────
  1: {
    V: [
      "{YEAR} 아침, 거울 앞에 선 당신의 모습은 어떤가요?\n얼굴 표정, 몸의 상태, 눈빛을 묘사해주세요.",
      "건강한 일상 속에서 당신이 가장 활력 있게 움직이는 장면을 영화처럼 떠올려본다면?\n어디에 있고, 주변에 무엇이 보이나요?",
      "몸이 건강해진 당신이 입고 다니는 옷이나 전체적인 이미지는 어떤 느낌인가요?\n색깔, 스타일, 분위기를 묘사해주세요.",
    ],
    A: [
      "{YEAR} 후 가장 가까운 사람이 당신의 건강에 대해 뭐라고 말하고 있나요?\n그 말의 톤과 온도는 어떤가요?",
      "몸이 건강하고 활력이 넘칠 때, 스스로에게 어떤 말을 하고 있나요?\n그 목소리는 어떤 느낌인가요?",
      "건강한 하루를 마치며 잠들기 전, 몸과 마음에서 어떤 소리가 들리나요?\n고요함, 안도의 숨소리, 또는 다른 무언가?",
    ],
    K: [
      "{YEAR} 아침에 눈을 떴을 때 몸의 느낌은 어떤가요?\n가벼운가요, 든든한가요? 숨은 어떻게 쉬어지나요?",
      "운동이나 활동 후 몸이 반응하는 느낌을 묘사해주세요.\n근육의 따뜻함, 심장박동, 땀의 질감은 어떤가요?",
      "건강하고 활력 넘치는 하루를 보낸 저녁, 가슴 어딘가에서 올라오는 감각은 무엇인가요?\n그 감정의 온도와 무게는?",
    ],
  },

  // ── 2단계: 안전과 안정 ────────────────────────────────
  2: {
    V: [
      "{YEAR} 후 당신이 안정된 삶 속에서 살고 있는 공간은 어떤 모습인가요?\n조명, 정돈된 상태, 주변 풍경을 묘사해주세요.",
      "경제적·심리적으로 안전하다는 걸 시각적으로 확인할 수 있는 장면이 있다면?\n통장 잔고, 집, 또는 다른 무언가의 모습.",
      "안정감이 얼굴에 드러난다면 어떤 표정인가요?\n그 표정의 눈빛, 표정, 몸짓을 영화 속 한 장면처럼 묘사해주세요.",
    ],
    A: [
      "{YEAR} 후 당신의 삶이 안정되었을 때, 스스로에게 어떤 말을 하고 있나요?\n그 목소리의 톤은 어떤가요? 단단한가요, 부드러운가요?",
      "안전하다는 느낌이 들 때 주변에서 들리는 말은 무엇인가요?\n가족, 친구, 또는 당신 자신의 내면에서?",
      "걱정 없이 잠드는 밤, 마음속에서 어떤 소리나 말이 울리고 있나요?\n고요함인가요, 확신의 목소리인가요?",
    ],
    K: [
      "{YEAR} 후 안정된 삶 속에서 아침에 눈을 떴을 때 몸의 느낌은 어떤가요?\n어깨는 어떤가요? 가슴은? 호흡은?",
      "경제적·심리적 안전감이 몸에 깃들었을 때, 그 느낌의 온도와 무게를 표현한다면?\n따뜻함, 가벼움, 단단함 중 무엇에 가깝나요?",
      "걱정에서 벗어난 순간, 몸 어딘가에서 이완되는 감각이 있다면 어디인가요?\n그 이완의 질감은 어떤가요?",
    ],
  },

  // ── 3단계: 사랑과 소속 ────────────────────────────────
  3: {
    V: [
      "{YEAR} 후 가장 소중한 사람들과 함께 있는 장면을 떠올려보세요.\n어디에 있고, 어떤 표정들이 보이나요?",
      "당신이 진정으로 소속감을 느끼는 공간은 어떤 모습인가요?\n빛, 사람들, 분위기를 영화 한 장면처럼 묘사해주세요.",
      "사랑받고 있다는 걸 눈으로 확인할 수 있는 장면이 있다면?\n그 장면에서 가장 눈에 띄는 것은 무엇인가요?",
    ],
    A: [
      "{YEAR} 후 당신에게 가장 중요한 사람이 당신에 대해 뭐라고 말하고 있나요?\n그 말의 톤, 따뜻함, 진심은 어떻게 담겨 있나요?",
      "깊은 관계 속에서 나누는 대화는 어떤 리듬인가요?\n웃음소리, 침묵, 또는 공유되는 말의 느낌을 묘사해주세요.",
      "진정으로 소속된 곳에서 들리는 소리는 무엇인가요?\n사람들의 목소리, 배경음악, 아니면 고요한 연결의 침묵?",
    ],
    K: [
      "{YEAR} 후 사랑하는 사람과 함께 있을 때 가슴에서 올라오는 감각은 무엇인가요?\n그 따뜻함의 온도와 위치는?",
      "소속감을 느끼는 순간, 몸에서 일어나는 변화를 묘사해주세요.\n어깨가 내려앉는 느낌, 호흡의 변화, 표정의 이완?",
      "진심 어린 포옹을 받을 때의 느낌을 묘사한다면?\n온기, 압력, 안도감의 질감은 어떤가요?",
    ],
  },

  // ── 4단계: 인정과 성취 ────────────────────────────────
  4: {
    V: [
      "{YEAR} 후 당신이 능력을 인정받는 순간의 장면을 떠올려보세요.\n어디에 있고, 주변에 무엇이 보이나요?",
      "성취를 이룬 당신의 공간이나 환경은 어떤 모습인가요?\n책상, 사무실, 무대, 또는 다른 어떤 곳?",
      "성취의 상징이 눈앞에 있다면 무엇인가요?\n트로피, 숫자, 표정, 또는 다른 시각적 장면?",
    ],
    A: [
      "{YEAR} 후 당신의 능력을 인정하는 말을 듣는다면 누가, 뭐라고 말하고 있나요?\n그 말의 톤과 무게는?",
      "성취를 이룬 당신이 스스로에게 하는 말은 무엇인가요?\n어떤 목소리로, 어떤 확신으로 말하고 있나요?",
      "성공의 순간 주변에서 들리는 소리는 무엇인가요?\n박수, 축하의 말, 조용한 만족의 침묵?",
    ],
    K: [
      "{YEAR} 후 중요한 성취를 이루었을 때 가슴에서 올라오는 감정은 무엇인가요?\n그 뿌듯함의 온도와 위치는?",
      "인정받는 순간, 몸에서 가장 먼저 어떤 변화가 느껴지나요?\n어깨, 가슴, 호흡, 눈가 중 어디인가요?",
      "성취의 악수를 나눌 때 손에서 전달되는 느낌은 어떤가요?\n힘, 온기, 연결감의 질감을 묘사해주세요.",
    ],
  },

  // ── 5단계: 나다움 실현 (스펙 원문) ──────────────────────
  5: {
    V: [
      "{YEAR} 아침, 눈을 떠서 처음 보이는 풍경은 어떤가요?\n천장, 창문 밖 풍경, 방의 분위기를 묘사해주세요.",
      "그날 입고 있는 옷은 어떤 스타일인가요?\n색깔, 질감, 분위기를 떠올려보세요.",
      "가장 성취감을 느끼는 순간의 장면을 영화처럼 묘사한다면?\n어디에 있고, 주변에 뭐가 보이나요?",
    ],
    A: [
      "{YEAR} 후의 당신에게 가장 가까운 사람이 당신에 대해 뭐라고 말하고 있나요?\n그 말의 톤은 어떤가요?",
      "성공한 당신이 스스로에게 하는 말은 무엇인가요?\n어떤 목소리 톤으로 말하고 있나요?",
      "그 순간 주변에서 들리는 소리는 무엇인가요?\n박수, 음악, 자연의 소리, 또는 고요함?",
    ],
    K: [
      "{YEAR} 아침에 일어났을 때 몸의 느낌은 어떤가요?\n가벼운가요, 든든한가요? 어깨는 펴져 있나요?",
      "가장 성취감을 느끼는 순간, 가슴에서 어떤 감정이 올라오나요?\n그 감정의 온도와 무게는 어떤가요?",
      "그 순간 악수를 하거나 포옹을 한다면,\n그 느낌은 어떤 질감일까요?",
    ],
  },
};

// ── TCI 기반 톤 조절 ──────────────────────────────────────
const getAdjustedQuestions = (needLevel, dominant, tci) => {
  const pool = QUESTION_POOL[needLevel]?.[dominant] ?? QUESTION_POOL[5][dominant];

  const year = tci.ha >= 70 ? "1년" : "5년";
  const nsPrefix = tci.ns >= 70 ? "상상의 제한 없이, " : "";
  const haPrefix = tci.ha >= 70 ? "편안하게 떠올려보세요. " : "";
  const prefix = nsPrefix || haPrefix;

  const questions = pool.map((q) => {
    const adjusted = q.replace(/\{YEAR\}/g, year);
    return prefix ? prefix + adjusted.charAt(0).toLowerCase() + adjusted.slice(1) : adjusted;
  });

  // P < 40이면 3개 그대로 (풀이 이미 3개라 변화 없음, 확장성을 위해 명시)
  return tci.p < 40 ? questions.slice(0, 3) : questions;
};

// ── 채널 힌트 ─────────────────────────────────────────────
const CHANNEL_HINT = {
  V: "눈앞에 그려지는 이미지를 중심으로 자유롭게 묘사해주세요.",
  A: "들리는 소리와 목소리를 중심으로 자유롭게 표현해주세요.",
  K: "몸과 가슴에서 느껴지는 감각을 중심으로 자유롭게 써주세요.",
};

// ── 메인 컴포넌트 ─────────────────────────────────────────
const DiscoveryQuestions = ({ needLevel, vakProfile, tciQuickProfile, onComplete }) => {
  const dominant = vakProfile?.dominant ?? "V";
  const tci = tciQuickProfile ?? { ns: 50, ha: 50, rd: 50, p: 50 };
  const questions = getAdjustedQuestions(needLevel, dominant, tci);

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [transitioning, setTransitioning] = useState(false);
  const textareaRef = useRef(null);

  // 질문 바뀔 때 textarea 포커스
  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 380);
    }
  }, [qIndex]);

  const currentAnswer = answers[qIndex] ?? "";

  const handleNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        onComplete(answers);
      }
      setTransitioning(false);
    }, 280);
  };

  const handleSkip = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      if (qIndex < questions.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        onComplete(answers);
      }
      setTransitioning(false);
    }, 280);
  };

  const updateAnswer = (val) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = val;
      return next;
    });
  };

  const progress = (qIndex / questions.length) * 100;
  const isLast = qIndex === questions.length - 1;

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      <style>{`
        @keyframes dqIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dqOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-10px); }
        }
        .dq-in  { animation: dqIn  0.38s ease-out forwards; }
        .dq-out { animation: dqOut 0.24s ease-in  forwards; }

        .dq-textarea {
          background: transparent;
          resize: none;
          outline: none;
          width: 100%;
          color: #e2e8f0;
          font-size: 0.95rem;
          line-height: 1.75;
          min-height: 120px;
          word-break: keep-all;
        }
        .dq-textarea::placeholder { color: #334155; }
      `}</style>

      {/* 진행률 바 */}
      <div className="w-full h-0.5 bg-slate-800 shrink-0">
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 상단 메타 */}
      <div className="px-6 pt-7 pb-0 shrink-0">
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase">
            {qIndex + 1} / {questions.length}
          </p>
          <p className="text-[9px] text-slate-700 font-bold tracking-widest uppercase">
            {dominant === "V" ? "시각형" : dominant === "A" ? "청각형" : "감각형"} 채널
          </p>
        </div>
      </div>

      {/* 질문 + 입력 */}
      <div
        key={qIndex}
        className={`flex-1 flex flex-col px-6 pt-7 pb-4 overflow-y-auto ${
          transitioning ? "dq-out" : "dq-in"
        }`}
      >
        {/* 채널 힌트 */}
        <p
          className="text-[0.75rem] text-amber-500/50 mb-5 leading-relaxed"
          style={{ wordBreak: "keep-all" }}
        >
          {CHANNEL_HINT[dominant]}
        </p>

        {/* 질문 텍스트 */}
        <h2
          className="text-[1.25rem] font-bold text-white leading-[1.75] mb-8 whitespace-pre-line"
          style={{ wordBreak: "keep-all" }}
        >
          {questions[qIndex]}
        </h2>

        {/* 텍스트 입력 */}
        <div className="flex-1 border-b border-slate-800 pb-3 mb-1">
          <textarea
            ref={textareaRef}
            className="dq-textarea"
            placeholder="자유롭게 써주세요. 떠오르는 것 그대로..."
            value={currentAnswer}
            onChange={(e) => updateAnswer(e.target.value)}
            rows={5}
          />
        </div>

        {/* 글자 수 */}
        <p className="text-[10px] text-slate-700 text-right mb-6">
          {currentAnswer.length}자
        </p>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="px-6 pb-8 pt-2 shrink-0 flex flex-col gap-3">
        <button
          onClick={handleNext}
          disabled={transitioning}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-50"
        >
          {isLast ? "완료" : "다음 질문"}
        </button>

        {currentAnswer.trim() === "" && (
          <button
            onClick={handleSkip}
            className="w-full text-slate-600 hover:text-slate-400 text-xs font-bold py-2 transition-colors tracking-widest uppercase"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  );
};

export default DiscoveryQuestions;
