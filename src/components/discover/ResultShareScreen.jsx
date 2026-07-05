import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";

export const LEVEL_NAMES = {
  1: "건강과 활력", 2: "안전과 안정", 3: "사랑과 소속",
  4: "인정과 성취", 5: "나다움 실현",
};

export const VAK_TITLES = {
  V: "시각적 건축가", A: "청각적 작곡가", K: "감각적 조각가",
};

const TCI_TYPES = {
  ns: { high: "탐험가", low: "건축가" },
  ha: { high: "수호자", low: "개척자" },
  rd: { high: "연결자", low: "독행자" },
  p:  { high: "마라토너", low: "스프린터" },
};

export const getDominantType = (tci) => {
  const dims = Object.entries(TCI_TYPES).map(([k, v]) => ({
    score: tci[k], high: v.high, low: v.low,
  }));
  const top = dims.reduce((a, b) =>
    Math.abs(a.score - 50) >= Math.abs(b.score - 50) ? a : b
  );
  return top.score >= 50 ? top.high : top.low;
};

// ── 결과 카드 (html2canvas 캡처용) ────────────────────────
const ShareCard = React.forwardRef(({ userName, tciType, vakTitle, bpsTitle, immersionFull, ratio }, ref) => {
  const isStory = ratio === "9:16";
  const W = 540;
  const minH = isStory ? 960 : 540;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: `${W}px`,
        minHeight: `${minH}px`,
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 44px 72px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* 배경 글로우 */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "360px", height: "360px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* 상단 테두리 장식 */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px",
        background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
      }} />

      {/* 로고 */}
      <div style={{ textAlign: "center", marginBottom: isStory ? "48px" : "32px" }}>
        <p style={{
          fontSize: "10px", color: "rgba(245,158,11,0.5)",
          fontWeight: 900, letterSpacing: "0.5em",
          textTransform: "uppercase", marginBottom: "6px",
        }}>
          THE PULSE
        </p>
        <div style={{ width: "32px", height: "1px", background: "rgba(245,158,11,0.4)", margin: "0 auto" }} />
      </div>

      {/* 이름 */}
      <p style={{
        fontSize: isStory ? "36px" : "28px",
        fontWeight: 900, color: "#FFFFFF",
        textAlign: "center",
        marginBottom: isStory ? "8px" : "6px",
        letterSpacing: "-0.02em",
      }}>
        {userName}
      </p>

      {/* 기질 & 감각 */}
      <div style={{
        display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap",
        marginBottom: isStory ? "40px" : "28px",
      }}>
        {[tciType, vakTitle].map((tag) => (
          <span key={tag} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 800, color: "rgba(245,158,11,0.8)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "999px", padding: "4px 12px",
            letterSpacing: "0.03em",
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* 구분선 */}
      <div style={{
        width: "48px", height: "1px",
        background: "rgba(255,255,255,0.08)",
        marginBottom: isStory ? "36px" : "24px",
      }} />

      {/* BPS 제목 */}
      <p style={{
        fontSize: "10px", color: "rgba(245,158,11,0.45)",
        fontWeight: 700, letterSpacing: "0.4em",
        textTransform: "uppercase",
        marginBottom: "10px", textAlign: "center",
      }}>
        Apex BPS
      </p>
      <p style={{
        fontSize: isStory ? "26px" : "20px",
        fontWeight: 900, color: "#FCD34D",
        textAlign: "center",
        marginBottom: isStory ? "32px" : "20px",
        letterSpacing: "-0.02em",
        lineHeight: 1.4,
        maxWidth: "420px",
      }}>
        "{bpsTitle}"
      </p>

      {/* 몰입 시나리오 */}
      {immersionFull && (
        <p style={{
          fontSize: "15px", color: "rgba(148,163,184,0.75)",
          textAlign: "center", lineHeight: 2,
          maxWidth: "420px",
          marginBottom: isStory ? "48px" : "32px",
          wordBreak: "keep-all",
        }}>
          {immersionFull}
        </p>
      )}

      {/* 하단 URL */}
      <div style={{
        position: "absolute",
        bottom: "28px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "10px", color: "rgba(100,116,139,0.7)",
          fontWeight: 600, letterSpacing: "0.08em",
        }}>
          success-pulse.vercel.app
        </p>
      </div>

      {/* 하단 테두리 장식 */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "3px",
        background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
      }} />
    </div>
  );
});
ShareCard.displayName = "ShareCard";

// ── 메인 컴포넌트 ─────────────────────────────────────────
const ResultShareScreen = ({
  journeyData,
  isLoggedIn,
  onComplete,
}) => {
  const { userName, tciQuickProfile, vakProfile, generatedBPS, selectedNeedLevel } = journeyData;

  const tciType  = getDominantType(tciQuickProfile ?? { ns:50, ha:50, rd:50, p:50 });
  const vakTitle = VAK_TITLES[vakProfile?.dominant ?? "V"];
  const immersionFull = generatedBPS?.immersionScript ?? "";

  const card916Ref = useRef(null);
  const card11Ref  = useRef(null);

  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);

  // ── PNG 다운로드 ────────────────────────────────────────
  const handleDownload = async (ratio) => {
    const ref = ratio === "9:16" ? card916Ref : card11Ref;
    if (!ref.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0F172A",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `apex-bps-${ratio.replace(":", "x")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloaded(true);
    } catch (e) {
      console.error("Download error:", e);
    } finally {
      setDownloading(false);
    }
  };

  const shareProps = { userName, tciType, vakTitle, bpsTitle: generatedBPS?.title ?? "", immersionFull };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      <style>{`
        @keyframes rsIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rs-in { animation: rsIn 0.5s ease-out forwards; }
      `}</style>

      {/* 오프스크린 캡처 카드 2종 */}
      <ShareCard ref={card916Ref} ratio="9:16" {...shareProps} />
      <ShareCard ref={card11Ref}  ratio="1:1"  {...shareProps} />

      <div className="rs-in flex flex-col h-full px-5 pt-10 pb-8 overflow-y-auto">
        {/* 헤더 */}
        <div className="text-center mb-7">
          <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-2">
            여정 완료
          </p>
          <h2 className="text-xl font-black text-white mb-1" style={{ wordBreak: "keep-all" }}>
            당신의 Apex BPS가
          </h2>
          <h2 className="text-xl font-black text-amber-400" style={{ wordBreak: "keep-all" }}>
            완성되었습니다.
          </h2>
        </div>

        {/* 결과 요약 카드 */}
        <div className="border border-amber-500/15 rounded-3xl bg-slate-900/50 px-5 py-5 mb-6">
          <p className="text-[9px] text-amber-500/40 font-black tracking-widest uppercase mb-4">
            나의 프로파일
          </p>
          <div className="flex flex-col gap-3">
            <ResultRow label="이름" value={userName} highlight />
            <ResultRow label="BPS 비전" value={`"${generatedBPS?.title ?? "—"}"`} highlight />
            <ResultRow label="집중 영역" value={LEVEL_NAMES[selectedNeedLevel] ?? "—"} />
            <ResultRow label="기질 유형" value={tciType} />
            <ResultRow label="감각 채널" value={vakTitle} />
          </div>

          {immersionFull && (
            <>
              <div className="w-full h-px bg-white/5 my-4" />
              <p className="text-[9px] text-slate-600 font-bold tracking-widest uppercase mb-2">
                몰입 시나리오
              </p>
              <p className="text-slate-500 text-xs leading-relaxed" style={{ wordBreak: "keep-all" }}>
                {immersionFull}
              </p>
            </>
          )}
        </div>

        {/* ── 결과 이미지 저장 ── */}
        <div className="border border-white/5 rounded-2xl px-4 py-4 mb-4">
          <p className="text-[9px] text-slate-600 font-black tracking-widest uppercase mb-3">
            결과 이미지 저장
          </p>
          <div className="flex gap-3">
            <DlBtn
              label="9:16 스토리"
              sub="인스타그램용"
              loading={downloading}
              done={downloaded}
              onClick={() => handleDownload("9:16")}
            />
            <DlBtn
              label="1:1 정사각형"
              sub="피드/공유용"
              loading={downloading}
              done={downloaded}
              onClick={() => handleDownload("1:1")}
            />
          </div>
        </div>

        {/* ── Act 2 시작 버튼 ── */}
        <button
          onClick={() => onComplete(journeyData)}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] mt-1"
        >
          Act 2 시작하기 →
        </button>
      </div>
    </div>
  );
};

// ── 서브 컴포넌트들 ───────────────────────────────────────
const ResultRow = ({ label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase w-14 shrink-0 pt-0.5">
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

const DlBtn = ({ label, sub, loading, done, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex-1 border border-white/8 hover:border-amber-500/30 bg-slate-900 hover:bg-slate-800 active:scale-[0.97] rounded-xl px-3 py-3 text-center transition-all disabled:opacity-50"
  >
    <p className="text-amber-400 text-xs font-black">{label}</p>
    <p className="text-slate-600 text-[10px] mt-0.5">{loading ? "생성 중..." : done ? "✓ 저장됨" : sub}</p>
  </button>
);

export default ResultShareScreen;
