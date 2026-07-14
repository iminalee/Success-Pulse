import React, { useState, useEffect, useCallback } from "react";

const LEVEL_NAMES = {
  1: "건강과 활력",
  2: "안전과 안정",
  3: "사랑과 소속",
  4: "인정과 성취",
  5: "나다움 실현",
};

const LOADING_MESSAGES = [
  "당신의 답변을 분석하고 있습니다...",
  "최고의 자아를 설계하고 있습니다...",
  "VAK 프로파일을 반영하고 있습니다...",
  "당신의 미래 기억을 완성하고 있습니다...",
];

// ── AI 프롬프트 빌더 (스펙 원문 기반) ────────────────────
const buildPrompt = (vakProfile, tciProfile, needLevel, answers, userName) => {
  const toneNotes = [
    tciProfile.ha >= 70 ? "이 사용자는 안전을 중시하므로, 안정감과 확신이 느껴지는 톤으로." : "",
    tciProfile.ns >= 70 ? "이 사용자는 새로움을 추구하므로, 역동적이고 흥미진진한 톤으로." : "",
    tciProfile.rd >= 70 ? "이 사용자는 관계를 중시하므로, 주변 사람들과의 연결이 강조되는 톤으로." : "",
  ].filter(Boolean).join("\n   ");

  const systemPrompt = `너는 세계 최고의 긍정심리학 전문가이자 NLP 마스터 프랙티셔너야.
사용자의 감각 프로파일과 기질 특성을 반영하여,
그가 최고의 자아(Best Possible Self)를 생생하게 경험할 수 있도록 도와줘.

[사용자 프로파일]
- VAK 비율: 시각 ${vakProfile.vPercent}% / 청각 ${vakProfile.aPercent}% / 신체감각 ${vakProfile.kPercent}%
- 우세 채널: ${vakProfile.dominant === "V" ? "시각(Visual)" : vakProfile.dominant === "A" ? "청각(Auditory)" : "신체감각(Kinesthetic)"}
- 기질: 자극추구 ${tciProfile.ns}/100, 위험회피 ${tciProfile.ha}/100, 사회적민감성 ${tciProfile.rd}/100, 인내력 ${tciProfile.p}/100

[규칙]
1. VAK 비율에 맞춰 묘사의 비중을 조절해라.
   시각 ${vakProfile.vPercent}%만큼 색채/밝기/모양 묘사,
   청각 ${vakProfile.aPercent}%만큼 소리/대화/리듬 묘사,
   신체감각 ${vakProfile.kPercent}%만큼 온도/질감/무게/심장박동 묘사.
2. 기질 특성을 반영해라.
   ${toneNotes || "균형 잡힌 톤으로."}
3. 반드시 "나는 ~한다", "나는 ~를 느낀다" 같은 현재형 1인칭으로 작성.
4. 한국어로 작성.`;

  const answersText = [answers.q1, answers.q2, answers.q3]
    .filter(Boolean)
    .map((a, i) => `답변 ${i + 1}: "${a}"`)
    .join("\n");

  const userPrompt = `[상황]
${userName || "사용자"}님이 "${LEVEL_NAMES[needLevel]}" 영역에서 자신의 Best Possible Self를 찾고 있습니다.

아래는 이 사람이 미래의 자신에 대해 답한 내용입니다:
${answersText || "(답변 없음 — 자유롭게 창의적으로 생성해주세요)"}

위 답변을 종합하여 아래 5가지를 생성해주세요:

1. **비전 제목** (한 줄, 10자 이내)
2. **시각(V) 묘사** (2~3문장. 성공한 그 순간에 보이는 것)
3. **청각(A) 묘사** (2~3문장. 성공한 그 순간에 들리는 것)
4. **신체감각(K) 묘사** (2~3문장. 성공한 그 순간에 느끼는 것)
5. **몰입 시나리오** (3~4문장. 1인칭 현재형. 위 VAK를 통합한 생생한 장면)

JSON 형태로만 응답해줘:
{
  "title": "...",
  "vision_v": "...",
  "vision_a": "...",
  "vision_k": "...",
  "immersionScript": "..."
}`;

  return { systemPrompt, userPrompt };
};

// ── JSON 파싱 (마크다운 코드블록 제거) ────────────────────
const parseJsonResponse = (text) => {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned);
};

// ── 메인 컴포넌트 ─────────────────────────────────────────
const BpsGenerator = ({
  needLevel,
  vakProfile,
  tciQuickProfile,
  discoveryAnswers,
  userName,
  onComplete,
}) => {
  const [phase, setPhase] = useState("loading"); // loading | editing | error
  const [bps, setBps] = useState({
    title: "",
    vision_v: "",
    vision_a: "",
    vision_k: "",
    immersionScript: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // 로딩 메시지 순환
  useEffect(() => {
    if (phase !== "loading") return;
    const t = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(t);
  }, [phase]);

  const generateBPS = useCallback(async () => {
    setPhase("loading");
    setErrorMsg("");

    const { systemPrompt, userPrompt } = buildPrompt(
      vakProfile,
      tciQuickProfile,
      needLevel,
      discoveryAnswers,
      userName
    );

    try {
      // OpenAI 키는 서버(api/generate.js)에서만 사용 — 프론트 노출 방지
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temperature: 0.8,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const raw = data.content ?? "";
      const parsed = parseJsonResponse(raw);

      setBps({
        title: parsed.title ?? "",
        vision_v: parsed.vision_v ?? "",
        vision_a: parsed.vision_a ?? "",
        vision_k: parsed.vision_k ?? "",
        immersionScript: parsed.immersionScript ?? "",
      });
      setPhase("editing");
    } catch (e) {
      console.error("BPS generation error:", e);
      setErrorMsg(e.message || "생성 중 오류가 발생했습니다.");
      setPhase("error");
    }
  }, [vakProfile, tciQuickProfile, needLevel, discoveryAnswers, userName]);

  // 마운트 시 자동 생성 (generateBPS는 useCallback으로 메모이즈됨)
  useEffect(() => {
    generateBPS();
  }, [generateBPS]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      <style>{`
        @keyframes bpsIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bps-in { animation: bpsIn 0.4s ease-out forwards; }
        @keyframes bpsPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.08); }
        }
        .bps-pulse { animation: bpsPulse 2s ease-in-out infinite; }
        @keyframes bpsDots {
          0%   { content: ""; }
          33%  { content: "."; }
          66%  { content: ".."; }
          100% { content: "..."; }
        }
        .bps-textarea {
          background: transparent;
          resize: none;
          outline: none;
          width: 100%;
          color: #cbd5e1;
          font-size: 0.88rem;
          line-height: 1.75;
          word-break: keep-all;
        }
        .bps-textarea::placeholder { color: #1e293b; }
      `}</style>

      {phase === "loading" && <LoadingPhase msgIdx={loadingMsgIdx} />}
      {phase === "error" && (
        <ErrorPhase msg={errorMsg} onRetry={generateBPS} />
      )}
      {phase === "editing" && (
        <EditingPhase
          bps={bps}
          setBps={setBps}
          needLevel={needLevel}
          onRegenerate={generateBPS}
          onConfirm={() => onComplete(bps)}
        />
      )}
    </div>
  );
};

// ── 로딩 화면 ─────────────────────────────────────────────
const LoadingPhase = ({ msgIdx }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
    {/* 글로우 오브 */}
    <div className="relative mb-12">
      <div className="w-28 h-28 rounded-full bg-amber-500/10 bps-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 bps-pulse" style={{ animationDelay: "0.3s" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl">✦</span>
      </div>
    </div>

    <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-4">
      BPS 생성 중
    </p>
    <p
      className="text-slate-300 text-base font-medium leading-relaxed transition-all duration-500"
      style={{ wordBreak: "keep-all" }}
    >
      {LOADING_MESSAGES[msgIdx]}
    </p>
  </div>
);

// ── 오류 화면 ─────────────────────────────────────────────
const ErrorPhase = ({ msg, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
    <p className="text-[9px] text-red-400/60 font-black tracking-[0.55em] uppercase">
      생성 오류
    </p>
    <p className="text-slate-400 text-sm leading-relaxed" style={{ wordBreak: "keep-all" }}>
      {msg}
    </p>
    <button
      onClick={onRetry}
      className="w-full max-w-xs bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all"
    >
      다시 시도
    </button>
  </div>
);

// ── 편집 화면 ─────────────────────────────────────────────
const EditingPhase = ({ bps, setBps, needLevel, onRegenerate, onConfirm }) => {
  const update = (key, val) => setBps((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="bps-in flex flex-col h-full overflow-hidden">
      {/* 상단 고정 헤더 */}
      <div className="px-6 pt-9 pb-5 shrink-0">
        <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-2">
          BPS 초안 완성
        </p>
        <h2 className="text-xl font-black text-white" style={{ wordBreak: "keep-all" }}>
          당신의 최고 자아가<br />
          <span className="text-amber-400">완성되었습니다.</span>
        </h2>
        <p className="text-slate-600 text-xs mt-2" style={{ wordBreak: "keep-all" }}>
          원하는 부분을 직접 수정할 수 있습니다.
        </p>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-5">

        {/* 비전 제목 */}
        <Field label="비전 제목" accent="amber">
          <input
            className="w-full bg-transparent text-amber-300 font-black text-lg outline-none placeholder:text-slate-700"
            style={{ wordBreak: "keep-all" }}
            placeholder="비전 제목..."
            value={bps.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </Field>

        {/* V 시각 */}
        <Field label="V  시각 묘사" accent="blue">
          <textarea
            className="bps-textarea"
            rows={3}
            placeholder="눈에 보이는 것..."
            value={bps.vision_v}
            onChange={(e) => update("vision_v", e.target.value)}
          />
        </Field>

        {/* A 청각 */}
        <Field label="A  청각 묘사" accent="purple">
          <textarea
            className="bps-textarea"
            rows={3}
            placeholder="들리는 소리와 말..."
            value={bps.vision_a}
            onChange={(e) => update("vision_a", e.target.value)}
          />
        </Field>

        {/* K 신체감각 */}
        <Field label="K  신체감각 묘사" accent="green">
          <textarea
            className="bps-textarea"
            rows={3}
            placeholder="몸으로 느껴지는 것..."
            value={bps.vision_k}
            onChange={(e) => update("vision_k", e.target.value)}
          />
        </Field>

        {/* 몰입 시나리오 */}
        <Field label="몰입 시나리오" accent="amber">
          <textarea
            className="bps-textarea"
            rows={5}
            placeholder="통합 몰입 시나리오..."
            value={bps.immersionScript}
            onChange={(e) => update("immersionScript", e.target.value)}
          />
        </Field>

      </div>

      {/* 하단 버튼 */}
      <div className="px-6 pt-3 pb-8 shrink-0 flex flex-col gap-3">
        <button
          onClick={onConfirm}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.25)]"
        >
          이대로 확정
        </button>
        <button
          onClick={onRegenerate}
          className="w-full border border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-300 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition-all"
        >
          다시 생성
        </button>
      </div>
    </div>
  );
};

// ── 필드 래퍼 ─────────────────────────────────────────────
const ACCENT_COLORS = {
  amber:  { bar: "bg-amber-500",      label: "text-amber-500/70",  border: "border-amber-500/15" },
  blue:   { bar: "bg-blue-400",       label: "text-blue-400/70",   border: "border-blue-400/10"  },
  purple: { bar: "bg-violet-400",     label: "text-violet-400/70", border: "border-violet-400/10"},
  green:  { bar: "bg-emerald-400",    label: "text-emerald-400/70",border: "border-emerald-400/10"},
};

const Field = ({ label, accent = "amber", children }) => {
  const c = ACCENT_COLORS[accent];
  return (
    <div className={`bg-slate-900/60 border ${c.border} rounded-2xl px-4 pt-3.5 pb-4`}>
      <p className={`text-[9px] font-black tracking-[0.45em] uppercase mb-3 ${c.label}`}>
        {label}
      </p>
      {children}
    </div>
  );
};

export default BpsGenerator;
