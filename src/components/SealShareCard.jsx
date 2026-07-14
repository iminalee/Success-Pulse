import React from "react";

/**
 * SealShareCard — 오늘의 Seal(봉인) 공유용 1:1 캡처 카드.
 * thePulse의 SealShareOverlay 개념을 Success-Pulse 컨벤션(html2canvas 오프스크린 캡처,
 * ResultShareScreen과 동일 방식)에 맞춰 이식.
 *
 * 화면 밖(left:-9999px)에 고정 크기로 렌더 → html2canvas로 캡처해 이미지 공유/저장.
 */
const SealShareCard = React.forwardRef(
  ({ userName, currency = "₩", entries = [], total = 0, streak = 0, dateStr, weekday }, ref) => {
    const W = 540;
    const fmt = (n) => Math.round(n || 0).toLocaleString();

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: `${W}px`,
          height: `${W}px`,
          background: "linear-gradient(150deg, #0F172A 0%, #1A1400 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "44px 46px",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* 상단 테두리 장식 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
          }}
        />

        {/* 헤더: 로고 + 날짜 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "0.28em",
              color: "#F0C060",
            }}
          >
            THE PULSE
          </span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            {dateStr}
            {weekday ? ` · ${weekday}` : ""}
          </span>
        </div>

        <div style={{ height: "1px", background: "rgba(245,158,11,0.18)", margin: "18px 0" }} />

        {/* 사용자 + 문구 */}
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
          {userName ? `${userName}의 하루 봉인` : "오늘의 Seal"} 🔒
        </p>

        {/* 실천 기록 리스트 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "9px",
            marginTop: "20px",
            overflow: "hidden",
          }}
        >
          {entries.slice(0, 6).map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  flex: 1,
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {e.desc || "실천"}
              </span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F0C060", flexShrink: 0 }}>
                +{currency}
                {fmt(e.amount)}
              </span>
            </div>
          ))}
          {entries.length > 6 && (
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
              외 {entries.length - 6}건
            </span>
          )}
        </div>

        <div style={{ height: "1px", background: "rgba(245,158,11,0.18)", margin: "16px 0" }} />

        {/* 합계 + 스트릭 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>오늘 적립</span>
            {streak > 0 && (
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#F59E0B" }}>
                🔥 {streak}일 연속
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: "30px",
              fontWeight: 900,
              color: "#F0C060",
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}
          >
            +{currency}
            {fmt(total)}
          </span>
        </div>

        {/* SEALED 스탬프 */}
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "2px",
              color: "rgba(245,158,11,0.55)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "5px",
              padding: "3px 9px",
            }}
          >
            🔒 SEALED
          </span>
        </div>
      </div>
    );
  }
);

export default SealShareCard;
