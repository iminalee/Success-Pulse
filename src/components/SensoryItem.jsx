import React from "react";

const SensoryItem = ({ label, color, val }) => (
  <div
    className={`bg-[#1A202C]/40 p-5 rounded-[2rem] border-l-8 border-${
      color === "amber"
        ? "amber-600"
        : color === "emerald"
        ? "emerald-600"
        : "rose-600"
    } shadow-xl transition-all hover:bg-slate-900/60`}
  >
    <p
      className={`text-[10px] text-${
        color === "amber"
          ? "text-amber-500"
          : color === "emerald"
          ? "text-emerald-500"
          : "text-rose-500"
      } font-black uppercase mb-2 tracking-widest`}
    >
      {label}
    </p>
    <p className="text-[12px] text-slate-300 leading-relaxed font-medium">
      {val || "설정된 내용이 없습니다."}
    </p>
  </div>
);

export default SensoryItem;
