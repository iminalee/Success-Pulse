import React from "react";
import { Sparkles } from "lucide-react";
import {
  LEVEL_NAMES,
  VAK_TITLES,
  getDominantType,
} from "./discover/ResultShareScreen";

// ── My Lab '현재의 나' — Act 1(Discover) 결과 표시 카드 ──
// ResultShareScreen의 '나의 프로파일' 요약을 My Lab 카드 스타일로 재사용.
// 결과가 없는 사용자에게는 설문 안내 탭을 보여준다.

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

const ProfileResultCard = ({ snapshot, userName, onRunSurvey }) => {
  const generatedBPS = snapshot?.generatedBPS || null;
  const hasResult = !!(
    snapshot &&
    (generatedBPS?.title || snapshot.tciQuickProfile || snapshot.vakProfile?.dominant)
  );

  if (!hasResult) {
    // ── 결과 없음: Discover 설문 안내 탭 ──
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

  // ── 결과 있음: ResultShareScreen '나의 프로파일' 요약 표시 ──
  const tciType = snapshot.tciQuickProfile
    ? getDominantType(snapshot.tciQuickProfile)
    : "—";
  const vakTitle = snapshot.vakProfile?.dominant
    ? VAK_TITLES[snapshot.vakProfile.dominant] || "—"
    : "—";
  const immersionFull = generatedBPS?.immersionScript || "";
  const displayName = snapshot.userName || userName || "—";

  return (
    <div className="font-sans">
      <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <Sparkles size={14} /> Apex Profile / 나의 프로파일
      </p>
      <div className="flex flex-col gap-3">
        <ResultRow label="이름" value={displayName} highlight />
        <ResultRow label="BPS 비전" value={`"${generatedBPS?.title || "—"}"`} highlight />
        <ResultRow
          label="집중 영역"
          value={LEVEL_NAMES[snapshot.selectedNeedLevel] || "—"}
        />
        <ResultRow label="기질 유형" value={tciType} />
        <ResultRow label="감각 채널" value={vakTitle} />
      </div>

      {immersionFull && (
        <>
          <div className="w-full h-px bg-white/5 my-5" />
          <p className="text-[9px] text-slate-600 font-bold tracking-widest uppercase mb-2">
            몰입 시나리오
          </p>
          <p
            className="text-slate-400 text-xs leading-relaxed italic"
            style={{ wordBreak: "keep-all" }}
          >
            {immersionFull}
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
