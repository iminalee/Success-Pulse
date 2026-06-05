import React from "react";

const NavBtn = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex min-w-[46px] md:min-w-[54px] flex-col items-center gap-1 transition-all duration-300 ${
      active
        ? "text-amber-500 scale-105 drop-shadow-lg"
        : "text-slate-600 hover:text-slate-400"
    }`}
  >
    {icon}
    <span className="text-[7px] md:text-[8px] font-black tracking-wider uppercase">
      {label}
    </span>
  </button>
);

export default NavBtn;
