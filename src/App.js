import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  Sparkles, Plus, Activity, Brain, Book, BookOpen, Edit3, Save, Trash2, X, Home,
  BarChart2, CheckCircle, RotateCcw, Trash, Trophy, Beaker, User, Settings,
  CheckSquare, Square, ListPlus, Wand2, ClipboardList, Coins, Flag, Zap,
  PenTool, ShieldCheck, Info, TrendingUp, Star, LogIn, Lock // [추가됨] Lock 아이콘
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 1. Supabase 연결 (세션 유지 설정 포함)
const supabaseUrl = "https://ihhfgoqpsubjdqlytzvs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaGZnb3Fwc3ViamRxbHl0enZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDYxMDEsImV4cCI6MjA4MjY4MjEwMX0.1ZtWo4LiiOOJIFyKyvhPNXFwrvUgGeMTKTNp39kz61M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 새로고침/재접속 시 로그인 유지
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// 2. 유틸리티
const AutoTextarea = ({ value, onChange, placeholder, className, disabled = false }) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${className} overflow-hidden resize-none transition-[height] duration-200 font-sans`}
      rows={1}
    />
  );
};

const NavBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? "text-amber-500 scale-110 drop-shadow-lg" : "text-slate-600 hover:text-slate-400"}`}>
    {icon}
    <span className="text-[9px] font-black tracking-widest uppercase">{label}</span>
  </button>
);

const SensoryItem = ({ label, color, val }) => (
  <div className={`bg-[#1A202C]/40 p-5 rounded-[2rem] border-l-8 border-${color === "amber" ? "amber-600" : color === "emerald" ? "emerald-600" : "rose-600"} shadow-xl hover:bg-slate-900/60 transition-all`}>
    <p className={`text-[10px] text-${color === "amber" ? "amber-500" : color === "emerald" ? "emerald-500" : "rose-500"} font-black uppercase mb-2 tracking-widest`}>{label}</p>
    <p className="text-[12px] text-slate-300 leading-relaxed font-medium">{val || "설정된 내용이 없습니다."}</p>
  </div>
);

// 3. 메인 앱
const App = () => {
  // [변경] OTP 관련 상태 삭제하고 Password, SignUpMode 추가
  const [password, setPassword] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [duration, setDuration] = useState(1);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [currency, setCurrency] = useState("₩");
  const [userName, setUserName] = useState("");
  const [targetDate, setTargetDate] = useState("2026-12-31");
  const [annualIncome, setAnnualIncome] = useState(0);
  const [currentAsset, setCurrentAsset] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [signature, setSignature] = useState("");
  const [signedDate, setSignedDate] = useState(null);
  const [bpsTraits, setBpsTraits] = useState(["", "", "", "", ""]);

  const initialLvAsset = 0;
  // [유지] 최신 아이콘 적용 상태 (5:명상, 4:트로피, 2:방패)
  const [visions, setVisions] = useState({
    6: { title: "Apex Identity 확립", emoji: "👑", immersionScript: "", progressAsset: initialLvAsset, events: [] },
    5: { title: "", emoji: "🧘", immersionScript: "", progressAsset: initialLvAsset, events: [] },
    4: { title: "", emoji: "🏆", immersionScript: "", progressAsset: initialLvAsset, events: [] },
    3: { title: "", emoji: "🤝", immersionScript: "", progressAsset: 0, events: [] },
    2: { title: "", emoji: "🛡️", immersionScript: "", progressAsset: 0, events: [] },
    1: { title: "", emoji: "🏃", immersionScript: "", progressAsset: initialLvAsset, events: [] },
  });

  const [vakProfile, setVakProfile] = useState({ order: "V-A-K", vPercent: 50, aPercent: 30, kPercent: 20 });
  const [tciProfile, setTciProfile] = useState({ ns: { score: 50 }, ha: { score: 50 }, rd: { score: 50 }, p: { score: 50 }, sd: { score: 50 }, c: { score: 50 }, st: { score: 50 }, sd_c: { score: 100 } });
  const [archivedVisions, setArchivedVisions] = useState([]);
  const [trashVisions, setTrashVisions] = useState([]);
  const [activeLevel, setActiveLevel] = useState(5);
  const [currentView, setCurrentView] = useState("hub");
  const [chartData, setChartData] = useState([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeSensory, setActiveSensory] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fNum = (n) => Math.floor(n).toLocaleString();
  const mbGoalAmount = annualIncome * 2;
  const mbBalance = mbGoalAmount * 4;
  const livingAllowance = mbBalance * 0.25;
  const valueEventAmount = mbGoalAmount / 500;
  const levelMap = { 1: "건강", 2: "안전", 3: "소속과 사랑", 4: "존중감", 5: "자아실현" };

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) { setUser(session.user); fetchData(session.user.id); }
    };
    initSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); fetchData(session.user.id); } else { setUser(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (userId) => {
    setLoading(true);
    const { data } = await supabase.from("pulse_data").select("*").eq("id", userId).single();
    if (data) {
      if (data.user_name) setUserName(data.user_name);
      if (data.currency) setCurrency(data.currency);
      if (data.annual_income) setAnnualIncome(data.annual_income);
      if (data.target_date) setTargetDate(data.target_date);
      if (data.ledger) setLedger(data.ledger);
      if (data.visions) setVisions(data.visions);
      if (data.bps_traits) setBpsTraits(data.bps_traits);
      if (data.vak_profile) setVakProfile(data.vak_profile);
      if (data.tci_profile) setTciProfile(data.tci_profile);
      if (data.archived_visions) setArchivedVisions(data.archived_visions);
      if (data.trash_visions) setTrashVisions(data.trash_visions);
      if (data.signature) setSignature(data.signature);
      if (data.signed_date) setSignedDate(data.signed_date);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(async () => {
      const updates = { id: user.id, user_name: userName, currency, annual_income: annualIncome, target_date: targetDate, ledger, visions, bps_traits: bpsTraits, vak_profile: vakProfile, tci_profile: tciProfile, archived_visions: archivedVisions, trash_visions: trashVisions, signature, signed_date: signedDate, updated_at: new Date() };
      await supabase.from("pulse_data").upsert(updates);
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, userName, currency, annualIncome, targetDate, ledger, visions, bpsTraits, vakProfile, tciProfile, archivedVisions, trashVisions, signature, signedDate]);

  const updateVision = (level, data) => setVisions((prev) => ({ ...prev, [level]: { ...prev[level], ...data } }));
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.className = "fixed top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-8 py-3 rounded-full font-black shadow-2xl z-[5000] animate-bounce text-xs";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const handleDepositSubmit = (eventName) => {
    const progressRate = mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0;
    let bonus = 1;
    if (progressRate >= 60) bonus += 0.1;
    if (progressRate >= 70) bonus += 0.1;
    if (progressRate >= 80) bonus += 0.1;
    if (progressRate >= 90) bonus += 0.1;
    const finalAmount = valueEventAmount * bonus * duration;
    setLedger((prev) => [...prev, { date: new Date(), amount: finalAmount, desc: `${eventName} (${duration}h)` }]);
    updateVision(activeLevel, { progressAsset: visions[activeLevel].progressAsset + finalAmount });
    showToast(`${duration}시간 수행! ${currency}${fNum(finalAmount)} 예치 완료`);
    setDuration(1);
  };

  // [변경] 일반 이메일/비번 로그인 함수
  const handleAuth = async () => {
    if (!email || !password) return alert("이메일과 비밀번호를 모두 입력해주세요.");
    setLoading(true);
    
    if (isSignUpMode) {
      // 회원가입 시도
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        alert("가입 실패: " + error.message);
      } else {
        alert("회원가입 성공! 자동 로그인됩니다.");
        // Supabase 설정에서 Confirm Email을 껐다면 자동 로그인 됨
      }
    } else {
      // 로그인 시도
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert("로그인 실패: 이메일이나 비밀번호를 확인하세요.");
      }
    }
    setLoading(false);
  };

  const handleFactoryReset = async () => {
    if (window.confirm("초기화하시겠습니까? DB의 모든 데이터가 삭제됩니다.")) {
      if (user) await supabase.from("pulse_data").delete().eq("id", user.id);
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 탈퇴하시겠습니까?")) {
      await supabase.from("pulse_data").delete().eq("id", user.id);
      await supabase.rpc("delete_user");
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  useEffect(() => {
    const totalDeposits = ledger.reduce((acc, item) => acc + item.amount, 0);
    setCurrentAsset(annualIncome + totalDeposits);
  }, [annualIncome, ledger]);

  useEffect(() => {
    const scores = [
      { label: "V", val: Number(vakProfile.vPercent) },
      { label: "A", val: Number(vakProfile.aPercent) },
      { label: "K", val: Number(vakProfile.kPercent) },
    ];
    const sortedOrder = scores
      .sort((a, b) => b.val - a.val)
      .map((item) => item.label)
      .join("-");
    if (sortedOrder !== vakProfile.order)
      setVakProfile((prev) => ({ ...prev, order: sortedOrder }));
  }, [vakProfile.vPercent, vakProfile.aPercent, vakProfile.kPercent]);

  useEffect(() => {
    if (chartRef.current && (currentView === "hub" || currentView === "analysis")) {
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.map((_, i) => i),
          datasets: [{
              data: chartData,
              borderColor: "#f59e0b",
              borderWidth: 4,
              pointRadius: 0,
              tension: 0.4,
              fill: true,
              backgroundColor: (c) => {
                const g = c.chart.ctx.createLinearGradient(0, 0, 0, 400);
                g.addColorStop(0, "rgba(245, 158, 11, 0.2)");
                g.addColorStop(1, "rgba(245, 158, 11, 0)");
                return g;
              },
            }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false, suggestedMin: annualIncome * 0.85 },
          },
        },
      });
    }
  }, [chartData, currentView, annualIncome]);

  const generateImmersionScript = async () => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    if (!visions[activeLevel].title) return alert("비전 제목이 필요합니다.");
    setAiLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "최고의 NLP 전문가로서 생생한 미래 기억을 심어주는 역할을 하라." },
            { role: "user", content: `목표: '${visions[activeLevel].title}'. V:${vakProfile.vPercent}%, A:${vakProfile.aPercent}%, K:${vakProfile.kPercent}% 비율로 몰입 시나리오를 3문장 작성해줘.` }
          ],
          temperature: 0.7
        })
      });
      const data = await response.json();
      if (data.choices) {
        updateVision(activeLevel, { immersionScript: data.choices[0].message.content });
        alert("✨ 시나리오 생성 완료!");
      }
    } catch (e) { alert("API 오류: " + e.message); }
    setAiLoading(false);
  };

  const renderPhilosophy = () => (
    <div className="flex-grow w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar pb-24 px-6 animate-fadeIn font-sans text-left">
      <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8 mt-4">
        <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <BookOpen size={36} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">System Manifesto</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Philosophy & Operational Protocol</p>
        </div>
      </div>
      <div className="space-y-20">
        <section>
          <h3 className="text-xl font-black text-cyan-500 uppercase tracking-widest mb-8 flex items-center gap-2"><Beaker size={18} /> Scientific Foundation</h3>
          <div className="bg-slate-900/40 p-8 md:p-10 rounded-[3rem] border border-cyan-500/10 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
            <p className="text-base text-slate-300 leading-[1.8] font-medium mb-8">The Pulse는 행동심리학, 뇌과학, 긍정심리학의 정수를 통합한 정체성 설계 시스템입니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-400">
              <div><h5 className="text-cyan-400 font-bold mb-2">01. Mental Bank</h5><p>무의식이 경제적 논리에 따라 성공을 당연한 결과로 받아들이게 설계되었습니다.</p></div>
              <div><h5 className="text-cyan-400 font-bold mb-2">02. VAK Model</h5><p>다감각적 정보를 통해 미래의 성취를 '이미 일어난 기억'으로 각인시킵니다.</p></div>
              <div><h5 className="text-cyan-400 font-bold mb-2">03. BPS Fusion</h5><p>유전적 기질(TCI) 위에 최적화된 미래 자아 값을 입력하여 정체성을 업그레이드합니다.</p></div>
              <div><h5 className="text-cyan-400 font-bold mb-2">04. Neuropsychology</h5><p>반복된 기록과 실행은 전두엽을 물리적으로 재구조화합니다.</p></div>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-black text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2"><Sparkles size={18} /> I. The Worldview</h3>
          <div className="mb-10 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 md:p-12 rounded-[3rem] border border-emerald-500/20 backdrop-blur-md text-slate-300 space-y-6">
            <p className="text-2xl text-slate-100 font-black italic tracking-tight">"미래는 찾아가는 것이 아니라, 지금 이 순간으로 초대하는 것입니다."</p>
            <p>무한한 평행세계 속의 Apex BP가 당신을 유일한 현실 대리인인 The Vessel로 선택했습니다. 이 계약을 통해 당신의 몸은 두 자아가 공유하는 '공동 점유 상태(Occupancy)'가 됩니다.</p>
          </div>
        </section>
        <section className="mt-20 pt-12 border-t border-white/5 w-full">
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2"><BookOpen size={18} /> Glossary | 용어집</h3>
          <div className="flex flex-col gap-3 w-full">
            <div className="p-4 bg-slate-900/20 rounded-2xl border border-white/5 flex flex-wrap items-baseline gap-x-3"><span className="text-white font-bold text-base min-w-fit">Apex BP :</span><span className="text-slate-400 font-light text-sm">평행세계에서 모든 목표를 이룬 당신의 완성된 자아.</span></div>
            <div className="p-4 bg-slate-900/20 rounded-2xl border border-white/5 flex flex-wrap items-baseline gap-x-3"><span className="text-white font-bold text-base min-w-fit">The Vessel :</span><span className="text-slate-400 font-light text-sm">마스터 자아의 의식을 현실에서 구현해내는 당신의 현재 육체.</span></div>
            <div className="p-4 bg-slate-900/20 rounded-2xl border border-white/5 flex flex-wrap items-baseline gap-x-3"><span className="text-white font-bold text-base min-w-fit">Mental Bank :</span><span className="text-slate-400 font-light text-sm">행동의 가치가 복리로 적립되는 당신의 무의식 자산 계좌.</span></div>
            <div className="p-4 bg-slate-900/20 rounded-2xl border border-white/5 flex flex-wrap items-baseline gap-x-3"><span className="text-white font-bold text-base min-w-fit">Magnitude :</span><span className="text-slate-400 font-light text-sm">현실을 변화시킨 에너지의 총량. 100% 도달 시 합일이 일어납니다.</span></div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderContract = () => {
    const isLocked = !!signedDate;
    const handleExecuteContract = () => {
      if (!signature.trim()) return showToast("서명란이 비어있습니다.");
      if (signature.trim() !== userName.trim()) return showToast(`서명 불일치: '${userName}'과 동일해야 합니다.`);
      if (window.confirm(`[${userName}]님의 이름으로 서약을 체결하시겠습니까?`)) { setSignedDate(new Date()); showToast("계약이 체결되었습니다."); }
    };
    return (
      <div className="flex-grow w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3"><PenTool className={isLocked ? "text-emerald-500" : "text-amber-500"} size={32} /><h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Manifestation Contract</h2></div>
        </div>
        <div className={`bg-[#0A0F1E] border-2 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl ${isLocked ? "border-emerald-500/30" : "border-white/10"}`}>
          <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none"><ShieldCheck size={280} className="text-white" /></div>
          <div className="space-y-8 md:space-y-12 text-slate-300 leading-[1.9] md:leading-[2.2] text-base md:text-lg font-normal tracking-tight text-justify px-2 md:px-10 relative z-10">
            <p className="border-l-2 border-amber-500/40 pl-6 md:pl-10 font-sans">
              무한한 평행세계 속에서 모든 성취를 완료한 마스터 자아 <span className="text-white font-bold px-2 italic text-xl">Apex BP {userName}</span>는, 자신의 유일한 현실 대리인인 <span className="text-amber-400 font-bold underline underline-offset-4">{userName} ver.0</span>를 최고의 자아로 현현시키기 위한 <span className="text-white font-black text-shadow-sm">‘존재적 상장(Existential IPO)’</span>을 승인하였다.
            </p>
            <p className="border-l-2 border-slate-700 pl-6 md:pl-10">
              이에 <span className="text-slate-100 font-bold">{userName} ver.0</span>는 <input type="date" value={targetDate} disabled={isLocked} onChange={(e) => setTargetDate(e.target.value)} className="bg-slate-900 text-amber-500 border-white/10 border px-2 rounded-lg font-bold" /> 까지 5단계의 관문을 돌파하여 확정된 미래를 현실로 소환한다. 이 경이로운 융합의 대가로, Apex BP는 무의식의 저수지인 <span className="text-white font-bold ml-1">Mental Bank</span> 잔액 ({currency}{fNum(mbBalance)})의 <span className="text-amber-500 font-black mx-1 text-xl">25%</span>에 해당하는 활동 동력 <span className="text-white font-black mx-2 bg-white/5 px-3 py-1 rounded-xl border border-white/10 shadow-lg">{currency}{fNum(livingAllowance)}</span>을 현실 자아에게 즉시 수혈한다.
            </p>
            <p className="border-l-2 border-slate-700 pl-6 md:pl-10">
              실행의 근육을 빌려 가치를 창출할 때마다, 시스템은 이를 <span className="text-emerald-400 font-bold mx-1">‘신경학적 각인(Neuro-Imprinting)’</span>으로 인정한다. 매 시간의 몰입이 증명될 때마다 시간당 <span className="text-emerald-400 font-black px-3 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/20 mx-2 shadow-inner">{currency}{fNum(valueEventAmount)}</span>의 Value Award를 존재적 매출로서 Mental Bank에 예치하며 동기화를 가속한다.
            </p>
            <p className="border-l-2 border-rose-500/50 pl-6 md:pl-10 bg-rose-500/5 py-6 rounded-r-3xl font-sans italic">
              단, <span className="text-rose-400 font-black drop-shadow-sm">3일 이상 의식의 파동(활동)이 멈출 경우</span>, Apex BP는 본 그릇(Vessel)과의 동기화를 해제하고, 다른 평행 세계에서 깨어있는 <span className="text-white font-bold"> {userName} ver.N</span>을 찾아 새로운 현신을 선택할 전적인 권리를 유지한다.
            </p>
          </div>
          <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex flex-col gap-4">
              <input value={signature} onChange={(e) => setSignature(e.target.value)} disabled={isLocked} placeholder="Sign Here" className="text-3xl bg-transparent border-b-2 font-serif italic text-white outline-none w-64" />
              {!isLocked && <button onClick={handleExecuteContract} className="bg-amber-600 hover:bg-amber-500 px-8 py-3 rounded-xl font-black text-xs uppercase text-white shadow-lg transition-all active:scale-95">Execute</button>}
            </div>
            <div className="text-right text-amber-800/40 font-serif italic text-4xl select-none">BP {userName} Authorized</div>
          </div>
        </div>
      </div>
    );
  };

  const renderLab = () => {
    const missionMap = { 
      1: "생존의 기초. 신체적 활력과 생물학적 균형을 유지하여 변화를 위한 엔진을 가동합니다.", 
      2: "위협으로부터의 보호. 재정적 자립과 안전망을 구축하여 심리적 평온과 기반을 확보합니다.", 
      3: "사회적 연결. 건강한 관계 속에서 소속감과 사랑을 주고받으며 정서적 지지대를 구축합니다.", 
      4: "사회적 성취와 자부심. 전문성을 인정받고 스스로 당당한 사회적 자아를 확립하여 가치를 증명합니다.", 
      5: "존재의 완성. 외부 자극에 흔들리지 않는 평온을 얻고, 타고난 잠재력을 완전히 꽃피우는 최종 단계입니다." 
    };
    const greenGroup = ["ns", "ha", "rd", "p"];
    const sdCValue = tciProfile.sd_c?.score ?? Number(tciProfile.sd.score) + Number(tciProfile.c.score);
    
    return (
      <div className="flex-grow w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3"><Brain className="text-emerald-500" size={32} /><h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">My Lab</h2></div>
          <button onClick={handleFactoryReset} className="text-xs font-bold text-slate-600 hover:text-rose-500 border border-slate-700/50 px-3 py-2 rounded-lg transition-all">Reset System</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#2D3748]/30 p-10 rounded-[3rem] border border-white/5 shadow-xl border-l-4 border-amber-500 flex flex-col md:flex-row items-center gap-8">
              <div className="bg-amber-500/10 p-6 rounded-full border border-amber-500/20"><User size={32} className="text-amber-500" /></div>
              <div className="flex-grow w-full">
                {user ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                    <p className="text-emerald-500 font-black mb-2">🎉 Identity Confirmed!</p>
                    <p className="text-white text-xl font-bold mb-4">{userName} <span className="text-slate-500 text-xs">({user.email})</span></p>
                    <button onClick={() => supabase.auth.signOut()} className="text-[10px] text-slate-500 underline decoration-slate-700">로그아웃</button>
                    <span className="mx-2 text-slate-800">|</span>
                    <button onClick={handleDeleteAccount} className="text-[10px] text-rose-500/60 underline decoration-rose-900/30">회원 탈퇴</button>
                  </div>
                ) : (
                  // [변경] 비밀번호 기반 로그인/회원가입 UI
                  <div className="flex flex-col gap-3">
                    <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="닉네임 (Name)" className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 (ID)" className="bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none" />
                    <div className="relative">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 (Password)" className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none" />
                        <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                    
                    <button onClick={handleAuth} disabled={loading} className={`w-full text-white font-bold py-4 rounded-2xl transition-all ${isSignUpMode ? "bg-emerald-600 hover:bg-emerald-500" : "bg-blue-600 hover:bg-blue-500"}`}>
                      {loading ? "처리 중..." : (isSignUpMode ? "회원가입 (Sign Up)" : "로그인 (Log In)")}
                    </button>
                    
                    <div className="flex justify-center gap-2 mt-2">
                        <span className="text-slate-500 text-xs">{isSignUpMode ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}</span>
                        <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-amber-500 text-xs font-bold underline">
                            {isSignUpMode ? "로그인하기" : "회원가입하기"}
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#2D3748]/40 p-10 rounded-[3.5rem] border border-white/5 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
                <div className="space-y-1">
                  <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">Goal Architect</p>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] font-bold text-amber-500 italic bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 inline-block w-fit">{activeLevel}단계: {levelMap[activeLevel]}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-1 mt-1 max-w-md">{missionMap[activeLevel]}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">{[1, 2, 3, 4, 5].map((lv) => (<button key={lv} onClick={() => setActiveLevel(lv)} className={`w-11 h-11 rounded-2xl font-black text-sm transition-all ${activeLevel === lv ? "bg-amber-600 text-white shadow-lg scale-110" : "bg-slate-900 text-slate-600 hover:bg-slate-800"}`}>{lv}</button>))}</div>
              </div>
              <div className="flex gap-4 mb-6"><input value={visions[activeLevel].emoji} onChange={(e) => updateVision(activeLevel, { emoji: e.target.value })} className="w-20 bg-slate-900 border border-white/5 rounded-3xl p-3 text-3xl text-center outline-none" /><input value={visions[activeLevel].title} onChange={(e) => updateVision(activeLevel, { title: e.target.value })} className="flex-1 bg-slate-900 border border-white/5 rounded-3xl p-4 text-white font-black outline-none" /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{["v", "a", "k"].map((type) => (<div key={type} className="bg-slate-950/40 p-5 rounded-[2rem] border border-white/5"><p className="text-[9px] font-black uppercase text-amber-500 mb-2">{type.toUpperCase()}</p><AutoTextarea value={visions[activeLevel][type]} onChange={(e) => updateVision(activeLevel, { [type]: e.target.value })} placeholder="묘사..." className="w-full bg-transparent text-xs text-slate-300 outline-none" /></div>))}</div>
              <div className="mt-8 flex justify-between items-center"><p className="text-[10px] font-black text-slate-500 uppercase">Action Checklist</p><button onClick={() => updateVision(activeLevel, { events: [...visions[activeLevel].events, { id: Date.now().toString(), name: "신규 항목", checked: false }] })} className="bg-emerald-600 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase">Add Event</button></div>
              <div className="space-y-3 mt-4">{visions[activeLevel].events.map((ev) => (<div key={ev.id} className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5"><CheckSquare size={18} className="text-slate-600" /><input value={ev.name} onChange={(e) => updateVision(activeLevel, { events: visions[activeLevel].events.map(p => p.id === ev.id ? { ...p, name: e.target.value } : p) })} className="bg-transparent text-slate-200 outline-none flex-grow" /><button onClick={() => updateVision(activeLevel, { events: visions[activeLevel].events.filter(p => p.id !== ev.id) })} className="text-rose-500/20 hover:text-rose-500"><Trash2 size={18} /></button></div>))}</div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#2D3748]/40 p-8 rounded-[3rem] border border-white/5 shadow-xl text-center">
              <p className="text-[12px] font-black text-amber-500 uppercase tracking-widest mb-6">Financial Core</p>
              <div className="flex gap-3 mb-6"><div className="w-16"><label className="text-[8px] text-slate-500 block">Unit</label><input value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-900 p-3 rounded-xl text-center text-white" /></div><div className="flex-grow"><label className="text-[8px] text-slate-500 block text-left">Annual Income</label><input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} className="w-full bg-slate-900 p-3 rounded-xl text-right text-white font-bold" /></div></div>
              <div className="space-y-3 text-sm font-black text-slate-300"><div className="flex justify-between p-4 bg-slate-900/60 rounded-2xl"><span>MB 목표액</span><span>{currency}{fNum(mbGoalAmount)}</span></div><div className="flex justify-between p-5 bg-amber-500/10 rounded-[1.5rem] border border-amber-500/30 text-amber-500 uppercase tracking-widest"><span>Value Award</span><span>{currency}{fNum(valueEventAmount)}</span></div></div>
            </div>
            <div className="bg-[#2D3748]/40 p-8 rounded-[3rem] border border-white/5 shadow-xl">
              <div className="mb-6 flex items-center gap-2"><ClipboardList size={12} className="text-rose-500" /><p className="text-[12px] font-black text-rose-500 uppercase tracking-widest">TCI Intelligence</p></div>
              <div className="flex w-full mb-2"><div className="w-1/4"></div><div className="w-3/4 relative h-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">백분위 그래프</div></div>
              <div className="relative z-10 flex flex-col gap-4">
                {["NS", "HA", "RD", "P", "SD", "C", "ST"].map((key) => {
                  const score = Number(tciProfile[key.toLowerCase()].score);
                  const isPositive = score >= 50;
                  const barWidth = Math.abs(score - 50);
                  const barColor = greenGroup.includes(key.toLowerCase()) ? "bg-emerald-500" : "bg-amber-500";
                  return (
                    <div key={key} className="flex items-center h-10 w-full">
                      <div className="w-1/4 flex items-center justify-between pr-4 gap-2"><span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{key}</span><input type="number" value={score} onChange={(e) => setTciProfile({ ...tciProfile, [key.toLowerCase()]: { ...tciProfile[key.toLowerCase()], score: e.target.value } })} className="w-14 bg-slate-950 p-2 rounded-xl text-xs font-bold text-center text-white border border-white/10 outline-none" /></div>
                      <div className="w-3/4 h-full relative flex items-center">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#2D3748] px-1.5 py-0.5 rounded-md border border-white/5"><span className="text-[9px] font-black text-slate-300 tracking-wider">{key}</span></div>
                        <div className="flex-1 h-full flex justify-end items-center relative">{!isPositive && (<div className={`h-3 ${barColor} rounded-l-full absolute right-0`} style={{ width: `${barWidth * 2}%` }} />)}</div>
                        <div className="flex-1 h-full flex justify-start items-center relative">{isPositive && (<div className={`h-3 ${barColor} rounded-r-full absolute left-0`} style={{ width: `${barWidth * 2}%` }} />)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center h-10 w-full">
                <div className="w-1/4 flex items-center justify-between pr-4 gap-2"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">SD + C</span><input type="number" value={sdCValue} onChange={(e) => setTciProfile({ ...tciProfile, sd_c: { ...tciProfile.sd_c, score: e.target.value } })} className="w-14 bg-slate-900 border border-amber-500/30 p-2 rounded-xl text-xs font-bold text-center text-amber-500 outline-none" /></div>
                <div className="w-3/4 h-full relative flex items-center opacity-30"><div className="absolute top-0 bottom-0 border-l border-slate-600/30" style={{ left: "50%" }}></div></div>
              </div>
            </div>
            <div className="bg-[#2D3748]/40 p-8 rounded-[3rem] border border-white/5 shadow-xl"><p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest mb-6">VAK Architecture</p><div className="space-y-6">{["Visual", "Auditory", "Kinesthetic"].map((type) => { const key = type.charAt(0).toLowerCase() + "Percent"; return (<div key={type} className="flex flex-col gap-2"><div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>{type}</span><span>{vakProfile[key]}%</span></div><div className="relative h-2 w-full bg-slate-950 rounded-full"><div className="absolute top-0 left-0 h-full bg-amber-500 rounded-full" style={{ width: `${vakProfile[key]}%` }} /><input type="range" min="0" max="100" value={vakProfile[key]} onChange={(e) => setVakProfile({ ...vakProfile, [key]: Number(e.target.value) })} className="absolute inset-0 w-full opacity-0 cursor-pointer" /></div></div>); })}</div></div>
          </div>
        </div>
      </div>
    );
  };

  const renderHub = () => {
    const activeTraits = bpsTraits;
    const totalProgress = mbGoalAmount > 0 ? Math.min(currentAsset / mbGoalAmount, 1) : 0;
    const widthMap = { 5: "w-[160px]", 4: "w-[200px]", 3: "w-[240px]", 2: "w-[280px]", 1: "w-[320px]" };
    
    // [변경] 오버레이 표시: 로그인 안했거나( !user ) 서명 안했으면( !signedDate )
    const showOverlay = !user || (user && !signedDate);

    return (
      <div className="relative w-full h-full flex-grow flex flex-col overflow-y-auto no-scrollbar pb-24">
        {showOverlay && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[6px] animate-fadeIn">
            <div className="bg-[#0A0F1E] border border-amber-500/30 p-10 rounded-[3rem] text-center shadow-2xl transform transition-all hover:scale-105 max-w-md">
              <ShieldCheck size={32} className="text-slate-600 mb-6 mx-auto" />
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">System Preview</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {user ? "서약서에 서명하면 모든 기능이 활성화됩니다." : "시스템을 사용하려면 ID 등록(로그인)이 필요합니다."}
              </p>
              <button 
                onClick={() => {
                  if (!user) { setCurrentView("lab"); showToast("먼저 My Lab에서 로그인/가입 하세요."); }
                  else { setCurrentView("contract"); }
                }} 
                className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 mx-auto active:scale-95 transition-all hover:bg-amber-500"
              >
                {user ? <><PenTool size={14} /> Sign Agreement</> : <><LogIn size={14} /> Login / Sign Up</>}
              </button>
            </div>
          </div>
        )}
        <div className={`flex flex-col md:flex-row items-center justify-center w-full h-full px-4 md:px-10 gap-8 ${showOverlay ? "opacity-40 blur-sm pointer-events-none" : "opacity-100"}`}>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center pt-10">
            <div className="flex justify-center items-end mb-4 w-full">
              <div onClick={() => setActiveLevel(6)} className="relative flex flex-col items-center cursor-pointer group">
                <div className="flex justify-between gap-2 mb-4">{bpsTraits.map((t, i) => (<span key={i} className="text-[10px] font-black px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-slate-400">{t || "Empty"}</span>))}</div>
                <h4 className="text-xl font-black text-slate-600 group-hover:text-amber-400 transition-all drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">BPS</h4>
              </div>
            </div>
            <div className="flex justify-center mb-1 animate-pulse"><div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-yellow-500" /></div>
            {[5, 4, 3, 2, 1].map((lv) => {
              const isConfigured = visions[lv].title !== "";
              const displayPercent = (totalProgress * 100).toFixed(1);
              return (
                <div key={lv} onClick={() => setActiveLevel(lv)} className={`cursor-pointer relative flex items-center justify-center h-[50px] rounded-2xl mb-2 overflow-hidden border bg-slate-900/50 ${widthMap[lv]} ${activeLevel === lv ? "border-amber-400 ring-2 ring-amber-500/50 scale-105" : isConfigured ? "border-amber-600/30" : "border-slate-700/50 opacity-60"}`}>
                  <div className={`absolute left-0 top-0 h-full transition-all duration-1000 ${isConfigured ? "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" : "bg-slate-600"}`} style={{ width: `${displayPercent}%` }} />
                  <div className="relative z-10 flex flex-col items-center leading-none">
                    <span className="font-black uppercase text-sm tracking-tight text-white drop-shadow-md">{levelMap[lv]}</span>
                    <span className="text-[11px] font-black mt-0.5 text-white opacity-90">{displayPercent}%</span>
                  </div>
                </div>
              );
            })}
            <p className="text-slate-600 text-[10px] font-bold mt-4 uppercase tracking-[0.2em]">5단계 미션</p>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6 h-full justify-center">
            <div className="bg-[#1A202C]/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative min-h-[500px] flex flex-col overflow-hidden">
              <div className="mb-6 relative z-10 flex items-center gap-3">
                <span className="text-4xl">{visions[activeLevel].emoji || "✨"}</span>
                <div><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{levelMap[activeLevel]} VISION</p><h2 className="text-2xl md:text-3xl font-black text-white">{visions[activeLevel].title || "비전을 설정해주세요"}</h2></div>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 mb-8 relative z-10"><p className="text-sm text-slate-300 italic leading-relaxed">"{visions[activeLevel].immersionScript || "My Lab에서 AI 몰입 시나리오를 생성해보세요."}"</p></div>
              <div className="flex-grow overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2"><h4 className="text-sm font-black text-white flex items-center gap-2"><ListPlus size={16} className="text-amber-500" /> Value Events</h4></div>
                <div className="space-y-3">
                  {visions[activeLevel].events.length === 0 ? (<div className="text-center py-8 text-slate-600 text-xs">등록된 행동이 없습니다.</div>) : (
                    visions[activeLevel].events.map((ev) => (
                      <div key={ev.id} className="group bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                        <span className="text-sm font-bold text-slate-200">{ev.name}</span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1">
                            <button onClick={() => setDuration(Math.max(0.5, duration - 0.5))} className="w-6 text-slate-400">-</button>
                            <span className="text-xs font-black text-white w-8 text-center">{duration}h</span>
                            <button onClick={() => setDuration(duration + 0.5)} className="w-6 text-slate-400">+</button>
                          </div>
                          <button onClick={() => handleDepositSubmit(ev.name)} className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-lg flex items-center gap-2"><Coins size={12} /> Deposit</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => (
    <div className="flex-grow w-full max-w-6xl mx-auto pb-24 px-4 animate-fadeIn">
      <div className="flex justify-between items-end mb-6">
        <div><p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Real-time Analysis</p><h2 className="text-3xl font-black text-white italic tracking-tighter">THE APEX STREAM</h2></div>
        <div className="text-right"><p className="text-[10px] text-slate-500 font-bold uppercase">Magnitude</p><span className="text-3xl font-black text-amber-500">{currency}{fNum(currentAsset - annualIncome)}</span></div>
      </div>
      <div className="bg-[#0A0F1E] border-2 border-white/5 rounded-[3rem] p-8 h-64 flex items-center justify-center text-slate-600 italic">차트 데이터를 집계 중입니다...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans overflow-hidden flex flex-col">
      <style>{`* { font-family: 'Pretendard', sans-serif; letter-spacing: -0.02em; } .animate-fadeIn { animation: fadeIn 0.8s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <header className="flex justify-between items-start md:items-center mb-8 px-4 max-w-7xl mx-auto w-full shrink-0">
        <div onClick={() => setCurrentView("hub")} className="cursor-pointer group"><h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase group-hover:opacity-80">THE <span className="text-amber-500">PULSE</span></h1><p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">milestones.today</p></div>
        {currentView !== "philosophy" && (
          <div className="text-right flex flex-col items-end gap-2 animate-fadeIn">
            <div className="flex flex-col items-end"><p className="text-[10px] text-amber-500 font-black uppercase tracking-widest flex items-center gap-1"><Sparkles size={10} /> Magnitude</p><div className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter shadow-amber-500/20 drop-shadow-xl"><span className="text-amber-500 mr-1">+</span>{currency}{fNum(currentAsset - annualIncome)}</div></div>
            <div className="mt-1 w-48 md:w-64 relative"><div className="flex justify-between text-[9px] font-black italic mb-1"><span className={user ? "text-amber-500" : "text-slate-600"}>{((currentAsset / mbGoalAmount) * 100).toFixed(1)}%</span><span className="text-amber-600 uppercase">GOAL: {currency}{fNum(mbGoalAmount)}</span></div><div className="w-full h-1.5 bg-slate-900 rounded-full relative overflow-hidden"><div className={`h-full transition-all duration-1000 ${user ? "bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-slate-700"}`} style={{ width: `${Math.min((currentAsset / mbGoalAmount) * 100, 100)}%` }} /></div></div>
          </div>
        )}
      </header>
      <div className="flex-grow flex flex-col overflow-hidden">
        {currentView === "hub" && renderHub()}
        {currentView === "contract" && renderContract()}
        {currentView === "lab" && renderLab()}
        {currentView === "analysis" && renderAnalysis()}
        {currentView === "philosophy" && renderPhilosophy()}
        {currentView === "archive" && (
          <div className="flex-grow w-full max-w-5xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 text-center md:text-left animate-fadeIn">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4"><Trophy className="text-amber-500" size={40} /><h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Manifested Milestones</h2></div>
              <button onClick={() => setCurrentView("trash")} className="text-slate-600 hover:text-rose-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"><Trash size={14} /> Trash</button>
            </div>
            {archivedVisions.length === 0 ? (<div className="text-center py-32 opacity-10 italic font-medium uppercase tracking-[0.5em] text-2xl font-serif">Void of Manifestation</div>) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{archivedVisions.map((item, i) => (<div key={i} className="bg-[#2D3748]/40 p-8 rounded-[3rem] border border-amber-500/20 flex gap-6 items-center shadow-2xl animate-fadeIn hover:bg-slate-900/60 transition-all cursor-default"><span className="text-5xl">{item.emoji}</span><div className="text-left"><h4 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h4><p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{levelMap[item.level]} | {item.date} {item.bonus === "IPO" ? "🏆 GLOBAL IPO" : "🏅 EARLY"}</p></div></div>))}</div>
            )}
          </div>
        )}
        {currentView === "trash" && (
          <div className="flex-grow w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 animate-fadeIn">
            <div className="flex items-center gap-4 mb-12"><Trash className="text-rose-500" size={40} /><h2 className="text-4xl font-black text-white uppercase italic tracking-tighter text-rose-500">Trash Bin</h2></div>
            {trashVisions.length === 0 ? (<div className="text-center py-32 opacity-20 italic font-serif">The Void is empty.</div>) : (trashVisions.map((item, i) => (<div key={i} className="bg-[#1A202C]/40 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center mb-4 transition-all hover:bg-rose-500/5"><div className="flex items-center gap-5"><span className="text-3xl">{item.emoji}</span><div><h4 className="text-lg font-bold text-slate-300">{item.title}</h4><p className="text-[10px] text-slate-600 uppercase font-black">{levelMap[item.level]}</p></div></div><div className="flex gap-3"><button onClick={() => { setVisions({ ...visions, [item.level]: item }); setTrashVisions(trashVisions.filter((_, idx) => idx !== i)); showToast("Potential Restored."); }} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500/20 transition-all shadow-lg"><RotateCcw size={20} /></button><button onClick={() => { setTrashVisions(trashVisions.filter((_, idx) => idx !== i)); showToast("Permanently Purged."); }} className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all shadow-lg"><Trash2 size={20} /></button></div></div>)))}
            <button onClick={() => setCurrentView("archive")} className="mt-8 text-xs font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center gap-2">← Return to Milestones</button>
          </div>
        )}
      </div>
      <footer className="fixed bottom-6 left-0 right-0 z-[1000] px-4 animate-fadeIn">
        <nav className="max-w-xl mx-auto flex justify-between items-center bg-[#0A0F1E]/90 backdrop-blur-xl rounded-full py-3 px-6 border border-white/10 shadow-2xl overflow-x-auto no-scrollbar">
          <NavBtn active={currentView === "hub"} onClick={() => setCurrentView("hub")} icon={<Home size={24} />} label="Ledger" />
          <NavBtn active={currentView === "lab"} onClick={() => setCurrentView("lab")} icon={<Settings size={20} />} label="My Lab" />
          <NavBtn active={currentView === "contract"} onClick={() => setCurrentView("contract")} icon={<PenTool size={20} />} label="Contract" />
          <NavBtn active={currentView === "analysis"} onClick={() => setCurrentView("analysis")} icon={<BarChart2 size={20} />} label="Stream" />
          <NavBtn active={currentView === "philosophy"} onClick={() => setCurrentView("philosophy")} icon={<BookOpen size={20} />} label="Philosophy" />
        </nav>
      </footer>
    </div>
  );
};

export default App;
