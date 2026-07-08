import React from "react";
import { Sparkles } from "lucide-react";
import { LEVEL_NAMES, VAK_TITLES } from "./discover/ResultShareScreen";

// ── My Lab '현재의 나' — Apex Profile 카드 ──
// 우선순위: Act1 journey_snapshot(원본 quick 프로필) → 없으면 최상위 프로필 컬럼
// (tci_profile / vak_profile / visions)에서 직접 파생.
// 중첩 스냅샷이 없거나 옛 가입자여도, 저장된 TCI·VAK·비전만 있으면 표시된다.

const TCI_TYPES = {
  ns: { high: "탐험가", low: "건축가" },
  ha: { high: "수호자", low: "개척자" },
  rd: { high: "연결자", low: "독행자" },
  p: { high: "마라토너", low: "스프린터" },
};

// TCI 값을 숫자로 정규화 — 원본({ns:50})과 정규화형({ns:{score:50}}) 모두 지원
const tciScore = (profile, key) => {
  const raw = profile?.[key];
  const n = raw && typeof raw === "object" ? Number(raw.score) : Number(raw);
  return Number.isFinite(n) ? n : null;
};

const deriveTciType = (profile) => {
  if (!profile || typeof profile !== "object") return null;
  const dims = Object.entries(TCI_TYPES)
    .map(([k, v]) => ({ score: tciScore(profile, k), ...v }))
    .filter((d) => d.score !== null);
  if (dims.length === 0) return null;
  const hasSignal = dims.some((d) => d.score !== 50);
  if (!hasSignal) return null; // 전부 기본값 50 → 의미 없음
  const top = dims.reduce((a, b) =>
    Math.abs(a.score - 50) >= Math.abs(b.score - 50) ? a : b
  );
  return top.score >= 50 ? top.high : top.low;
};

const deriveVakDominant = (vak) => {
  if (!vak || typeof vak !== "object") return null;
  if (["V", "A", "K"].includes(vak.dominant)) return vak.dominant;
  const v = Number(vak.vPercent ?? vak.v);
  const a = Number(vak.aPercent ?? vak.a);
  const k = Number(vak.kPercent ?? vak.k);
  if ([v, a, k].every(Number.isFinite) && !(v === a && a === k)) {
    const max = Math.max(v, a, k);
    return v === max ? "V" : a === max ? "A" : "K";
  }
  if (typeof vak.order === "string") {
    const m = vak.order.match(/[VAK]/);
    if (m) return m[0];
  }
  return null;
};

// visions에서 비전이 입력된 단계를 찾음 (선호 단계 우선)
const findVision = (visions, preferLevel) => {
  if (!visions || typeof visions !== "object") return null;
  const titled = (lv) => String(visions[lv]?.title || "").trim() !== "";
  if (preferLevel && titled(preferLevel)) {
    return { lv: preferLevel, ...visions[preferLevel] };
  }
  for (const lv of [5, 4, 3, 2, 1]) {
    if (titled(lv)) return { lv, ...visions[lv] };
  }
  return null;
};

// snapshot(있으면) + live 프로필을 하나의 결과로 병합
const buildResult = (snapshot, live, fallbackName) => {
  const s = snapshot || {};
  const l = live || {};

  const name = s.userName || l.userName || fallbackName || "—";

  const tciType =
    (s.tciQuickProfile && deriveTciType(s.tciQuickProfile)) ||
    deriveTciType(l.tciProfile) ||
    null;

  const vakDominant =
    deriveVakDominant(s.vakProfile) || deriveVakDominant(l.vakProfile) || null;
  const vakTitle = vakDominant ? VAK_TITLES[vakDominant] : null;

  const preferLevel = Number.isInteger(s.selectedNeedLevel)
    ? s.selectedNeedLevel
    : l.selectedNeedLevel;
  const vision = findVision(l.visions, preferLevel);

  const bpsTitle = s.generatedBPS?.title || vision?.title || null;
  const immersion = s.generatedBPS?.immersionScript || vision?.immersionScript || "";
  const focusLevel = Number.isInteger(s.selectedNeedLevel)
    ? s.selectedNeedLevel
    : vision?.lv ?? null;

  const hasAny = !!(tciType || vakTitle || bpsTitle);

  return { name, tciType, vakTitle, bpsTitle, immersion, focusLevel, hasAny };
};

const ResultRow = ({ label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase w-16 shrink-0 pt-0.5">
      {label}
    </span>
    <span
      className={`text-sm font-bold flex-1 ${highlight ? "text-amber-300" : "text-slate-300"}`}
      style={{ wordBreak: "keep-all" }}
    >
      {value}
    </span>
  </div>
);

const ProfileResultCard = ({ snapshot, live, userName, onRunSurvey }) => {
  const r = buildResult(snapshot, live, userName);

  if (!r.hasAny) {
    // ── 결과 없음: Discover 설문 안내 ──
    return (
      <div className="text-center font-sans py-2">
        <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
          <Sparkles size={14} /> Apex Profile / 나의 프로파일
        </p>
        <p className="text-slate-300 text-[12px] leading-relaxed mb-2">
          아직 <span className="text-amber-400 font-bold">Discover 설문 결과</span>가 없습니다.
        </p>
        <p className="text-slate-500 text-[11px] leading-relaxed mb-6">
          3분 설문으로 나의 기질 유형(TCI)과 감각 채널(VAK)을 진단하고
          <br />
          나만의 Apex BPS 비전을 만들어보세요.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRunSurvey && onRunSurvey();
          }}
          className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg"
        >
          ✦ Discover 설문 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <Sparkles size={14} /> Apex Profile / 나의 프로파일
      </p>
      <div className="flex flex-col gap-3">
        <ResultRow label="이름" value={r.name} highlight />
        <ResultRow label="BPS 비전" value={`"${r.bpsTitle || "—"}"`} highlight />
        <ResultRow label="집중 영역" value={LEVEL_NAMES[r.focusLevel] || "—"} />
        <ResultRow label="기질 유형" value={r.tciType || "—"} />
        <ResultRow label="감각 채널" value={r.vakTitle || "—"} />
      </div>

      {r.immersion && (
        <>
          <div className="w-full h-px bg-white/5 my-5" />
          <p className="text-[9px] text-slate-600 font-bold tracking-widest uppercase mb-2">
            몰입 시나리오
          </p>
          <p
            className="text-slate-400 text-xs leading-relaxed italic"
            style={{ wordBreak: "keep-all" }}
          >
            {r.immersion}
          </p>
        </>
      )}

      <div className="mt-6 pt-4 border-t border-white/5 text-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRunSurvey && onRunSurvey();
          }}
          className="text-[10px] font-black text-slate-500 hover:text-amber-400 uppercase tracking-widest transition-colors"
        >
          설문 다시 하기 →
        </button>
      </div>
    </div>
  );
};

export default ProfileResultCard;
