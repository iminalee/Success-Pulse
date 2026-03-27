import React, { useState, useRef, useEffect } from "react";

const NameInputScreen = ({ onComplete }) => {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onComplete(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center px-8">
      <style>{`
        @keyframes niIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ni-in { animation: niIn 0.45s ease-out forwards; }
        .ni-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(245,158,11,0.35);
          outline: none;
          width: 100%;
          color: #fcd34d;
          font-size: 1.4rem;
          font-weight: 800;
          text-align: center;
          padding: 8px 0;
          caret-color: #F59E0B;
        }
        .ni-input::placeholder { color: #1e293b; font-weight: 400; font-size: 1.1rem; }
      `}</style>

      <div className="ni-in w-full max-w-sm text-center">
        <p className="text-[9px] text-amber-500/50 font-black tracking-[0.55em] uppercase mb-8">
          마지막으로
        </p>

        <h2
          className="text-[1.5rem] font-black text-white leading-snug mb-2"
          style={{ wordBreak: "keep-all" }}
        >
          당신의 이름을
          <br />
          <span className="text-amber-400">알려주세요.</span>
        </h2>
        <p className="text-slate-600 text-xs mb-12" style={{ wordBreak: "keep-all" }}>
          계약서와 결과 카드에 사용됩니다.
        </p>

        <input
          ref={inputRef}
          className="ni-input mb-10"
          placeholder="이름 또는 닉네임"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={20}
        />

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          계약서 작성하기
        </button>
      </div>
    </div>
  );
};

export default NameInputScreen;
