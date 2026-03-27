import React, { useState } from "react";
import { ShieldCheck, PenTool } from "lucide-react";
import { supabase } from "../supabaseClient";
import showToast from "../utils/toast";

const ResetPasswordUI = () => {
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6)
      return showToast("비밀번호는 6자리 이상이어야 합니다.");
    setResetLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      showToast("업데이트 실패: " + error.message);
    } else {
      showToast("비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.");
      window.location.href = "/";
    }
    setResetLoading(false);
  };

  return (
    <div className="bg-[#1A202C] p-10 rounded-[3rem] border border-white/10 shadow-2xl max-w-sm mx-auto mt-20 animate-fadeIn">
      <div className="text-center mb-6">
        <ShieldCheck size={48} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
          Update <span className="text-amber-500">Identity Key</span>
        </h2>
        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
          새로운 비밀번호를 설정하세요
        </p>
      </div>

      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password (6+ characters)"
        className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500 mb-4 font-mono"
      />

      <button
        onClick={handleUpdatePassword}
        disabled={resetLoading}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
      >
        {resetLoading ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
        ) : (
          <>
            <PenTool size={14} /> Confirm New Key
          </>
        )}
      </button>
    </div>
  );
};

export default ResetPasswordUI;
