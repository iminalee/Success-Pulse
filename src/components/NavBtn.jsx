import React from "react";

const NavBtn = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
      active
        ? "text-amber-500 scale-110 drop-shadow-lg"
        : "text-slate-600 hover:text-slate-400"
    }`}
  >
    {icon}
    <span className="text-[9px] font-black tracking-widest uppercase">
      {label}
    </span>
  </button>
);

export default NavBtn;
