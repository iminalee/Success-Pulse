import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  Sparkles,
  Plus,
  Activity,
  Brain,
  Edit3,
  Save,
  Trash2,
  X,
  Home,
  BarChart2,
  CheckCircle,
  RotateCcw,
  Trash,
  Trophy,
  Beaker,
  User,
  Settings,
  CheckSquare,
  Square,
  ListPlus,
  Wand2,
  ClipboardList,
  Coins,
  Flag,
  Zap,
  PenTool,
  ShieldCheck,
  Info,
  TrendingUp,
  BookOpen,
  Star,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 1. Supabase 연결
const supabaseUrl = "https://ihhfgoqpsubjdqlytzvs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaGZnb3Fwc3ViamRxbHl0enZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDYxMDEsImV4cCI6MjA4MjY4MjEwMX0.1ZtWo4LiiOOJIFyKyvhPNXFwrvUgGeMTKTNp39kz61M";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. 유틸리티
const AutoTextarea = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}) => {
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

// 3. 메인 앱
const App = () => {

  // 기존 코드들 아래에 추가하세요
  const [otp, setOtp] = useState(""); // 인증번호 저장할 곳
  const [isOtpSent, setIsOtpSent] = useState(false); // 메일 보냈는지 확인하는 스위치

  // ▼▼▼ [추가] 시간(Duration) 상태 관리 (기본값 1시간) ▼▼▼
  const [duration, setDuration] = useState(1);
  
  // 상태 관리 (DB 동기화용)
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

  const initialLvAsset = 0 / 5;
  const [visions, setVisions] = useState({
    6: {
      title: "Apex Identity 확립",
      emoji: "👑",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: initialLvAsset,
      events: [],
    },
    5: {
      title: "",
      emoji: "🏥",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: initialLvAsset,
      events: [],
    },
    4: {
      title: "",
      emoji: "💰",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: initialLvAsset,
      events: [],
    },
    3: {
      title: "",
      emoji: "🤝",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: 0,
      events: [],
    },
    2: {
      title: "",
      emoji: "🛡️",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: 0,
      events: [],
    },
    1: {
      title: "",
      emoji: "🏃",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: initialLvAsset,
      events: [],
    },
  });

  const [vakProfile, setVakProfile] = useState({
    order: "V-A-K",
    vPercent: 50,
    aPercent: 30,
    kPercent: 20,
  });
  const [tciProfile, setTciProfile] = useState({
    ns: { score: 50 },
    ha: { score: 50 },
    rd: { score: 50 },
    p: { score: 50 },
    sd: { score: 50 },
    c: { score: 50 },
    st: { score: 50 },
    sd_c: { score: 100 },
  });
  const [archivedVisions, setArchivedVisions] = useState([]);
  const [trashVisions, setTrashVisions] = useState([]);

  // UI 상태
  const [activeLevel, setActiveLevel] = useState(5);
  const [currentView, setCurrentView] = useState("hub");
  const [chartData, setChartData] = useState([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeSensory, setActiveSensory] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // [핵심 1] 로그인 체크 및 데이터 불러오기 (Load)
  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchData(session.user.id);
      }
    };
    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchData(session.user.id);
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pulse_data")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("데이터 로딩 실패:", error);
    } else if (data) {
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

  // [핵심 2] 데이터 자동 저장 (Auto Save)
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(async () => {
      const updates = {
        id: user.id,
        user_name: userName,
        currency,
        annual_income: annualIncome,
        target_date: targetDate,
        ledger,
        visions,
        bps_traits: bpsTraits,
        vak_profile: vakProfile,
        tci_profile: tciProfile,
        archived_visions: archivedVisions,
        trash_visions: trashVisions,
        signature,
        signed_date: signedDate,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("pulse_data").upsert(updates);
      if (error) console.error("자동 저장 실패:", error);
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    user,
    userName,
    currency,
    annualIncome,
    targetDate,
    ledger,
    visions,
    bpsTraits,
    vakProfile,
    tciProfile,
    archivedVisions,
    trashVisions,
    signature,
    signedDate,
  ]);

  // [핵심 3] Gemini API 호출 (VAK 반영)
  // [수리용] 에러 원인을 팝업으로 상세히 알려주는 함수
  // [수정] 가장 안정적인 'gemini-pro' 모델을 사용하는 함수
  // [수정] 최신 모델(1.5-flash)과 새 키를 사용하는 함수
  // [수정] 새 API 키 + 최신 1.5 Flash 모델 적용
  // [옵션 1] Gemini 무료 (안정적인 gemini-pro 모델 사용)
  // [최종] OpenAI (ChatGPT) 연동 함수 (VAK 최적화 적용)
  const generateImmersionScript = async () => {
    // 🔴 회원님이 주신 OpenAI 키를 적용했습니다.
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    if (!visions[activeLevel].title) {
      return alert("⚠️ 비전 제목이 비어있습니다! 제목을 먼저 입력해주세요.");
    }

    setAiLoading(true);

    // VAK 비율 가져오기
    const v = vakProfile.vPercent;
    const a = vakProfile.aPercent;
    const k = vakProfile.kPercent;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // 빠르고 저렴하고 똑똑한 최신 모델
            messages: [
              {
                role: "system",
                content:
                  "너는 세계 최고의 NLP(신경언어프로그래밍) 전문가이자 동기부여 연설가야. 사용자의 감각 선호도(VAK)에 맞춰 생생한 미래 기억을 심어주는 역할을 해.",
              },
              {
                role: "user",
                content: `
              [목표 정보]
              - 목표: '${visions[activeLevel].title}'
              - 단계: '${levelMap[activeLevel]}'

              [사용자 VAK 감각 비율]
              이 비율에 맞춰 묘사의 비중을 조절해줘:
              - 시각(Visual): ${v}% (색채, 밝기, 모양 묘사)
              - 청각(Auditory): ${a}% (소리, 대화, 리듬 묘사)
              - 신체감각(Kinesthetic): ${k}% (온도, 질감, 무게, 심장박동 묘사)

              [요청 사항]
              위 정보를 바탕으로, 내가 이 목표를 이미 완벽하게 달성했을 때의 장면을 1인칭 시점의 '몰입 시나리오'로 작성해줘.
              조건:
              1. 한국어로 3~4문장으로 간결하게.
              2. 반드시 "나는 ~한다", "나는 ~를 느낀다" 처럼 확신에 찬 현재형 문장으로 끝맺을 것.
            `,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      // 에러 처리
      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.choices && data.choices[0]) {
        const script = data.choices[0].message.content;
        updateVision(activeLevel, { immersionScript: script });
        alert("✨ 성공! OpenAI가 VAK 맞춤형 시나리오를 작성했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert(
        `[OpenAI 오류]\n${error.message}\n\n(참고: OpenAI는 카드 등록 및 최소 $5 충전이 되어있어야 작동합니다.)`
      );
    } finally {
      setAiLoading(false);
    }
  };

// 1. 메일 보내기 함수 (수정버전)
  const handleLogin = async (email) => {
    if (!email) return alert("이메일을 입력해 주세요!");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true, // 신규 유저면 회원가입 허용
        },
      });

      if (error) {
        // 에러가 나면 여기서 멈춤 -> 입력칸 안 생김
        console.error("로그인 에러:", error);
        alert("❌ 메일 전송 실패: " + error.message);
      } else {
        // 성공해야만 이 줄이 실행됨 -> 입력칸 생김!
        setIsOtpSent(true); 
        alert("✅ 인증번호가 발송되었습니다! 메일함의 숫자 8자리를 확인하세요.");
      }
    } catch (err) {
      alert("시스템 에러: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. 인증번호 확인 함수 (새로 추가됨!)
  const handleVerifyOtp = async () => {
    if (!otp) return alert("인증번호 6자리를 입력해주세요!");
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email",
    });
    setLoading(false);

    if (error) {
      alert("인증번호가 틀렸거나 만료되었습니다. 다시 시도해주세요.");
    } else {
      // 성공하면 알아서 로그인 됨 (useEffect가 감지함)
      setIsOtpSent(false); // 입력창 닫기
    }
  };
  

  const fNum = (n) => Math.floor(n).toLocaleString();
  const mbGoalAmount = annualIncome * 2;
  const mbBalance = mbGoalAmount * 4;
  const livingAllowance = mbBalance * 0.25;
  const valueEventAmount = mbGoalAmount / 500;
  const isPhysioSet = !!visions[1]?.title;
  const levelMap = {
    1: "건강",
    2: "안전",
    3: "소속과 사랑",
    4: "존중감",
    5: "자아실현",
  };

  const handleFactoryReset = async () => {
    if (window.confirm("초기화하시겠습니까? DB의 모든 데이터가 삭제됩니다.")) {
      if (user) {
        await supabase.from("pulse_data").delete().eq("id", user.id);
      }
      window.location.reload();
    }
  };

// 회원 탈퇴 함수
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "정말로 탈퇴하시겠습니까?\n\n모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다."
      )
    ) {
      try {
        setLoading(true);
        // 1. 데이터 삭제
        await supabase.from("pulse_data").delete().eq("id", user.id);
        
        // 2. 계정 삭제 (아까 만든 SQL 함수 실행)
        const { error } = await supabase.rpc("delete_user");
        
        if (error) throw error;

        alert("탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
        await supabase.auth.signOut();
        window.location.reload();
      } catch (error) {
        alert("탈퇴 실패: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-8 py-3 rounded-full font-black shadow-2xl z-[5000] animate-bounce text-xs";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

// [수정] 개별 아이템 입금 처리 함수
  const handleDepositSubmit = (eventName) => {
    // 1. 현재 달성률 계산 (인플레이션 보너스 산정용)
    const progressRate = mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0;
    let inflationBonus = 1; // 기본 1배
    
    // 60% 이상부터 10%씩 할증
    if (progressRate >= 60) inflationBonus += 0.1;
    if (progressRate >= 70) inflationBonus += 0.1;
    if (progressRate >= 80) inflationBonus += 0.1;
    if (progressRate >= 90) inflationBonus += 0.1;

    // 2. 최종 입금액 계산 (기본단가 * 인플레 * 시간)
    const finalAmount = valueEventAmount * inflationBonus * duration;

    // 3. 장부(Ledger)에 기록
    const newEntry = { 
      date: new Date(), 
      amount: finalAmount, 
      desc: `${eventName} (${duration}h)` // 어떤 행동을 몇 시간 했는지 기록
    };
    setLedger((prev) => [...prev, newEntry]);
    
    // 4. 해당 레벨 자산 업데이트
    const newProgress = visions[activeLevel].progressAsset + finalAmount;
    updateVision(activeLevel, { progressAsset: newProgress });

    showToast(`[${eventName}] ${duration}시간 수행! ${currency}${fNum(finalAmount)} 입금 완료`);
    setDuration(1); // 시간 초기화
  };
  
  const archiveVision = (lv) => {
    const lvGoal = mbGoalAmount / 5;
    const isOverTarget = visions[lv].progressAsset >= lvGoal;
    setArchivedVisions((prev) => [
      ...prev,
      {
        ...visions[lv],
        level: lv,
        date: new Date().toLocaleDateString(),
        bonus: isOverTarget ? "IPO" : "Early",
      },
    ]);
    updateVision(lv, {
      title: "",
      emoji: "",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: 0,
      events: [],
    });
    setIsSensoryModalOpen(false);
  };
  const updateVision = (level, data) =>
    setVisions((prev) => ({ ...prev, [level]: { ...prev[level], ...data } }));
  const addEvent = (level) =>
    updateVision(level, {
      events: [
        ...visions[level].events,
        { id: Date.now().toString(), name: "신규 실천 항목", checked: false },
      ],
    });
  const toggleEventCheck = (level, id) =>
    updateVision(level, {
      events: visions[level].events.map((e) =>
        e.id === id ? { ...e, checked: !e.checked } : e
      ),
    });
  const updateBpsTrait = (index, value) => {
    const newTraits = [...bpsTraits];
    newTraits[index] = value;
    setBpsTraits(newTraits);
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
    if (
      chartRef.current &&
      (currentView === "hub" || currentView === "analysis")
    ) {
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.map((_, i) => i),
          datasets: [
            {
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
            },
          ],
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

  const renderLab = () => {
    const greenGroup = ["ns", "ha", "rd", "p"];
    const sdCValue =
      tciProfile.sd_c?.score ??
      Number(tciProfile.sd.score) + Number(tciProfile.c.score);
    return (
      <div className="flex-grow w-full max-w-7xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 animate-fadeIn font-sans">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Brain className="text-emerald-500" size={32} />
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              My Lab
            </h2>
          </div>
          <button
            onClick={handleFactoryReset}
            className="text-[10px] font-bold text-slate-600 hover:text-rose-500 flex items-center gap-2 border border-slate-700/50 px-3 py-2 rounded-lg transition-all"
          >
            <Trash2 size={12} /> Reset System
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#2D3748]/30 p-8 rounded-[3rem] border border-white/5 shadow-xl border-l-4 border-amber-500 mb-8 flex flex-col md:flex-row items-center gap-8">
              <div className="bg-amber-500/10 p-6 rounded-full border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <User size={32} className="text-amber-500" />
              </div>
              <div className="flex-grow w-full space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Flag size={12} /> Identity Registration
                  </p>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mr-2">
                      System User
                    </span>
                    <span className="text-[9px] font-black text-amber-500">
                      ver.0
                    </span>
                  </div>
                </div>

{user ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center animate-fadeIn">
                    <p className="text-emerald-500 font-black text-xl mb-2">
                      🎉 Identity Confirmed!
                    </p>
                    <p className="text-white text-sm font-bold mb-4">
                      {userName || "User"}{" "}
                      <span className="text-emerald-400 text-xs">ver.0</span>{" "}
                      <span className="text-slate-500 text-xs">
                        ({user.email})
                      </span>
                    </p>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="text-[10px] text-slate-500 hover:text-white underline decoration-slate-700 underline-offset-4"
                    >
                      로그아웃
                    </button>
                        <span className="text-slate-700 text-[10px]">|</span>
                      <button
                        onClick={handleDeleteAccount}
                        className="text-[10px] text-rose-500/60 hover:text-rose-500 underline decoration-rose-900/30 underline-offset-4"
                      >
                        회원 탈퇴
                      </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full animate-fadeIn">
                    {/* 1단계: 이메일 입력 */}
                    {!isOtpSent ? (
                      <>
                        <input
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="이름(닉네임)을 입력하세요"
                          className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="이메일을 입력하세요"
                          className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        <button
                          onClick={() => handleLogin(email)}
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                          {loading ? "전송 중..." : "인증번호 받기"}
                        </button>
                      </>
                    ) : (
                      /* 2단계: 인증번호 입력 (메일 보내고 나면 이 화면이 뜸) */
                      <div className="space-y-3 animate-fadeIn">
                        <p className="text-xs text-center text-slate-400">
                          메일함에 도착한{" "}
                          <span className="text-amber-500 font-bold">
                            숫자 8자리
                          </span>
                          를 입력해주세요.
                        </p>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="12345678"
                          className="w-full bg-slate-900/80 border border-amber-500/50 rounded-2xl p-4 text-center text-2xl font-black text-amber-500 tracking-widest outline-none focus:ring-2 focus:ring-amber-500"
                          maxLength={8}
                        />
                        <button
                          onClick={handleVerifyOtp}
                          disabled={loading}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                          {loading ? "확인 중..." : "로그인 완료"}
                        </button>
                        <button
                          onClick={() => setIsOtpSent(false)}
                          className="w-full text-xs text-slate-500 hover:text-white py-2"
                        >
                          이메일 다시 입력하기
                        </button>
                      </div>
                    )}
                  </div>
                )}


              
              </div>
            </div>
            <div className="bg-[#2D3748]/30 p-10 rounded-[3rem] border border-white/5 shadow-xl border-t-4 border-amber-500/50">
              <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <Star size={16} /> BPS Character Forge
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-600 uppercase ml-2 tracking-widest">
                      Character {idx + 1}
                    </label>
                    <input
                      value={bpsTraits[idx]}
                      onChange={(e) => updateBpsTrait(idx, e.target.value)}
                      placeholder={
                        ["지혜", "평온", "자비", "용기", "통찰"][idx]
                      }
                      className="w-full bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-[13px] text-amber-400 font-black text-center focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#2D3748]/40 p-10 rounded-[3rem] border border-white/5 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="space-y-1">
                  <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} /> Goal Architect
                  </p>
                  <p className="text-[12px] font-bold text-amber-500 italic bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 inline-block">
                    {activeLevel}단계: {levelMap[activeLevel]}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((lv) => (
                    <button
                      key={lv}
                      onClick={() => setActiveLevel(lv)}
                      className={`w-11 h-11 rounded-2xl font-black text-sm transition-all duration-300 ${
                        activeLevel === lv
                          ? "bg-amber-600 text-white shadow-lg scale-110 border border-amber-400/50"
                          : "bg-slate-900 text-slate-600 border border-white/5 hover:bg-slate-800"
                      }`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <input
                    value={visions[activeLevel].emoji}
                    onChange={(e) =>
                      updateVision(activeLevel, { emoji: e.target.value })
                    }
                    className="w-20 bg-slate-900 border border-white/5 rounded-3xl p-3 text-3xl text-center outline-none shrink-0"
      placeholder="🏥"
                  />
                  <input
                    value={visions[activeLevel].title}
                    onChange={(e) =>
                      updateVision(activeLevel, { title: e.target.value })
                    }
                    className="flex-1 min-w-0 bg-slate-900 border border-white/5 rounded-3xl p-4 text-md font-black text-white outline-none"
      placeholder="Enter Vision Title"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["v", "a", "k"].map((type) => (
                    <div
                      key={type}
                      className="space-y-2 bg-slate-950/40 p-5 rounded-[2rem] border border-white/5"
                    >
                      <p
                        className={`text-[9px] font-black uppercase px-2 tracking-widest ${
                          type === "v"
                            ? "text-amber-500"
                            : type === "a"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        {type === "v"
                          ? "👁️ Visual"
                          : type === "a"
                          ? "🎧 Auditory"
                          : "⚡ Kinesthetic"}
                      </p>
                      <AutoTextarea
                        value={visions[activeLevel][type]}
                        onChange={(e) =>
                          updateVision(activeLevel, { [type]: e.target.value })
                        }
                        placeholder="묘사..."
                        className="w-full bg-transparent p-2 text-xs leading-relaxed text-slate-300 outline-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-[#1A202C]/60 p-8 rounded-[2.5rem] border border-amber-500/20 my-10 relative shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                      <Brain size={14} /> AI Sensory Immersion Script
                    </p>
                    <button
                      onClick={generateImmersionScript}
                      disabled={aiLoading}
                      className="bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-xl active:scale-90 shadow-xl transition-all"
                    >
                      {aiLoading ? (
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        <Wand2 size={18} />
                      )}
                    </button>
                  </div>
                  <AutoTextarea
                    value={visions[activeLevel].immersionScript}
                    onChange={(e) =>
                      updateVision(activeLevel, {
                        immersionScript: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-none text-sm text-slate-200 leading-[1.8] font-medium focus:outline-none italic"
                    placeholder="AI가 VAK 기반 시나리오를 설계합니다."
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Action Checklist
                  </p>
                  <button
                    onClick={() => addEvent(activeLevel)}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black flex items-center gap-2 uppercase tracking-widest"
                  >
                    <Plus size={14} /> Add Event
                  </button>
                </div>
                {visions[activeLevel].events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-4 bg-[#1A202C]/40 p-5 rounded-2xl border border-white/5"
                  >
                    <CheckSquare size={18} className="text-slate-600" />
                    <input
                      value={ev.name}
                      onChange={(e) =>
                        setVisions((prev) => ({
                          ...prev,
                          [activeLevel]: {
                            ...prev[activeLevel],
                            events: prev[activeLevel].events.map((p) =>
                              p.id === ev.id
                                ? { ...p, name: e.target.value }
                                : p
                            ),
                          },
                        }))
                      }
                      className="bg-transparent border-none text-base text-slate-200 focus:outline-none flex-grow font-semibold"
                    />
                    <button
                      onClick={() =>
                        updateVision(activeLevel, {
                          events: visions[activeLevel].events.filter(
                            (p) => p.id !== ev.id
                          ),
                        })
                      }
                      className="text-rose-500/20 hover:text-rose-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#2D3748]/40 p-7 rounded-[2.5rem] border border-white/5 shadow-xl">
              <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Coins size={14} /> Financial Core
              </p>
              <div className="space-y-6 text-center">
                <div className="flex gap-3">
                  <div className="w-16">
                    <label className="block text-[8px] text-slate-500 mb-1 font-black uppercase tracking-widest">
                      Unit
                    </label>
                    <input
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-[#1A202C]/80 border border-white/10 rounded-xl p-3 text-center font-bold text-white outline-none"
                    />
                  </div>
                  <div className="flex-grow">
                    <label className="block text-[8px] text-slate-500 mb-1 font-black uppercase text-left tracking-widest">
                      Annual Income
                    </label>
                    <input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      className="w-full bg-[#1A202C]/80 border border-white/10 rounded-xl p-3 font-mono font-bold text-white text-right outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center p-4 bg-slate-900/60 rounded-2xl border border-white/5 shadow-inner">
                    <p className="text-[9px] text-slate-500 font-bold uppercase">
                      MB 목표액
                    </p>
                    <p className="text-sm font-black text-white">
                      {currency}
                      {fNum(mbGoalAmount)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-900/60 rounded-2xl border border-white/5 shadow-inner">
                    <p className="text-[9px] text-slate-500 font-bold uppercase">
                      MB 잔액
                    </p>
                    <p className="text-sm font-black text-white">
                      {currency}
                      {fNum(mbBalance)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-amber-500/10 rounded-[1.5rem] border border-amber-500/30 mt-4 shadow-lg">
                    <p className="text-[12px] text-amber-500 font-black uppercase tracking-widest">
                      Value Event Award
                    </p>
                    <p className="text-xl font-black text-amber-400 font-mono tracking-tighter">
                      {currency}
                      {fNum(valueEventAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#2D3748]/40 p-6 rounded-[2.5rem] border border-white/5 shadow-xl font-sans">
              <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Brain size={12} /> VAK Architecture
              </p>
              <div className="space-y-4">
                <div className="bg-slate-900/80 p-4 rounded-xl text-center border border-white/5 shadow-inner mb-6">
                  <p className="text-[8px] text-slate-500 font-bold uppercase mb-1 tracking-widest">
                    Sensory Order
                  </p>
                  <div className="text-xl font-black text-emerald-400 tracking-[0.2em]">
                    {vakProfile.order}
                  </div>
                </div>
                <div className="space-y-6">
                  {["Visual", "Auditory", "Kinesthetic"].map((type) => {
                    const key = type.charAt(0);
                    const value = vakProfile[`${key.toLowerCase()}Percent`];
                    const colorClass =
                      key === "V"
                        ? "bg-amber-500"
                        : key === "A"
                        ? "bg-emerald-500"
                        : "bg-rose-500";
                    const textClass =
                      key === "V"
                        ? "text-amber-500"
                        : key === "A"
                        ? "text-emerald-500"
                        : "text-rose-500";
                    return (
                      <div key={type} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end px-1">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider ${textClass}`}
                          >
                            {type} ({key})
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {value}%
                          </span>
                        </div>
                        <div className="relative h-3 w-full bg-slate-950 rounded-full border border-white/10 shadow-inner group">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-150 ease-out ${colorClass} opacity-80 group-hover:opacity-100`}
                            style={{ width: `${value}%` }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-slate-800 cursor-grab active:cursor-grabbing transition-all hover:scale-110 z-20"
                            style={{ left: `calc(${value}% - 10px)` }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={value}
                            onChange={(e) =>
                              setVakProfile({
                                ...vakProfile,
                                [`${key.toLowerCase()}Percent`]: Number(
                                  e.target.value
                                ),
                              })
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="bg-[#2D3748]/40 p-8 rounded-[2.5rem] border border-white/5 shadow-xl font-sans">
              <div className="mb-6 flex items-center gap-2">
                <ClipboardList size={12} className="text-rose-500" />
                <p className="text-[12px] font-black text-rose-500 uppercase tracking-widest">
                  TCI Intelligence
                </p>
              </div>
              <div className="flex w-full mb-2">
                <div className="w-1/4"></div>
                <div className="w-3/4 relative h-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">
                  백분위 그래프
                </div>
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                {["NS", "HA", "RD", "P", "SD", "C", "ST"].map((key) => {
                  const score = Number(tciProfile[key.toLowerCase()].score);
                  const isPositive = score >= 50;
                  const barWidth = Math.abs(score - 50);
                  const barColor = greenGroup.includes(key.toLowerCase())
                    ? "bg-emerald-500"
                    : "bg-amber-500";
                  return (
                    <div key={key} className="flex items-center h-10 w-full">
                      <div className="w-1/4 flex items-center justify-between pr-4 gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          {key}
                        </span>
                        <input
                          type="number"
                          value={score}
                          onChange={(e) =>
                            setTciProfile({
                              ...tciProfile,
                              [key.toLowerCase()]: {
                                ...tciProfile[key.toLowerCase()],
                                score: e.target.value,
                              },
                            })
                          }
                          className="w-14 bg-slate-950 p-2 rounded-xl text-xs font-bold text-center text-white border border-white/10 outline-none"
                        />
                      </div>
                      <div className="w-3/4 h-full relative flex items-center">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#2D3748] px-1.5 py-0.5 rounded-md border border-white/5">
                          <span className="text-[9px] font-black text-slate-300 tracking-wider">
                            {key}
                          </span>
                        </div>
                        <div className="flex-1 h-full flex justify-end items-center relative">
                          {!isPositive && (
                            <div
                              className={`h-3 ${barColor} rounded-l-full absolute right-0`}
                              style={{ width: `${barWidth * 2}%` }}
                            />
                          )}
                        </div>
                        <div className="flex-1 h-full flex justify-start items-center relative">
                          {isPositive && (
                            <div
                              className={`h-3 ${barColor} rounded-r-full absolute left-0`}
                              style={{ width: `${barWidth * 2}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center h-10 w-full">
                <div className="w-1/4 flex items-center justify-between pr-4 gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    SD + C
                  </span>
                  <input
                    type="number"
                    value={sdCValue}
                    onChange={(e) =>
                      setTciProfile({
                        ...tciProfile,
                        sd_c: { ...tciProfile.sd_c, score: e.target.value },
                      })
                    }
                    className="w-14 bg-slate-900 border border-amber-500/30 p-2 rounded-xl text-xs font-bold text-center text-amber-500 outline-none"
                  />
                </div>
                <div className="w-3/4 h-full relative flex items-center opacity-30">
                  <div
                    className="absolute top-0 bottom-0 border-l border-slate-600/30"
                    style={{ left: "50%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

const renderHub = () => {
    // 5개 Character가 다 보이도록 전체 배열 사용
    const activeTraits = bpsTraits;
    const isLocked = !signedDate;
    // 0 나누기 0 에러 방지용 안전장치
    const totalProgress = mbGoalAmount > 0 ? Math.min(currentAsset / mbGoalAmount, 1) : 0;

    // [Fix] 피라미드 모양 유지를 위한 각 레벨별 너비 설정
    const widthMap = {
      5: "w-[160px]", // 5단계 (제일 좁음)
      4: "w-[200px]",
      3: "w-[240px]",
      2: "w-[280px]",
      1: "w-[320px]", // 1단계 (제일 넓음)
    };

    return (
      <div className="relative w-full h-full flex-grow flex flex-col overflow-y-auto no-scrollbar pb-24">
        {/* ======================= */}
        {/* 1. 잠금 화면 (계약 전) - 유지 */}
        {/* ======================= */}
        {isLocked && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[6px] animate-fadeIn">
            <div className="bg-[#0A0F1E] border border-amber-500/30 p-10 rounded-[3rem] text-center shadow-[0_0_100px_rgba(245,158,11,0.2)] max-w-md transform transition-all hover:scale-105">
              <div className="mx-auto bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner group">
                <ShieldCheck size={32} className="text-slate-600 group-hover:text-amber-500 transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">System Preview</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                현재 <span className="text-amber-500 font-bold">미리보기 모드</span> 입니다.<br />서약서에 서명하면 모든 기능이 활성화됩니다.
              </p>
              <button onClick={() => setCurrentView("contract")} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 mx-auto transition-all active:scale-95">
                <PenTool size={14} /> Sign Agreement to Unlock
              </button>
            </div>
          </div>
        )}

        {/* 메인 레이아웃: PC(가로) / 모바일(세로) 분기 */}
        <div className={`flex flex-col md:flex-row items-center justify-center w-full h-full px-2 md:px-10 gap-8 transition-all duration-1000 ${isLocked ? "opacity-40 blur-sm pointer-events-none" : "opacity-100"}`}>
          
          {/* ======================= */}
          {/* [좌측 패널] 피라미드 */}
          {/* ======================= */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-10 pt-10">
              
             {/* BPS Header (캐릭터 가로 한 줄 배치 + BPS 위치 조정) */}
             <div className="relative flex justify-center items-end mb-4 z-20 w-full"> 
                <div onClick={() => setActiveLevel(6)} className="relative flex flex-col items-center justify-end cursor-pointer group w-full">
                  
                  {/* 캐릭터 5개 가로로 쫙 펼치기 */}
                  <div className="flex justify-between items-center w-full max-w-md px-4 mb-4"> 
                    {activeTraits.map((trait, i) => (
                      <span key={i} className={`text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 whitespace-nowrap shadow-lg animate-pulse ${activeLevel === 6 ? "text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" : "text-slate-400 opacity-70"}`}>
                        {trait || "Empty"}
                      </span>
                    ))}
                  </div>

                  {/* BPS 글자 */}
                  <h4 className={`text-xl font-black tracking-tighter transition-all duration-500 translate-y-[-5px] ${activeLevel === 6 ? "text-amber-400 scale-110" : "text-slate-600"}`}
                      style={{ filter: `drop-shadow(0 0 ${10 + totalProgress * 40}px rgba(245, 158, 11, ${0.5 + totalProgress * 0.5}))` }}>
                    BPS
                  </h4>
                </div>
             </div>

             {/* [수정 포인트] 장식용 노란 삼각형 (반복문 밖으로 분리됨!) */}
             <div className="flex justify-center mb-1 animate-pulse">
               <div className="w-0 h-0 
                 border-l-[30px] border-l-transparent 
                 border-r-[30px] border-r-transparent 
                 border-b-[40px] border-b-yellow-500 
                 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]">
               </div>
             </div>

             {/* [수정 포인트] Pyramid Levels (모두 Bar 형태로 통일) */}
             {[5, 4, 3, 2, 1].map((lv) => {
                const isConfigured = visions[lv].title !== "";
                const isActive = lv === activeLevel;
                
                // 퍼센트 계산 (기존 로직 유지)
                const visualPercent = totalProgress * 100; 
                const displayPercent = visualPercent.toFixed(1);

                return (
                  <div 
                    key={lv} 
                    onClick={() => setActiveLevel(lv)} 
                    // [Fix] 너비는 widthMap을 사용해 피라미드 형태 유지
                    className={`
                      cursor-pointer relative flex items-center justify-center h-[50px] rounded-2xl mb-2 overflow-hidden transition-all duration-300 
                      border border-slate-700/50 bg-slate-800/80
                      ${widthMap[lv]}
                      ${isActive ? "ring-2 ring-amber-500 scale-105 z-10 brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "opacity-90 hover:opacity-100 hover:border-slate-500"}
                    `}
                  >
                    {/* 1. 배경 게이지 (파란색 그라데이션) */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-90 transition-all duration-1000" 
                      style={{ width: `${displayPercent}%` }} 
                    />

                    {/* 2. 텍스트 정보 (항상 중앙 정렬, 삼각형 문제 해결됨) */}
                    <div className="relative z-10 flex flex-col items-center justify-center leading-none">
                      <span className={`font-bold uppercase text-sm ${isActive ? "text-white" : "text-slate-300"}`}>
                        {levelMap[lv]}
                      </span>
                      <span className="text-[10px] text-yellow-300 font-bold mt-0.5">
                        {displayPercent}%
                      </span>
                    </div>
                  </div>
                );
             })}
             
             <p className="text-slate-500 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] opacity-60">5단계 미션</p>
          </div>

          {/* ======================= */}
          {/* [우측 패널] 비전 카드 (기능 유지) */}
          {/* ======================= */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 animate-fadeIn h-full justify-center">
            
            <div className="bg-[#1A202C]/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
               <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><Zap size={150} className="text-white" /></div>
               <div className="mb-6 relative z-10">
                 <div className="flex items-center gap-3 mb-2">
                   <span className="text-4xl">{visions[activeLevel].emoji || "✨"}</span>
                   <div>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{levelMap[activeLevel]} VISION</p>
                     <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                       {visions[activeLevel].title || "비전을 설정해주세요"}
                     </h2>
                   </div>
                 </div>
               </div>
               <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 mb-8 relative z-10 flex-grow-0">
                 <p className="text-sm text-slate-300 italic leading-relaxed">
                   {visions[activeLevel].immersionScript ? `"${visions[activeLevel].immersionScript}"` : "My Lab에서 AI 몰입 시나리오를 생성해보세요."}
                 </p>
               </div>
               <div className="flex-grow flex flex-col">
                 <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
                   <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <ListPlus size={16} className="text-amber-500" /> Value Events
                   </h4>
                 </div>
                 <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[250px]">
                    {visions[activeLevel].events.length === 0 ? (
                      <div className="text-center py-8 text-slate-600 text-xs">
                        등록된 Value Event가 없습니다.<br/>My Lab에서 행동 목록을 추가하세요.
                      </div>
                    ) : (
                      visions[activeLevel].events.map((ev) => (
                        <div key={ev.id} className="group bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-amber-500/50 rounded-xl p-4 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-bold text-slate-200 group-hover:text-white">{ev.name}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-white/10">
                               <button onClick={() => setDuration(Math.max(0.5, duration - 0.5))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white font-bold text-xs">-</button>
                               <span className="text-xs font-black text-white w-8 text-center">{duration}h</span>
                               <button onClick={() => setDuration(duration + 0.5)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white font-bold text-xs">+</button>
                            </div>
                            <button onClick={() => handleDepositSubmit(ev.name)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2">
                              <Coins size={12} /> Deposit
                            </button>
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
  const renderAnalysis = () => {
    const startDate = signedDate ? new Date(signedDate) : new Date();
    const targetDateObj = new Date(targetDate);
    const today = new Date();
    const startAmount = annualIncome;
    const goalAmount = mbGoalAmount;
    const sortedLedger = ledger.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let currentAccumulated = startAmount;
    const dataPoints = [{ date: startDate, amount: startAmount }];
    sortedLedger.forEach((item) => {
      const itemDate = new Date(item.date);
      if (itemDate >= startDate) {
        currentAccumulated += item.amount;
        dataPoints.push({ date: itemDate, amount: currentAccumulated });
      }
    });
    if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1].date < today)
      dataPoints.push({ date: today, amount: currentAccumulated });
    const chartW = 800;
    const chartH = 400;
    const padding = { top: 60, right: 100, bottom: 60, left: 80 };
    const innerW = chartW - padding.left - padding.right;
    const innerH = chartH - padding.top - padding.bottom;
    const totalTime = targetDateObj - startDate;
    const getX = (date) =>
      padding.left +
      innerW * Math.max(0, Math.min((date - startDate) / totalTime, 1));
    const minY = startAmount * 0.9;
    const maxY = goalAmount * 1.1;
    const totalAmountRange = maxY - minY;
    const getY = (amount) =>
      chartH - padding.bottom - innerH * ((amount - minY) / totalAmountRange);
    const startX = getX(startDate);
    const startY = getY(startAmount);
    const nowX = getX(today);
    const nowY = getY(currentAccumulated);
    const goalX = getX(targetDateObj);
    const goalY = getY(goalAmount);
    const xTicks = [];
    let tickDate = new Date(startDate);
    tickDate.setMonth(tickDate.getMonth() + 1);
    tickDate.setDate(1);
    while (tickDate < targetDateObj) {
      xTicks.push(new Date(tickDate));
      tickDate.setMonth(tickDate.getMonth() + 1);
    }
    let pathD =
      dataPoints.length > 0
        ? `M ${getX(dataPoints[0].date)} ${getY(dataPoints[0].amount)}`
        : "";
    for (let i = 1; i < dataPoints.length; i++)
      pathD += ` L ${getX(dataPoints[i].date)} ${getY(dataPoints[i].amount)}`;
    const forecastD = `M ${nowX} ${nowY} Q ${
      nowX + (goalX - nowX) * 0.5
    } ${nowY}, ${goalX} ${goalY}`;
    const formatDate = (date) => `${date.getMonth() + 1}.${date.getDate()}`;

    return (
      <div className="flex-grow w-full max-w-6xl mx-auto pb-24 px-4 animate-fadeIn font-sans">
        <div className="flex justify-between items-end mb-6 px-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em]">
                Real-time Analysis
              </p>
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter">
              THE APEX STREAM
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Accumulated Magnitude
            </p>
            <div className="flex items-end justify-end gap-2">
              <span className="text-3xl font-black text-amber-500 italic">
                {currency}
                {fNum(currentAccumulated - startAmount)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#0A0F1E] border-2 border-white/5 rounded-[3rem] p-4 relative overflow-visible shadow-2xl">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-auto overflow-visible"
          >
            <defs>
              <linearGradient
                id="realPathGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
              </linearGradient>
              <filter id="neonBlur">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1={padding.left}
              y1={goalY}
              x2={chartW}
              y2={goalY}
              stroke="#F59E0B"
              strokeWidth="1"
              strokeDasharray="6,4"
              opacity="0.4"
            />
            <g transform={`translate(${goalX}, ${goalY})`}>
              <foreignObject x="-20" y="-45" width="40" height="60">
                <div className="flex flex-col items-center justify-end animate-bounce h-full pb-2">
                  <Trophy
                    size={28}
                    className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                    weight="fill"
                  />
                </div>
              </foreignObject>
              <text
                y="-55"
                textAnchor="middle"
                fill="#F59E0B"
                fontSize="10"
                fontWeight="900"
                className="uppercase tracking-widest"
              >
                Apex BP
              </text>
              <text
                y="-67"
                textAnchor="middle"
                fill="#F59E0B"
                fontSize="8"
                opacity="0.7"
              >
                TARGET
              </text>
            </g>
            <line
              x1={padding.left}
              y1={chartH - padding.bottom}
              x2={goalX}
              y2={chartH - padding.bottom}
              stroke="#334155"
              strokeWidth="2"
            />
            <g transform={`translate(${startX}, ${chartH - padding.bottom})`}>
              <line y1="0" y2="10" stroke="#F59E0B" strokeWidth="2" />
              <text
                y="25"
                textAnchor="middle"
                fill="#F59E0B"
                fontSize="10"
                fontWeight="black"
              >
                START
              </text>
              <text y="35" textAnchor="middle" fill="#64748B" fontSize="8">
                {formatDate(startDate)}
              </text>
            </g>
            {xTicks.map((tickDate, i) => {
              const tx = getX(tickDate);
              if (tx > goalX - 30) return null;
              const isJan = tickDate.getMonth() === 0;
              return (
                <g
                  key={i}
                  transform={`translate(${tx}, ${chartH - padding.bottom})`}
                >
                  <line
                    y1="0"
                    y2={isJan ? "10" : "6"}
                    stroke={isJan ? "#F59E0B" : "#475569"}
                    strokeWidth={isJan ? "2" : "1"}
                  />
                  <text
                    y="24"
                    textAnchor="middle"
                    fill={isJan ? "#F59E0B" : "#64748B"}
                    fontSize={isJan ? "10" : "9"}
                    fontWeight={isJan ? "black" : "bold"}
                  >
                    {isJan
                      ? `${tickDate.getFullYear()}. ${tickDate.getMonth() + 1}.`
                      : `${tickDate.getMonth() + 1}.`}
                  </text>
                </g>
              );
            })}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={chartH - padding.bottom}
              stroke="#334155"
              strokeWidth="2"
            />
            <text
              x={padding.left - 15}
              y={startY}
              textAnchor="end"
              fill="#94A3B8"
              fontSize="10"
              fontWeight="bold"
              dominantBaseline="middle"
            >
              {currency}
              {fNum(startAmount)}
            </text>
            <text
              x={padding.left - 15}
              y={goalY}
              textAnchor="end"
              fill="#F59E0B"
              fontSize="11"
              fontWeight="black"
              dominantBaseline="middle"
            >
              {currency}
              {fNum(goalAmount)}
            </text>
            <path
              d={forecastD}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.3"
            />
            <text
              x={(nowX + goalX) / 2}
              y={(nowY + goalY) / 2 - 10}
              fill="#F59E0B"
              fontSize="9"
              opacity="0.5"
              textAnchor="middle"
              transform={`rotate(-10, ${(nowX + goalX) / 2}, ${
                (nowY + goalY) / 2 - 10
              })`}
            >
              EXPECTED PATH
            </text>
            <path
              d={pathD}
              fill="none"
              stroke="url(#realPathGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonBlur)"
            />
            <g transform={`translate(${nowX}, ${chartH - padding.bottom})`}>
              <line
                y1="0"
                y2={-(chartH - padding.bottom - nowY)}
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.5"
              />
              <rect
                x="-35"
                y="10"
                width="70"
                height="22"
                rx="6"
                fill="#F59E0B"
              />
              <text
                x="0"
                y="24"
                textAnchor="middle"
                fill="#000"
                fontSize="9"
                fontWeight="black"
              >
                NOW ({formatDate(today)})
              </text>
            </g>
            <g transform={`translate(${nowX}, ${nowY})`}>
              <circle r="5" fill="#FFF" filter="url(#neonBlur)" />
              <circle r="10" fill="none" stroke="#FFF" opacity="0.4">
                <animate
                  attributeName="r"
                  values="6;14;6"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
        </div>
        <div className="mt-8 text-center opacity-40">
          <p className="text-[10px] uppercase tracking-widest">
            Data reflects actual ledger entries from{" "}
            {startDate.toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  const renderContract = () => {
    const isLocked = !!signedDate;
    const handleExecuteContract = () => {
      if (!signature.trim()) return showToast("서명란이 비어있습니다.");
      if (signature.trim() !== userName.trim())
        return showToast(`서명 불일치: '${userName}'과 동일해야 합니다.`);
      if (
        window.confirm(
          `[${userName}]님의 이름으로 서약을 체결하시겠습니까?\n\n확인 시 계약이 즉시 발효되며, 시작일이 확정됩니다.`
        )
      ) {
        setSignedDate(new Date());
        showToast("계약이 체결되었습니다. 시스템이 활성화됩니다.");
      }
    };
    const handleVoidContract = () => {
      if (
        window.confirm(
          "⚠️ 경고: 현재 계약을 파기하시겠습니까?\n\n계약을 파기하면 서명과 시작일(Start Date)이 초기화되며, 그래프의 기록 기준점이 달라질 수 있습니다."
        )
      ) {
        setSignedDate(null);
        setSignature("");
        showToast("계약이 파기되었습니다. 재설정하십시오.");
      }
    };

    return (
      <div className="flex-grow w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 animate-fadeIn font-sans">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <PenTool
              className={isLocked ? "text-emerald-500" : "text-amber-500"}
              size={32}
            />
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              Manifestation Contract
            </h2>
          </div>
          {isLocked && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                Contract Active
              </span>
            </div>
          )}
        </div>
<div
  className={`bg-[#0A0F1E] border-2 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-16 relative overflow-hidden shadow-2xl transition-all duration-500 ${
    isLocked
      ? "border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
      : "border-white/10"
  }`}
>
  <div className="absolute top-0 right-0 p-4 md:p-16 opacity-5 pointer-events-none">
    <ShieldCheck size={280} className="text-white" />
  </div>
  
  <div className="flex flex-col items-center mb-8 md:mb-16 text-center">
    <h3 className="text-2xl md:text-4xl font-light text-white tracking-[0.3em] uppercase border-b border-white/10 pb-4 md:pb-8 mb-4 md:mb-6 font-serif">
      存在 的 契約
    </h3>
    <p className="text-[10px] text-slate-500 font-bold tracking-[0.6em] uppercase">
      The Bond of Essential Identity
    </p>
  </div>
  
  <div className="space-y-6 md:space-y-10 text-slate-300 leading-[1.8] md:leading-[2.2] text-base md:text-xl font-normal tracking-tight text-center md:text-left px-0 md:px-10">
    <p className="border-l-2 border-amber-500/30 pl-4 md:pl-8 font-sans">
      {" "}
      <span className="text-white font-bold px-1 md:px-2 underline decoration-amber-500/40 italic">
        Apex BP {userName}
      </span>
      는 현 시점 자아인{" "}
      <span className="text-white font-bold">{userName} ver.0</span>이
      본질적 자아로 도약할 가능성을 선택하였다.
          </p>
            <p className="border-l-2 border-amber-500/30 pl-8 font-sans">
              이에 {" "}
              <span className="text-white font-bold">
                {userName} ver.0
              </span>는{" "}
              <input
                type="date"
                value={targetDate}
                disabled={isLocked}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`mx-2 px-4 py-2 rounded-xl text-xl font-bold border outline-none shadow-inner transition-all ${
                  isLocked
                    ? "bg-emerald-900/20 text-emerald-400 border-emerald-500/30 cursor-not-allowed"
                    : "bg-slate-900 text-amber-500 border-white/5 focus:border-amber-500"
                }`}
              />{" "}
              까지 Apex BP를 이루는 최대 5개의 목표를 달성한다.{" "} 이 댓가로 BP
              {userName}는 현 멘탈뱅크 잔액{" "}
              <span className="text-white font-black">Mental Bank Balance</span>{" "}
              (
              <span className="text-white border-b border-white/30">
                {currency}
                {fNum(mbBalance)}
              </span>
              )의 <span className="text-amber-500 font-bold">25%</span> 
              금액인{" "}
              <span className="text-white font-bold mx-2 bg-white/5 px-3 py-1 rounded-lg">
                {currency}
                {fNum(livingAllowance)}
              </span>
              을 지급하되, 
            </p>
            <p className="border-l-2 border-amber-500/30 pl-8 font-sans">
              목표달성 활동으로 매시간의 실천 가치를
              증명할 때마다 시간당{" "}
              <span className="text-emerald-400 font-bold px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                {currency}
                {fNum(valueEventAmount)}
              </span>
              의{" "}
              <span className="text-xs uppercase opacity-60 font-bold tracking-widest">
                Value Award
              </span>
              으로 지급한다.
            </p>
            <p className="border-l-2 border-rose-500/50 pl-8 bg-rose-500/5 py-4 rounded-r-xl font-sans">
              단,{" "}
              <span className="text-rose-400 font-black">
                3일 이상 무활동 시
              </span>
              , BP {userName}는 계약을 파기하고 다른 평행 세계의{" "}
              <span className="italic opacity-80">{userName} ver.N</span>을 찾아
              선택할 권리를 가진다.
            </p>
          </div>
          <div className="mt-20 border-t border-white/10 pt-12 px-4 md:px-12 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-16 md:gap-0">
              <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  SIGNED BY THE VESSEL(CURRENT SELF)
                </p>
                <div className="relative group flex flex-col gap-4">
                  <input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    disabled={isLocked}
                    placeholder="Sign Here (Name)"
                    className={`text-3xl md:text-3xl bg-transparent border-b-2 font-serif italic w-64 pb-2 focus:outline-none transition-colors text-center md:text-left ${
                      isLocked
                        ? "text-emerald-400 border-emerald-500/50 cursor-not-allowed opacity-80"
                        : "text-white border-slate-700 focus:border-amber-500 placeholder:text-slate-700"
                    }`}
                  />
                  {!isLocked ? (
                    <button
                      onClick={handleExecuteContract}
                      className="bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <PenTool size={14} /> 서약 체결 (Execute)
                    </button>
                  ) : (
                    <button
                      onClick={handleVoidContract}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest flex items-center gap-2 border border-rose-500/30 px-4 py-2 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} /> Void Contract
                    </button>
                  )}
                </div>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  Date:{" "}
                  <span
                    className={`transition-colors duration-500 ${
                      signedDate ? "text-amber-500 font-bold" : "text-slate-500"
                    }`}
                  >
                    {signedDate
                      ? new Date(signedDate).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto relative">
                <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest mb-2">
                  AUTHORIZED BY APEX BP{userName}(FUTURE SELF)
                </p>
                <div className="relative inline-block mt-2">
                  <div
                    className="text-4xl md:text-5xl font-black text-amber-800 select-none opacity-30 font-serif italic pr-6"
                    style={{ textShadow: "-1px -1px 0 rgba(0,0,0,0.5)" }}
                  >
                    BP {userName}
                  </div>
                  <div className="absolute top-1 -right-6 w-32 h-32 border-4 border-rose-600/80 rounded-full flex flex-col items-center justify-center -rotate-12 animate-pulse opacity-90 mix-blend-screen pointer-events-none shadow-[0_0_15px_rgba(225,29,72,0.5)] bg-rose-500/10 backdrop-blur-[1px]">
                    <div className="w-28 h-28 border border-rose-600/50 rounded-full flex flex-col items-center justify-center p-2 text-rose-600">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        APEX IDENTITY
                      </span>
                      <span className="text-xl font-black font-serif italic my-1">
                        Approved
                      </span>
                      <span className="text-[8px] font-bold tracking-widest border-t border-rose-600/50 pt-1 w-full text-center">
                        OFFICIAL SEAL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhilosophy = () => (
    <div className="flex-grow w-full max-w-5xl mx-auto overflow-y-auto no-scrollbar pb-24 px-6 animate-fadeIn font-sans text-left">
      <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8 mt-4">
        <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <BookOpen size={36} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            System Manifesto
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">
            Philosophy & Operational Protocol
          </p>
        </div>
      </div>
      <div className="space-y-16">
        <section className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/50 via-transparent to-transparent hidden md:block" />
          <h3 className="text-xl font-black text-cyan-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Beaker size={18} /> Scientific Foundation: Identity Alchemy
          </h3>
          <div className="bg-slate-900/40 p-8 md:p-10 rounded-[3rem] border border-cyan-500/10 shadow-[0_0_50px_rgba(6,182,212,0.05)] backdrop-blur-sm">
            <p className="text-base text-slate-300 leading-[1.8] font-medium mb-8">
              The Pulse는 단순한 목표 관리 도구가 아닙니다. 이는 지난 반세기
              동안 발전해 온{" "}
              <span className="text-cyan-400">
                행동심리학, 뇌과학, 그리고 긍정심리학의 정수
              </span>
              를 하나의 정교한 알고리즘으로 통합한 '정체성 설계 시스템'입니다.
              본 시스템의 뿌리를 이루는 과학적 기둥들은 당신의 무의식을
              재배열하고 실질적인 삶의 궤적을 수정합니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-3">
                <h5 className="text-cyan-400 font-bold flex items-center gap-2 italic">
                  01. Mental Bank Concept
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  존 카파스(Dr. John Kappas) 박사의{" "}
                  <span className="text-slate-200">Mental Bank</span> 이론을
                  계승하여, 무의식이 '강화와 보상'이라는 경제적 논리에 따라
                  움직이도록 설계되었습니다. 밤마다 기록되는 자산은 무의식이
                  성공을 '당연한 결과'로 받아들이게 만듭니다.
                </p>
              </div>
              <div className="space-y-3">
                <h5 className="text-cyan-400 font-bold flex items-center gap-2 italic">
                  02. NLP VAK Model
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  NLP의{" "}
                  <span className="text-slate-200">선호표상체계(VAK)</span>를
                  활용해 목표를 다감각적 정보로 코딩합니다. 뇌는 생생한 상상과
                  실제 경험을 구분하지 않으며, 이 원리를 통해 미래의 성취를
                  '이미 일어난 기억'으로 뇌세포에 각인시킵니다.
                </p>
              </div>
              <div className="space-y-3">
                <h5 className="text-cyan-400 font-bold flex items-center gap-2 italic">
                  03. Bio-Character Fusion
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  바꿀 수 없는 유전적{" "}
                  <span className="text-slate-200">기질(Temperament)</span>을
                  하드웨어로 인정하고, 살아오면서 형성된{" "}
                  <span className="text-slate-200">성격(Character)</span>이라는
                  소프트웨어에 최적화된 긍정심리학의{" "}
                  <span className="text-slate-200">BPS(최고의 미래 자아)</span>
                  라는 값을 입력합니다. 하드웨어 최적화와 소프트웨어
                  업그레이드가 동시에 진행되면서 최선의 방향이 설정됩니다.
                </p>
              </div>
              <div className="space-y-3">
                <h5 className="text-cyan-400 font-bold flex items-center gap-2 italic">
                  04. Neuropsychology
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200">헵의 법칙(Hebb’s Law)</span>
                  인 "함께 활성화된 뉴런은 함께 연결된다"는 원리에 기반합니다.
                  반복되는 Ledger 기록과 실행은 당신의 전두엽을 물리적으로
                  재구조화하여 새로운 정체성을 구축합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-black text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Sparkles size={18} /> I. The Worldview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A202C]/60 p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
              <div className="mb-6 bg-amber-500/10 w-14 h-14 rounded-full flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} className="text-amber-500" />
              </div>
              <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">
                존재적 상장 (Existential IPO)
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                "미래의 완성된 자아(Apex BP)가 현재의 나(The Vessel)를
                고용하다."
                <br />
                <br />
                기업이 미래 가치를 담보로 상장하듯, 당신은{" "}
                <span className="text-amber-500 font-bold">
                  최고의 미래 자아(Best Possible Self)
                </span>
                를 현 시점에 실현시킵니다. 이 계약을 통해 당신의 무의식은
                '고통스러운 노력'을 '가치 창출을 위한 자본금 납입'으로
                재정의하게 됩니다.
              </p>
            </div>
            <div className="bg-[#1A202C]/60 p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
              <div className="mb-6 bg-emerald-500/10 w-14 h-14 rounded-full flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <Brain size={24} className="text-emerald-500" />
              </div>
              <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">
                신경학적 각인 (Neuro-Imprinting)
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                "뇌는 생생한 상상과 실제 경험을 구분하지 않습니다."
                <br />
                <br />
                NLP의{" "}
                <span className="text-emerald-500 font-bold">
                  VAK(시각, 청각, 신체감각)
                </span>{" "}
                모델은 목표를 단순한 텍스트가 아닌 '감각적 체험'으로 변환합니다.
                AI가 설계한 몰입 시나리오는 미래를 '이미 일어난 기억(Future
                Memory)'으로 뇌에 물리적으로 각인시킵니다.
              </p>
            </div>
            <div className="bg-[#1A202C]/60 p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
              <div className="mb-6 bg-rose-500/10 w-14 h-14 rounded-full flex items-center justify-center border border-rose-500/30 group-hover:scale-110 transition-transform">
                <Activity size={24} className="text-rose-500" />
              </div>
              <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">
                에너지의 등가교환 (Energy Ledger)
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                이곳의 숫자는 단순한 화폐가 아닙니다. 그것은 당신이 세상에
                투입한{" "}
                <span className="text-rose-500 font-bold">
                  에너지의 총량(Magnitude)
                </span>
                입니다.
                <br />
                <br />
                물리학 법칙처럼, 투입된 에너지는 사라지지 않고 당신의 자아
                자산(Identity Asset)으로 보존됩니다. Ledger는 그 불멸의
                기록입니다.
              </p>
            </div>
            <div className="bg-[#1A202C]/60 p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
              <div className="mb-6 bg-purple-500/10 w-14 h-14 rounded-full flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                <User size={24} className="text-purple-500" />
              </div>
              <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">
                기질과 성품의 조화 (Bio-Character)
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                타고난 기질(Temperament)은 잘 바뀌지 않지만, 성품(Character)은
                조각할 수 있습니다.
                <br />
                <br />
                자신의 타고난 재료와 지금까지 성취한 자신(기질-Temperament와
                성격-Character)를 정확히 파악하고, 그 위에 BPS 성품을 덧입혀{" "}
                <span className="text-purple-500 font-bold">
                  대체 불가능한 정체성
                </span>
                을 건축하십시오.
              </p>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-black text-amber-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Zap size={18} /> II. Operational Protocol
          </h3>
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-12 pb-4">
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-slate-600 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                01
              </div>
              <div className="bg-[#1A202C]/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Settings size={18} className="text-slate-400" />
                  <h4 className="text-lg font-black text-white uppercase">
                    Initialize Identity (My Lab)
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">My Lab</span> 탭에서
                  시작하십시오. 당신의 이름(Vessel), 타고난 기질(TCI), 감각
                  선호도(VAK), 그리고 미래 자아의 성품(BPS Traits)을 정의하여
                  시스템의 기초 데이터를 입력합니다.
                </p>
              </div>
            </div>
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-slate-600 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                02
              </div>
              <div className="bg-[#1A202C]/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <PenTool size={18} className="text-amber-500" />
                  <h4 className="text-lg font-black text-white uppercase">
                    Sign The Covenant (contract)
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Contract</span> 탭으로
                  이동하여 서약서에 서명하십시오. 이는 시스템을 활성화하는
                  유일한 열쇠(Key)입니다. 서명하는 순간, 당신의 시간과 노력은
                  공식적인 가치로 인정받기 시작합니다.
                </p>
              </div>
            </div>
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-slate-600 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                03
              </div>
              <div className="bg-[#1A202C]/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Home size={18} className="text-emerald-500" />
                  <h4 className="text-lg font-black text-white uppercase">
                    Execute & Deposit (Ledger)
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  메인 화면인{" "}
                  <span className="text-white font-bold">Ledger</span>에서 5단계
                  피라미드 목표를 설정하고, 매일의 실행을 체크하십시오.{" "}
                  <span className="text-emerald-500 font-bold">[Execute]</span>{" "}
                  버튼을 누르면 그 행동의 가치가 즉시 당신의 자산으로
                  입금됩니다.
                </p>
              </div>
            </div>
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-slate-600 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                04
              </div>
              <div className="bg-[#1A202C]/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart2 size={18} className="text-rose-500" />
                  <h4 className="text-lg font-black text-white uppercase">
                    Analyze Trajectory (Stream)
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-white font-bold">Stream</span> 탭에서
                  당신의 성장이 만들어내는 곡선을 확인하십시오. 단순한 숫자가
                  아닌, 목표를 향해 나아가는 에너지의 궤적(Trajectory)을
                  시각적으로 모니터링할 수 있습니다.
                </p>
              </div>
            </div>
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-slate-600 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                05
              </div>
              <div className="bg-[#1A202C]/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy size={18} className="text-amber-400" />
                  <h4 className="text-lg font-black text-white uppercase">
                    Archive Legacy (Milestone)
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  목표 자산이 100% 충전되면 해당 비전은 현실이 됩니다.{" "}
                  <span className="text-white font-bold">Milestone</span> 탭은
                  당신이 현실로 소환해낸 업적들을 영원히 기록하는 명예의
                  전당입니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans overflow-hidden flex flex-col selection:bg-amber-500/30">
      <style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css'); * { font-family: 'Pretendard', sans-serif; letter-spacing: -0.02em; } .animate-fadeIn { animation: fadeIn 0.8s ease-out; } .animate-spin-slow { animation: spin 20s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

{/* 헤더 */}
      <header className="flex justify-between items-start md:items-center mb-8 px-4 max-w-7xl mx-auto w-full shrink-0 pt-4">
        {/* ▼▼▼ 여기를 수정했습니다 (클릭하면 홈으로 이동) ▼▼▼ */}
        <div 
          onClick={() => setCurrentView("hub")} 
          className="cursor-pointer group"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase leading-none group-hover:opacity-80 transition-opacity">
            THE <span className="text-amber-500">PULSE</span>
          </h1>
          <p className="text-[10px] text-slate-600 font-bold mt-2 uppercase tracking-[0.4em]">
            milestones.today
          </p>
        </div>
        {/* ▲▲▲ 여기까지 수정했습니다 ▲▲▲ */}

        {currentView !== "philosophy" && (
          <div className="text-right flex flex-col items-end gap-2 animate-fadeIn">
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-amber-500 font-black uppercase mb-0.5 tracking-widest flex items-center gap-1">
                <Sparkles size={10} /> Accumulated Magnitude
              </p>
              <div className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <span className="text-amber-500 mr-1 text-2xl">+</span>
                {currency}
                {fNum(currentAsset - annualIncome)}
              </div>
            </div>

            {/* 프로그레스 바 & 로그인 이름표 */}
            <div className="mt-1 w-48 md:w-64 relative">
              <div className="flex justify-between items-end mb-1">
                <span
                  className={`text-[9px] font-black italic ${
                    user ? "text-amber-500" : "text-slate-600"
                  }`}
                >
                  {((currentAsset / mbGoalAmount) * 100).toFixed(1)}%
                </span>
                <span className="text-[8px] text-amber-600 font-bold uppercase tracking-tighter">
                  GOAL: {currency}
                  {fNum(mbGoalAmount)}
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-900/80 rounded-full overflow-visible border border-white/5 shadow-inner relative">
                <div
                  className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)] relative ${
                    user
                      ? "bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400"
                      : "bg-slate-700 grayscale opacity-50"
                  }`}
                  style={{
                    width: `${Math.min(
                      (currentAsset / mbGoalAmount) * 100,
                      100
                    )}%`,
                  }}
                >
                  {/* 로그인 상태 이름표 */}
                  {user && (
                    <div className="absolute -right-1 -top-6 flex flex-col items-center animate-fadeIn">
                      <div className="bg-emerald-500 text-[8px] font-black text-slate-950 px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg border border-emerald-400 animate-pulse">
                        {userName || "USER"} ONLINE
                      </div>
                      <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-emerald-500 mt-0.5"></div>
                    </div>
                  )}
                  {user && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 메인 뷰 */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {currentView === "hub" && renderHub()}
        {currentView === "contract" && renderContract()}
        {currentView === "analysis" && renderAnalysis()}
        {currentView === "lab" && renderLab()}
        {currentView === "philosophy" && renderPhilosophy()}
        {currentView === "archive" && (
          <div className="flex-grow w-full max-w-5xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 text-center md:text-left animate-fadeIn">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <Trophy className="text-amber-500" size={40} />
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                  Manifested Milestones
                </h2>
              </div>
              <button
                onClick={() => setCurrentView("trash")}
                className="text-slate-600 hover:text-rose-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                <Trash size={14} /> Trash
              </button>
            </div>
            {archivedVisions.length === 0 ? (
              <div className="text-center py-32 opacity-10 italic font-medium uppercase tracking-[0.5em] text-2xl font-serif">
                Void of Manifestation
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {archivedVisions.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#2D3748]/40 p-8 rounded-[3rem] border border-amber-500/20 flex gap-6 items-center shadow-2xl animate-fadeIn hover:bg-slate-900/60 transition-all cursor-default"
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <div className="text-left">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                        {levelMap[item.level]} | {item.date}{" "}
                        {item.bonus === "IPO" ? "🏆 GLOBAL IPO" : "🏅 EARLY"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {currentView === "trash" && (
          <div className="flex-grow w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar pb-24 px-4 animate-fadeIn">
            <div className="flex items-center gap-4 mb-12">
              <Trash className="text-rose-500" size={40} />
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter text-rose-500">
                Trash Bin
              </h2>
            </div>  
            {trashVisions.length === 0 ? (
              <div className="text-center py-32 opacity-20 italic font-serif">
                The Void is empty.
              </div>
            ) : (
              trashVisions.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#1A202C]/40 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center mb-4 transition-all hover:bg-rose-500/5"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-3xl">{item.emoji}</span>
                    <div>
                      <h4 className="text-lg font-bold text-slate-300">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-600 uppercase font-black">
                        {levelMap[item.level]}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setVisions({ ...visions, [item.level]: item });
                        setTrashVisions(
                          trashVisions.filter((_, idx) => idx !== i)
                        );
                        showToast("Potential Restored.");
                      }}
                      className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500/20 transition-all shadow-lg"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setTrashVisions(
                          trashVisions.filter((_, idx) => idx !== i)
                        );
                        showToast("Permanently Purged.");
                      }}
                      className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all shadow-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => setCurrentView("archive")}
              className="mt-8 text-xs font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center gap-2"
            >
              ← Return to Milestones
            </button>
          </div>
        )}
      </div>

{/* 하단 네비게이션 (Floating 적용 완료) */}
{/* 하단 네비게이션 (Ledger를 맨 앞으로 이동!) */}
      <footer className="fixed bottom-6 left-0 right-0 z-[1000] px-4 animate-fadeIn">
        <nav className="max-w-xl mx-auto flex justify-between md:justify-around items-center bg-[#0A0F1E]/90 backdrop-blur-xl rounded-full py-3 px-3 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar gap-1">
          
          {/* 1. Ledger (홈) - 맨 앞으로 이동 완료! */}
          <NavBtn
            active={currentView === "hub"}
            onClick={() => setCurrentView("hub")}
            icon={<Home size={24} className="md:w-7 md:h-7" />}
            label="Ledger"
          />

          {/* 2. My Lab */}
          <NavBtn
            active={currentView === "lab"}
            onClick={() => setCurrentView("lab")}
            icon={<Settings size={20} className="md:w-6 md:h-6" />}
            label="My Lab"
          />

          {/* 3. Contract */}
          <NavBtn
            active={currentView === "contract"}
            onClick={() => setCurrentView("contract")}
            icon={<PenTool size={20} className="md:w-6 md:h-6" />}
            label="Contract"
          />

          {/* 4. Stream */}
          <NavBtn
            active={currentView === "analysis"}
            onClick={() => setCurrentView("analysis")}
            icon={<BarChart2 size={20} className="md:w-6 md:h-6" />}
            label="Stream"
          />

          {/* 5. Milestone */}
          <NavBtn
            active={currentView === "archive"}
            onClick={() => setCurrentView("archive")}
            icon={<Trophy size={20} className="md:w-6 md:h-6" />}
            label="Milestone"
          />

          {/* 6. Philosophy */}
          <NavBtn
            active={currentView === "philosophy"}
            onClick={() => setCurrentView("philosophy")}
            icon={<BookOpen size={20} className="md:w-6 md:h-6" />}
            label="Philosophy"
          />
        </nav>
      </footer>

      {isSensoryModalOpen && activeSensory && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[9999] flex items-center justify-center p-6 overflow-y-auto font-sans">
          <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[4rem] p-12 my-auto relative shadow-2xl border-double">
            <button
              onClick={() => setIsSensoryModalOpen(false)}
              className="absolute top-12 right-12 text-slate-700 hover:text-white transition-all z-50"
            >
              <X size={36} />
            </button>
            <div className="text-center mb-12">
              <span className="text-9xl block mb-6 drop-shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-pulse">
                {activeSensory.emoji}
              </span>
              <h4 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
                {activeSensory.title}
              </h4>
            </div>
            <div className="space-y-6 mb-12">
              <SensoryItem
                label="The Vision (V)"
                color="amber"
                val={activeSensory.v}
              />
              <SensoryItem
                label="The Echo (A)"
                color="emerald"
                val={activeSensory.a}
              />
              <SensoryItem
                label="The Sensation (K)"
                color="rose"
                val={activeSensory.k}
              />
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setIsSensoryModalOpen(false);
                  setCurrentView("lab");
                }}
                className="w-full bg-white/5 border border-white/10 text-white font-black py-6 rounded-[2.5rem] hover:bg-white/10 transition-all uppercase tracking-[0.3em] text-xs font-bold"
              >
                Architect Vision Settings
              </button>
              <button
                onClick={() => archiveVision(activeSensory.level)}
                className={`w-full font-black py-6 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-3 ${
                  activeSensory.progressAsset >= mbGoalAmount / 5
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-slate-800 text-slate-500 opacity-60"
                }`}
              >
                <CheckCircle size={20} /> Real-World IPO Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[500] flex items-center justify-center p-6 text-center animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[4rem] p-16 shadow-2xl">
            <div className="text-8xl mb-8">🔮</div>
            <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-widest italic font-serif">
              Potential Undefined
            </h4>
            <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">
              BP {userName}의 미래 기억이 아직 설계되지 않았습니다.
              <br />
              마이 랩(My Lab)으로 이동하여 비전을 설계하고
              <br />
              기본 달성률 50%를 확보하십시오.
            </p>
            <button
              onClick={() => {
                setIsAiModalOpen(false);
                setCurrentView("lab");
              }}
              className="w-full bg-emerald-600 text-white font-black py-6 rounded-3xl text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all mb-4"
            >
              Initialize Design
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
