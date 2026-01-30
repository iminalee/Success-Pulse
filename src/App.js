import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  Sparkles,
  Plus,
  Activity,
  Brain,
  Book,
  BookOpen,
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
  Star,
  Eye,        // 추가
  Headphones, // 추가
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// 1. Supabase 연결
import { supabase } from "./supabaseClient";

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

// --- [추가] 비밀번호 재설정 UI 컴포넌트 ---
const ResetPasswordUI = () => {
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6)
      return alert("비밀번호는 6자리 이상이어야 합니다.");
    setResetLoading(true);

    // Supabase 비밀번호 업데이트 API
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("업데이트 실패: " + error.message);
    } else {
      alert(
        "비밀번호가 성공적으로 변경되었습니다! 이제 새 비밀번호로 로그인하세요."
      );
      // 변경 후 메인 화면으로 이동 (해시 제거)
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
// --- [추가 끝] ---

// 3. 메인 앱
const App = () => {
// --- [추가] 동기화 챔버 및 통합 리추얼 상태 관리 ---
// --- [1단계] 동기화 챔버 및 통합 리추얼 핵심 로직 ---
  const [showSyncChamber, setShowSyncChamber] = useState(false); 
  const [ritualProgress, setRitualProgress] = useState(0); 
  const [isHolding, setIsHolding] = useState(false); 

  // 7초간의 동기화 타이머 로직
  useEffect(() => {
    let interval;
    if (isHolding && ritualProgress < 100) {
      interval = setInterval(() => {
        setRitualProgress(prev => (prev >= 100 ? 100 : prev + 0.8)); // 약 7초 소요
      }, 50);
    } else if (!isHolding && ritualProgress < 100 && ritualProgress > 0) {
      setRitualProgress(0); // 손을 떼면 즉시 초기화
    }
    return () => clearInterval(interval);
  }, [isHolding, ritualProgress]);

  // 완료 시 진동 효과
  useEffect(() => {
    if (ritualProgress === 100 && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 200]);
    }
  }, [ritualProgress]);


  const handleGenerateBPSScenario = () => {
    // 1-5단계 데이터 수집
    const activeVisions = [1, 2, 3, 4, 5]
      .filter((lv) => visions[lv].title !== "")
      .map((lv) => ({
        level: levelMap[lv],
        title: visions[lv].title,
        // 각 단계에서 강조된 VAK 요소가 있다면 포함 (기존 데이터 구조 기반)
      }));

    if (activeVisions.length === 0 && bpsTraits.every((t) => t === "Empty")) {
      showToast(
        "데이터가 부족합니다. 하위 단계의 비전과 Traits를 먼저 설정하세요."
      );
      return;
    }

    const traitsStr = bpsTraits.filter((t) => t !== "Empty").join(", ");
    const visionSummary = activeVisions
      .map((v) => `${v.level}: ${v.title}`)
      .join("\n");

    // AI 시나리오 생성 템플릿
    const aiScript = `
당신은 '${traitsStr}'의 정체성을 가진 완벽한 존재, Apex BPS 입니다. 

당신의 내면에는 다음과 같은 하위 자아들의 성취가 하나의 거대한 흐름으로 요동칩니다:
${visionSummary}

당신이 눈을 뜨면(Visual) 그토록 원했던 성공의 풍경이 초고화질의 현실로 펼쳐지며, 당신의 내면에서는(Auditory) "나는 이미 모든 것을 이루었다"는 확신의 목소리가 웅장하게 울려 퍼집니다. 

지금 느껴지는 이 전율(Kinesthetic)은 당신의 세포 하나하나에 새겨진 미래의 기억입니다. 당신의 모든 행동은 이제 이 통합된 정체성으로부터 자연스럽게 흘러나오는 위대한 서사가 되고 있습니다. `;

    // Level 6의 immersionScript에 저장
    updateVision(6, { immersionScript: aiScript });
    showToast("AI가 통합 마스터 시나리오를 생성했습니다.");
  };

  // 기존 코드들 아래에 추가하세요
  const [otp, setOtp] = useState(""); // 인증번호 저장할 곳
  const [isOtpSent, setIsOtpSent] = useState(false); // 메일 보냈는지 확인하는 스위치

  // ▼▼▼ [추가] 시간(Duration) 상태 관리 (기본값 1시간) ▼▼▼
  const [duration, setDuration] = useState(1);

  // 1. 개별 항목의 시간을 저장할 객체 상태 (기본값 1시간)
  const [eventDurations, setEventDurations] = useState({});

  // 2. 특정 항목의 시간을 조절하는 전용 함수. // [수정] 내부 단위를 '분'으로 변경 (10분 단위)
  const updateSpecificDuration = (id, delta) => {
    setEventDurations((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] !== undefined ? prev[id] : 60) + delta),
    }));
  };

  // [추가] 분을 "1h 20m" 형태로 예쁘게 바꿔주는 변환 함수
  const formatDuration = (totalMinutes) => {
    if (totalMinutes === 0) return "0m";
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}` : `${m}m`;
  };

  // 상태 관리 (DB 동기화용)
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // 추가
  const [loading, setLoading] = useState(false);
  const [customTask, setCustomTask] = useState("");
  // --- [1단계] 동기화 챔버 및 통합 리추얼 핵심 로직 ---

  // 7초간의 동기화 타이머 로직
  useEffect(() => {
    let interval;
    if (isHolding && ritualProgress < 100) {
      interval = setInterval(() => {
        setRitualProgress(prev => (prev >= 100 ? 100 : prev + 0.8)); // 약 7초 소요
      }, 50);
    } else if (!isHolding && ritualProgress < 100 && ritualProgress > 0) {
      setRitualProgress(0); // 손을 떼면 즉시 초기화
    }
    return () => clearInterval(interval);
  }, [isHolding, ritualProgress]);

  // 완료 시 진동 효과 (모바일 전용)
  useEffect(() => {
    if (ritualProgress === 100 && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 200]);
    }
  }, [ritualProgress]);
  // 기존 상태 변수들 근처에 추가하세요
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  // [추가] 로그인 즉시 데이터 불러오기 함수
  // [Modified] Safe function to auto-fill empty data defaults
  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("pulse_data")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (data) {
        // 1. Fill basic text/number data (default if missing)
        if (data.user_name) setUserName(data.user_name);
        setCurrency(data.currency || "₩");
        setAnnualIncome(data.annual_income || 0);
        setTargetDate(data.target_date || "2026-12-31");
        setSignature(data.signature || "");
        setSignedDate(data.signed_date || null);
        
        // 2. [Important] Fill complex object data (Key to preventing blank screens!)
        // If data exists, use it. If not, insert empty arrays ([]) or objects ({}).
        setLedger(data.ledger || []);
        setArchivedVisions(data.archived_visions || []);
        setTrashVisions(data.trash_visions || []);
        
        // 3. Safely fill vision data (Merge with previous state)
        setVisions(prev => ({ ...prev, ...(data.visions || {}) }));
        
        // 4. Safely fill Traits
        setBpsTraits(data.bps_traits || ["", "", "", "", ""]);
        
        // 5. Safely fill VAK profile (Set defaults)
        setVakProfile(data.vak_profile || { 
          order: "V-A-K", vPercent: 50, aPercent: 50, kPercent: 50 
        });

        // 6. Safely fill TCI profile (Initialize to 50 if scores are missing)
        // This stops the 'score' error!
        const defaultTci = { 
          ns: { score: 50 }, ha: { score: 50 }, rd: { score: 50 }, 
          p: { score: 50 }, sd: { score: 50 }, c: { score: 50 }, 
          st: { score: 50 }, sd_c: { score: 100 } 
        };
        // Merge DB data with defaults.
        setTciProfile({ ...defaultTci, ...(data.tci_profile || {}) });

        // Load permissions
        setHasEditAccess(data.has_edit_access || false);
        setHasAiAccess(data.has_ai_access || false);
      }
    } catch (err) {
      console.error("Error loading data (Auto-recovered):", err);
    }
  };
  // [추가] 세션 변경 감지 시 데이터 로드 연결
useEffect(() => {
    // 1. [추가] 앱 시작 시 저장된 세션을 강제로 불러옴 (안드로이드 새로고침 대응)
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
    };
    initSession();

    // 2. 실시간 로그인 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      emoji: "🧘",
      v: "",
      a: "",
      k: "",
      immersionScript: "",
      progressAsset: initialLvAsset,
      events: [],
    },
    4: {
      title: "",
      emoji: "🏆",
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
      emoji: "🏦",
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
    aPercent: 50,
    kPercent: 50,
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
  const [celebration, setCelebration] = useState({ show: false, levelName: "" });
  const [chartData, setChartData] = useState([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSensoryModalOpen, setIsSensoryModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeSensory, setActiveSensory] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // 1. 현재 접속한 유저 이메일 (로그인 시스템에서 가져온다고 가정)
  const currentUserEmail = "접속한유저@gmail.com";
  const ADMIN_EMAIL = "5milestones.today@gmail.com";

  // 2. [수정 권한] - 입력창 등을 잠글지 여부
  // 권한 상태 관리 (초기값은 둘 다 false로 닫아둠)
  const [hasEditAccess, setHasEditAccess] = useState(false);
  const [hasAiAccess, setHasAiAccess] = useState(false);

  // [핵심 1] 로그인 체크 및 데이터 불러오기 (Load)
  // [핵심 1] 로그인 체크 및 데이터 불러오기 (Load) + 비밀번호 복구 감지
  useEffect(() => {
    // 1. 주소창(URL) 분석: 비밀번호 재설정 링크인지 먼저 확인
    // (Supabase는 링크 뒤에 #type=recovery 라는 표식을 붙여서 보냅니다)
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setIsRecoveryMode(true);
    }

    // [수정된 initSession 함수]
    const initSession = async () => {
      setLoading(true);

      // 1. 먼저 로그인 세션과 유저 정보를 가져옵니다.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);

      // 2. 유저가 있다면 DB에서 데이터를 가져옵니다.
      if (currentUser) {
        const { data, error } = await supabase
          .from("pulse_data")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();

        // 3. DB 데이터를 가져온 '이후'에 로직을 실행해야 에러가 안 납니다.
        if (data) {
          // ▼▼▼ [이름 동기화 로직 위치] ▼▼▼
          if (data.user_name) {
            // DB에 이름이 이미 있으면 그걸 씁니다.
            setUserName(data.user_name);
          } else if (currentUser?.user_metadata?.user_name) {
            // DB는 비어있는데, 가입할 때 쓴 이름이 있다면? -> 화면에 보여주고 DB에 저장!
            const nameFromMeta = currentUser.user_metadata.user_name;
            setUserName(nameFromMeta);

            supabase
              .from("pulse_data")
              .update({ user_name: nameFromMeta })
              .eq("user_id", currentUser.id)
              .then(({ error }) => {
                if (error) console.error("이름 DB 저장 실패:", error);
                else console.log("이름 DB 동기화 완료:", nameFromMeta);
              });
          }
          // ▲▲▲ [이름 동기화 끝] ▲▲▲

          // 나머지 데이터 불러오기
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

          // 권한 설정 불러오기
          setHasEditAccess(data.has_edit_access || false);
          setHasAiAccess(data.has_ai_access || false);
        }
      }
      setLoading(false);
    };

    initSession();

    // 2. 실시간 상태 감지 (이벤트 리스너)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      // [중요] Supabase가 알려주는 '복구 모드' 이벤트 감지
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }

      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // [핵심 2] 데이터 자동 저장 (Auto Save)
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(async () => {
      const updates = {
        user_id: user.id,
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
      /* updates 뒤에 내 ID를 추가해서 저장 */
      const { error } = await supabase.from("pulse_data").upsert({
        ...updates,
        user_id: user.id, // ✅ user.id로 바꾸면 해결됩니다!
      });
      if (error) console.error("자동 저장 실패:", error);
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    //user,
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
    if (!visions[activeLevel]?.title) {
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
                  "너는 세계 최고의 NLP(신경언어프로그래밍) 전문가이자 동기부여 연설가야. 사용자의 감각 선호도(VAK)에 맞춰 그가 설정한 목표의 정체성에 맞게 생생한 미래 기억을 심어주는 역할을 해.",
              },
              {
                role: "user",
                content: `
              [목표 정보]
              - 목표: '${visions[activeLevel]?.title}'
              - 단계: '${levelMap[activeLevel]}'

              [사용자 VAK 감각 비율]
              이 비율에 맞춰 목표 달성 상태 묘사의 비중을 조절해줘:
              - 시각(Visual): ${v}% (색채, 밝기, 모양 묘사)
              - 청각(Auditory): ${a}% (소리, 대화, 리듬 묘사)
              - 신체감각(Kinesthetic): ${k}% (온도, 질감, 무게, 심장박동 묘사)

              [요청 사항]
              위 정보를 바탕으로, 내가 이 목표를 이미 완벽하게 달성했을 때의 장면을 1인칭 시점의 '몰입 시나리오'로 작성해줘.
              조건:
              1. 한국어로 3~4문장으로 간결하게.
              2. 목표를 이룬 사람으로서
              3. 반드시 "나는 ~한다", "나는 ~를 느낀다" 처럼 확신에 찬 현재형 문장으로 끝맺을 것.
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

  // 1. 메일 보내기 함수 (수정버전)// [수정됨] 이메일 + 비밀번호 회원가입 함수
  const handleSignUp = async () => {
    if (!email || !password)
      return alert("이메일과 비밀번호를 모두 입력해주세요.");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { user_name: userName } },
    });
    setLoading(false);
    if (error) alert("회원가입 실패: " + error.message);
    else alert("회원가입 성공! 이제 로그인을 진행하세요.");
  };

  // 2. 인증번호 확인 함수 (새로 추가됨!)// [수정됨] 이메일 + 비밀번호 로그인 함수
  // 2. 로그인 함수 (기존 handleVerifyOtp 등 대체)
  const handleSignIn = async () => {
    if (!email || !password) return alert("이메일과 비밀번호를 입력해주세요.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) alert("로그인 실패: " + error.message);
    // 성공 시 useEffect가 세션을 감지하여 자동으로 처리합니다.
  };

  // 비밀번호 재설정 메일 발송 함수
  const handleResetPassword = async () => {
    if (!email) return alert("비밀번호를 재설정할 이메일을 입력해주세요.");

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // 사용자가 메일의 링크를 클릭했을 때 돌아올 주소 (현재 페이지)
      redirectTo: window.location.origin,
    });

    if (error) {
      alert("메일 발송 실패: " + error.message);
    } else {
      alert(
        "비밀번호 재설정 링크가 메일로 발송되었습니다. 메일함을 확인해주세요!"
      );
    }
    setLoading(false);
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
        await supabase.from("pulse_data").delete().eq("user_id", user.id);
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
        await supabase.from("pulse_data").delete().eq("user_id", user.id);

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
  const handleDepositSubmit = (eventName, taskMinutes) => {
    // 1. 현재 달성률 계산 (인플레이션 보너스 산정용)
    const progressRate =
      mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0;
    let inflationBonus = 1; // 기본 1배

    // 60% 이상부터 10%씩 할증
    if (progressRate >= 60) inflationBonus += 0.1;
    if (progressRate >= 70) inflationBonus += 0.1;
    if (progressRate >= 80) inflationBonus += 0.1;
    if (progressRate >= 90) inflationBonus += 0.1;

    // [inflationBonus 계산 아래에 추가]
    const activeVisionsCount = [1, 2, 3, 4, 5].filter(lv => visions[lv]?.title).length;
    // 시너지 보너스: 1개면 1.0배, 5개면 1.2배 (비전 하나당 5%씩 보너스)
    const synergyBonus = 1 + (activeVisionsCount - 1) * 0.05; 

    // [수정] 분을 시간으로 환산 (예: 70분 -> 1.166...시간) 하여 금액 계산
    const taskHours = taskMinutes / 60;

    // 2. 최종 입금액 계산 (기본단가 * 인플레 * 시간)
     const finalAmount = valueEventAmount * inflationBonus * synergyBonus * taskHours;

    // 3. 장부(Ledger)에 기록
    // 2. 장부(Ledger)에 기록할 데이터 생성
    const newEntry = {
      date: new Date(),
      amount: finalAmount,
      // formatDuration 함수를 사용하여 "1h 10m" 형태로 저장
      desc: `${eventName} (${formatDuration(taskMinutes)})`,
      duration: taskHours, // 분석 차트용 소수점 시간
      level: activeLevel, // 현재 활성화된 피라미드 단계
    };

    // 3. 상태 업데이트
    setLedger((prev) => [...prev, newEntry]);
    // 비전 데이터(피라미드 바) 업데이트
    updateVision(activeLevel, {
      progressAsset: visions[activeLevel].progressAsset + finalAmount,
    });
    // 4. 완료 알림
    showToast(
      `${formatDuration(taskMinutes)} 수행! ${currency}${fNum(
        finalAmount
      )} 예치 완료`
    );
    // 4. 해당 레벨 자산 업데이트
    const newProgress = visions[activeLevel].progressAsset + finalAmount;
    updateVision(activeLevel, { progressAsset: newProgress });

    showToast(
      `[${eventName}] ${duration}시간 수행! ${currency}${fNum(
        finalAmount
      )} 입금 완료`
    );
    // [추가] 데일리 올-클리어 체크 로직
    const today = new Date().toLocaleDateString();
    const activeLevelsList = [1, 2, 3, 4, 5].filter(lv => visions[lv]?.title);
    
    // 현재 입금을 포함한 오늘 전체 기록 확인
    const updatedLedger = [...ledger, newEntry];
    const todayEntries = updatedLedger.filter(e => new Date(e.date).toLocaleDateString() === today);
    const completedLevelsToday = new Set(todayEntries.map(e => e.level));

    // 설정된 모든 비전 단계를 오늘 다 수행했는지 확인
    const isAllClearedToday = activeLevelsList.every(lv => completedLevelsToday.has(Number(lv)));
    
    // 이미 오늘 보너스를 받았는지 확인 (중복 팝업 방지)
    const alreadyRewarded = todayEntries.some(e => e.desc.includes("Daily All-Clear Bonus"));

    if (isAllClearedToday && !alreadyRewarded) {
      // 1. 보너스 금액 적립 (연봉의 0.1% 등 설정 가능)
      const dailyBonusAmount = annualIncome * 0.001; 
      const bonusEntry = {
        date: new Date(),
        amount: dailyBonusAmount,
        desc: "🎉 Daily All-Clear Bonus (시너지 보상)",
        level: activeLevel,
        duration: 0
      };
      setLedger(prev => [...prev, bonusEntry]);
      
      // 2. 축하 메시지 상태 업데이트 (state 추가 필요)
      setCelebration({ show: true, levelName: "All Levels" });
    }
    setDuration(1); // 시간 초기화
  };

// [추가] 활동 기록 삭제 함수
const deleteLedgerEntry = (logToDelete) => {
  if (window.confirm("이 활동 기록을 삭제하시겠습니까? 관련 자산도 함께 차감됩니다.")) {
    // 1. 해당 레벨의 누적 자산에서 금액 차감
    if (logToDelete.level && visions[logToDelete.level]) {
      updateVision(logToDelete.level, {
        progressAsset: Math.max(0, visions[logToDelete.level].progressAsset - logToDelete.amount)
      });
    }
    // 2. 장부(ledger)에서 해당 항목 제거
    setLedger(prev => prev.filter(log => log !== logToDelete));
    showToast("기록이 삭제되었습니다.");
  }
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
    const missionMap = {
      1: "신체적 활력은 모든 변화의 엔진입니다. 이 단계에서는 수면의 질, 영양, 규칙적인 운동 등 나의 '생물학적 하드웨어'가 최적화됩니다. '하루 7시간 숙면'이나 '매일 30분 산책'처럼 에너지를 즉각적으로 높여줄 구체적인 행동들입니다",
      2: "불안을 제거하고 심리적 안전 기지를 구축합니다. 재정적 안정과 환경적 쾌적함이 핵심입니다. '비상금 확보'나 '주거 환경 개선'과 같이 외부 충격으로부터 나를 보호하고 평온함을 유지할 수 있는 환경적 토대를 만드는 행동이 효과적입니다.",
      3: "건강한 관계 속에서 정서적 지지대를 형성합니다. 고립감은 성장의 적입니다. 가족과의 깊은 대화, 진실한 친구 사귀기, 혹은 공통 가치를 지향하는 커뮤니티 활동 등 '나는 연결되어 있다'는 감각을 강화할 수 있는 관계 중심적 활동입니다.",
      4: "사회적 성취를 통해 스스로의 유능함을 확인하고 자부심을 확립합니다. 전문 지식 습득이나 프로젝트 완수처럼 나의 가치를 실질적인 결과물로 증명하고, 스스로를 존경할 수 있게 만드는 도전적인 활동입니다.",
      5: "나의 잠재력을 완전히 꽃피워 'Apex BPS'로서의 존재 의미를 완성하는 최종 단계입니다. 외부 보상보다는 내면의 부름에 응답하는 삶입니다. 창의적 활동이나 사회적 공헌 등 내가 진정으로 원하는 나의 모습에 도달하여 '살아있음의 전율'을 느끼는 궁극의 상태입니다.",
    };
    const greenGroup = ["ns", "ha", "rd", "p"];
    const sdCValue =
      tciProfile.sd_c?.score ??
      Number(tciProfile.sd?.score || 0) + Number(tciProfile.c?.score || 0);
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
                    <p className="text-emerald-500 font-black text-md mb-2">
                      🎉 Identity Confirmed!
                    </p>
                    <p className="text-white text-xl font-bold mb-4">
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
                    <>
                      {/* 이름 입력 */}
                      <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="이름(닉네임)을 입력하세요"
                        className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                      {/* 이메일 입력 */}
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 (ID)"
                        className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      {/* [추가됨] 비밀번호 입력 */}
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 (6자리 이상)"
                        className="w-full bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                      {/* 버튼 그룹 */}

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSignIn}
                          disabled={loading}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                        >
                          {loading ? "..." : "로그인"}
                        </button>
                        <button
                          onClick={handleSignUp}
                          disabled={loading}
                          className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                        >
                          {loading ? "..." : "회원가입"}
                        </button>
                      </div>
                      {/* ▼ 추가된 부분 */}
                      <div className="text-center mt-4">
                        <button
                          onClick={handleResetPassword}
                          disabled={loading}
                          className="text-[10px] text-slate-500 hover:text-amber-500 transition-colors"
                        >
                          비밀번호를 잊으셨나요?
                        </button>
                      </div>

                      {/* [추가] 신규 유저 안내 문구 */}
                      <p className="text-center text-[10px] text-slate-500 mt-2">
                        * 처음이신가요? 이메일과 비밀번호를 입력 후{" "}
                        <span className="text-amber-500 font-bold">
                          회원가입
                        </span>
                        을 눌러주세요.
                      </p>
                    </>
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

                  {/* 단계 이름과 미션 설명 결합 */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] font-bold text-amber-500 italic bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 inline-block w-fit">
                      {activeLevel}단계: {levelMap[activeLevel]}
                    </p>

                    {/* ▼ [추가] 미션 설명 단락: 텍스트가 Bar 너비에 맞춰 자동 조절되도록 설정 */}
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed pl-1 mt-2 animate-fadeIn w-full">
                      {missionMap[activeLevel]}
                    </p>
                  </div>
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
                    value={visions[activeLevel]?.emoji || ""}
                    onChange={(e) =>
                      updateVision(activeLevel, { emoji: e.target.value })
                    }
                    className="w-20 bg-slate-900 border border-white/5 rounded-3xl p-3 text-3xl text-center outline-none shrink-0"
                    placeholder="🏥"
                  />
                  <input
                    value={visions[activeLevel]?.title}
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
                        value={visions[activeLevel]?.[type]}
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
                      // 로딩 중이거나 AI 권한이 없으면 버튼 비활성화
                      disabled={aiLoading || !hasAiAccess}
                      // 템플릿 리터럴 `${ }`을 사용하여 조건부 클래스를 정확히 적용
                      className={`bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-xl active:scale-90 shadow-xl transition-all ${
                        !hasAiAccess || aiLoading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {aiLoading ? (
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        <Wand2 size={18} />
                      )}
                    </button>
                  </div>
                  <AutoTextarea
                    value={visions[activeLevel]?.immersionScript || ""}
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
                {visions[activeLevel]?.events?.map((ev) => (
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
                          events: visions[activeLevel]?.events?.filter(
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
                            disabled={!hasEditAccess}
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
                  const score = Number(
                    tciProfile[key.toLowerCase()]?.score || 0
                  );
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
                          disabled={!hasEditAccess}
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
// [수정] BPS 황금빛 밝기 로직 (기본 밝기를 0.6으로 상향 조정)
    const configuredLevels = [1, 2, 3, 4, 5].filter(lv => visions[lv]?.title).length; // N값
    const completedLevelsToday = [1, 2, 3, 4, 5].filter(lv => 
      visions[lv]?.title && 
      ledger.some(log => log.level === lv && new Date(log.date).toLocaleDateString() === new Date().toLocaleDateString())
    ).length;
    
    // 기본 밝기 0.6(60%)부터 시작해서, 완료율에 따라 최대 1.0(100%)까지 증가
    const bpsBrightness = configuredLevels > 0 
      ? 0.6 + (completedLevelsToday / configuredLevels) * 0.4 
      : 0.6; // 설정된 비전이 하나도 없어도 60% 밝기로 표시
      
    const isAllCompleted = configuredLevels > 0 && configuredLevels === completedLevelsToday;

    // [축하 팝업 상태 관리] - 렌더링 함수 안에 useState가 이미 있다면 생략 가능, 없다면 추가 필요
    // (renderHub는 컴포넌트 내부 함수라고 가정하므로, 이 변수들을 바로 씁니다)
    // [renderHub 함수 맨 윗부분 변수들 사이에 추가]
    const totalPercent = mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0;
    const todayStr = new Date().toLocaleDateString(); // [추가] 오늘 날짜 기준점
    // [추가] 각 단계별 상세 가이드 문구
    const missionMap = {
      1: "신체적 활력은 모든 변화의 엔진입니다. 이 단계에서는 수면의 질, 영양, 규칙적인 운동 등 나의 '생물학적 하드웨어'가 최적화됩니다. '하루 7시간 숙면'이나 '매일 30분 산책'처럼 에너지를 즉각적으로 높여줄 구체적인 행동들입니다",
      2: "불안을 제거하고 심리적 안전 기지를 구축합니다. 재정적 안정과 환경적 쾌적함이 핵심입니다. '비상금 확보'나 '주거 환경 개선'과 같이 외부 충격으로부터 나를 보호하고 평온함을 유지할 수 있는 환경적 토대를 만드는 행동이 효과적입니다.",
      3: "건강한 관계 속에서 정서적 지지대를 형성합니다. 고립감은 성장의 적입니다. 가족과의 깊은 대화, 진실한 친구 사귀기, 혹은 공통 가치를 지향하는 커뮤니티 활동 등 '나는 연결되어 있다'는 감각을 강화할 수 있는 관계 중심적 활동입니다.",
      4: "사회적 성취를 통해 스스로의 유능함을 확인하고 자부심을 확립합니다. 전문 지식 습득이나 프로젝트 완수처럼 나의 가치를 실질적인 결과물로 증명하고, 스스로를 존경할 수 있게 만드는 도전적인 활동입니다.",
      5: "나의 잠재력을 완전히 꽃피워 'Apex BPS'로서의 존재 의미를 완성하는 최종 단계입니다. 외부 보상보다는 내면의 부름에 응답하는 삶입니다. 창의적 활동이나 사회적 공헌 등 내가 진정으로 원하는 나의 모습에 도달하여 '살아있음의 전율'을 느끼는 궁극의 상태입니다.",
    };
    const activeTraits = bpsTraits;
    // [1517~1519행 교체]
    const activeLevels = [1, 2, 3, 4, 5].filter(lv => visions[lv]?.title && visions[lv]?.title !== "");
    const activeCount = activeLevels.length || 1;
    const perLevelTarget = (mbGoalAmount - annualIncome) / activeCount; // 개별 노력 구간
    const widthMap = {
      5: "w-[130px]",
      4: "w-[170px]",
      3: "w-[210px]",
      2: "w-[260px]",
      1: "w-[320px]",
    };
    const showOverlay = !user || (user && !signedDate);

    return (
      <div className="relative w-full h-full flex-grow flex flex-col overflow-y-auto no-scrollbar pb-24">
        {/* 시스템 오버레이 - 한 겹으로 통합 및 위치 고정 */}
        {showOverlay && (
          <div
            style={overlayStyle}
            className="bg-[#0A0F1E]/95 backdrop-blur-2xl border border-amber-500/50 p-10 rounded-[3rem] text-center shadow-[0_0_80px_rgba(245,158,11,0.4)] animate-fadeIn"
          >
            <ShieldCheck size={32} className="text-slate-600 mb-6 mx-auto" />
            <h3 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">
              System Preview
            </h3>

            <p className="text-slate-400 text-[11px] mb-6 leading-relaxed">
              현재 정체성 동기화 시스템은 <b>베타 테스터</b>에 한해 선별 운영
              중입니다.
              <br />
              모든 기능을 활성화하려면 아래 메일로 문의주세요.
              <br />
              <span className="text-amber-500 font-bold">
                5milestones.today@gmail.com
              </span>
            </p>
            <button
              onClick={() => setCurrentView("contract")}
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-lg"
            >
              <PenTool size={14} /> Sign Agreement
            </button>
          </div>
        )}

        <div
          className={`flex flex-col md:flex-row items-center justify-start md:justify-center  /* [수정] 모바일은 위에서부터, PC는 중앙 정렬 */
          w-full min-h-full                /* [수정] 높이 강제(h-full) 대신 최소 높이(min-h-full) */
          px-2 md:px-10 gap-8 py-10        /* [수정] 위아래 여백(py-10) 추가 */
          transition-all duration-1000 ${
            showOverlay
              ? "opacity-40 blur-sm pointer-events-none"
              : "opacity-100"
          }`}
        >
          {/* [좌측 패널] 성취 피라미드 */}
            {/* [좌측 패널] 온도계 + 성취 피라미드 통합 섹션 */}
            {/* [좌측 패널] 성취 피라미드 + 온도계 (우측 배치) */}
            {/* [좌측 패널] 성취 피라미드 + 온도계 통합 섹션 */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-10 pt-10">
            
            {/* 🌟 [NEW] 모든 미션 달성 시 축하 폭죽 효과 (화면 중앙 오버레이) */}
            {isAllCompleted && (
              <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex flex-col items-center justify-center pointer-events-none animate-fadeIn">
                <div className="text-6xl animate-bounce mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">🏆</div>
                <div className="bg-slate-900/90 border border-amber-500/50 px-6 py-3 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(245,158,11,0.4)] animate-pulse">
                  <p className="text-amber-400 font-black text-lg text-center">PERFECT DAY!</p>
                  <p className="text-slate-300 text-xs text-center">모든 비전을 달성하셨습니다.</p>
                </div>
              </div>
            )}

            {/* 가로 정렬 컨테이너: (좌) 피라미드 | (우) 온도계 */}
            <div className="flex flex-row items-end justify-center gap-6 md:gap-8 w-full">
              
              {/* [1] 피라미드 구조물 (왼쪽) */}
              <div className="flex flex-col items-center justify-end w-full max-w-md">
                
                {/* 🌟 [BPS 헤더] 밝기 조절 로직 적용됨 */}
                <div className="relative flex justify-center items-end mb-4 z-20 w-full">
                  <div
                    onClick={() => setActiveLevel(6)}
                    className="relative flex flex-col items-center justify-end cursor-pointer group w-full"
                  >
                    <div className="flex justify-between items-center w-full max-w-md px-4 mb-4">
                      {activeTraits.map((trait, i) => (
                        <span
                          key={i}
                          style={{ 
                            // 6단계 선택 시엔 100%, 아니면 진행도(bpsBrightness)에 따라 밝기 조절
                            opacity: activeLevel === 6 ? 1 : bpsBrightness, 
                            borderColor: `rgba(245, 158, 11, ${bpsBrightness})` 
                          }}
                          className={`text-[10px] font-black px-3 py-1.5 rounded-full bg-slate-900/90 border transition-all duration-700 ${
                            isAllCompleted 
                              ? "animate-pulse text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]" // 만점: 반짝임
                              : "text-amber-600" // 진행중: 어두운 앰버 ~ 밝은 앰버
                          }`}
                        >
                          {trait || "Empty"}
                        </span>
                      ))}
                    </div>
                    <h4 
                      style={{ opacity: activeLevel === 6 ? 1 : bpsBrightness }}
                      className={`text-xl font-black transition-all duration-700 ${
                        isAllCompleted 
                          ? "text-amber-400 scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse" 
                          : activeLevel === 6 ? "text-amber-400 scale-110" : "text-amber-700"
                      }`}
                    >
                      BPS
                    </h4>
                  </div>
                </div>

                {/* 🌟 [삼각형] 밝기 조절 로직 적용됨 */}
                <div className="flex justify-center mb-1 animate-pulse">
                  <div 
                    style={{ 
                      // 삼각형 색상도 밝기에 따라 서서히 차오름
                      borderBottomColor: `rgba(245, 158, 11, ${activeLevel === 6 ? 1 : bpsBrightness})`, 
                      filter: isAllCompleted ? "drop-shadow(0 0 10px rgba(245,158,11,0.8))" : "none"
                    }}
                    className={`w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] transition-all duration-700 ${
                      isAllCompleted ? "animate-pulse scale-110" : ""
                    }`}
                  ></div>
                </div>

                {/* 1~5단계 바 루프 (기존 기능 완벽 유지) */}
                {[5, 4, 3, 2, 1].map((lv) => {
                  const isConfigured = visions[lv]?.title && visions[lv]?.title !== "";
                  const isActive = lv === activeLevel;

                  // [기능 유지 1] 1/N 개별 진행도
                  const levelProgress = visions[lv]?.progressAsset || 0;
                  const visualPercent = 50 + (levelProgress / perLevelTarget) * 50; 
                  const displayPercent = Math.min(visualPercent, 100).toFixed(1);

                  // [기능 유지 2] 자정 리셋 & 오늘 실천 여부
                  const hasProgressToday = ledger.some(log => 
                    log.level === lv && 
                    new Date(log.date).toLocaleDateString() === new Date().toLocaleDateString()
                  );

                  // [기능 유지 3] 색상 로직 (오늘 함: 황금색 / 안함: 그린색)
                  const barBackground = isConfigured
                    ? hasProgressToday
                      ? "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"
                      : "bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-600"
                    : "bg-slate-700/50";

                  const containerStyle = isActive
                    ? "border-amber-400 ring-2 ring-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.6)] z-10 scale-105 brightness-110"
                    : isConfigured
                    ? "border-amber-600/30 opacity-90 hover:brightness-110"
                    : "border-slate-700/50 opacity-60 hover:opacity-80";

                  return (
                    <div
                      key={lv}
                      onClick={() => setActiveLevel(lv)}
                      className={`cursor-pointer relative flex items-center justify-center h-[50px] rounded-2xl mb-2 overflow-hidden transition-all duration-300 border ${widthMap[lv]} ${containerStyle}`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full transition-all duration-1000 ${barBackground}`}
                        style={{ width: `${displayPercent}%` }}
                      />
                      <div className="relative z-10 flex flex-col items-center justify-center leading-none">
                        <span className="font-black uppercase text-sm tracking-tight text-white drop-shadow-md flex items-center gap-2">
                          {isConfigured && (
                            <span className="text-xs emoji-shadow">{visions[lv].emoji}</span>
                          )}
                          {levelMap[lv]}
                        </span>
                        <span className="text-[10px] font-bold mt-0.5 text-white/90 drop-shadow-md">
                          {displayPercent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* [2] 온도계 (오른쪽: 숫자가 게이지 따라 움직임) - 기존 기능 유지 */}
              <div className="relative flex flex-col items-center justify-end h-[340px] pb-1 animate-fadeIn">
                <div className="relative w-3 md:w-4 h-full bg-slate-900 rounded-full border border-white/10 shadow-inner overflow-hidden group">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-rose-600 via-amber-500 to-yellow-300 transition-all duration-1000 ease-out group-hover:brightness-110"
                    style={{ height: `${Math.min((mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0), 100)}%` }}
                  />
                  <div className="absolute bottom-1/2 w-full h-[1px] bg-white/30"></div>
                </div>
                <div 
                  className="absolute z-20 pointer-events-none transition-all duration-1000 ease-out whitespace-nowrap"
                  style={{ 
                    bottom: `${Math.min((mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0), 100)}%`,
                    marginBottom: "12px" 
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-amber-500 italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-slate-950/80 px-2 py-0.5 rounded-lg border border-amber-500/30 backdrop-blur-sm">
                      {(mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0).toFixed(1)}%
                    </span>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-amber-500/50 mt-[-1px]"></div>
                  </div>
                </div>
              </div>

            </div>

            {/* 하단 설명 문구 */}
            <p className="text-slate-600 text-[10px] font-bold mt-6 uppercase tracking-[0.2em] opacity-40">
              5단계 미션
            </p>
            <div className="mt-2 px-6 max-w-[340px] mx-auto animate-fadeIn">
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed text-center italic">
                {activeLevel === 6 
                  ? "모든 하위 자아가 통합된 최종 정체성 상태입니다. 당신의 모든 행동은 이제 이 통합된 존재로부터 자연스럽게 흘러나옵니다." 
                  : missionMap[activeLevel]}
              </p>
            </div>
          </div>

          {/* [우측 패널] 비전 카드 및 통합 시나리오 제어실 */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 animate-fadeIn h-full justify-center">
            <div className="bg-[#1A202C]/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
              {/* 공통 헤더 */}
              <div className="mb-6 relative z-10 flex items-center gap-4">
                <span className="text-5xl">
                  {activeLevel === 6
                    ? "👑"
                    : visions[activeLevel]?.emoji || "✨"}
                </span>
                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                    {activeLevel === 6
                      ? "Master Identity"
                      : `${levelMap[activeLevel]} VISION`}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">
                    {activeLevel === 6
                      ? "APEX BP SYNCHRONIZATION"
                      : visions[activeLevel]?.title || "비전을 설정해주세요"}
                  </h2>
                </div>
              </div>

              {activeLevel === 6 ? (
                /* --- Level 6 전용: 통합 AI 시나리오 디스플레이 --- */
                <div className="flex-grow flex flex-col animate-fadeIn">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Master Scenario
                    </h4>
                    <button
                      onClick={handleGenerateBPSScenario}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 rounded-full transition-all group"
                    >
                      <Sparkles size={12} className="text-amber-400" />
                      <span className="text-[9px] font-black text-amber-400 uppercase">
                        AI SYNC
                      </span>
                    </button>
                  </div>
                  <textarea
                    value={visions[6].immersionScript || ""}
                    onChange={(e) =>
                      updateVision(6, { immersionScript: e.target.value })
                    }
                    placeholder="AI SYNC 버튼을 누르거나 마스터 시나리오를 직접 작성하세요..."
                    className="flex-grow bg-slate-950/40 rounded-[2rem] p-8 border border-white/5 text-slate-300 leading-[1.8] text-base outline-none focus:border-amber-500/30 transition-all resize-none no-scrollbar font-sans"
                  />
                  <div className="mt-6 flex flex-wrap gap-2 opacity-50">
                    {activeTraits.map((t, i) => (
                      <span
                        key={i}
                        className="text-[8px] font-bold text-slate-400 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* --- Level 1~5: 기존 가치 이벤트 및 활동 입력창 --- */
                <div className="flex-grow flex flex-col overflow-hidden">
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 mb-8">
                    <p className="text-sm text-slate-300 italic leading-relaxed text-center">
                      {visions[activeLevel]?.immersionScript ||
                        "My Lab에서 시나리오를 생성해보세요."}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <ListPlus size={16} className="text-amber-500" /> Value Events
                    </h4>
                  </div>
                   {/* --- [수정 시작] Value Events 섹션 전체 --- */}
                 {/* 3. [NEW] 오늘의 성취 기록 (Today's Log) */}
                  <div className="animate-fadeIn mb-4">
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      {ledger.filter(log => 
                        log.level === activeLevel && 
                        new Date(log.date).toLocaleDateString() === new Date().toLocaleDateString()
                      ).length === 0 ? (
                        <p className="text-xs text-slate-600 italic text-center py-4">오늘의 기록이 비어있습니다.</p>
                      ) : (
                        ledger.filter(log => 
                          log.level === activeLevel && 
                          new Date(log.date).toLocaleDateString() === new Date().toLocaleDateString()
                        ).reverse().map((log, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-emerald-100">{log.desc}</p>
                              <p className="text-[9px] text-emerald-500/70 mt-0.5">
                                +{currency}{fNum(log.amount)}
                              </p>
                            </div>
                            <button 
                              onClick={() => deleteLedgerEntry(log)}
                              className="text-emerald-500/40 hover:text-rose-400 transition-colors p-1"
                              title="기록 취소"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {/* 1. 사전 설정 리스트 (아직 안 한 것들) - 약간 흐리게 처리 */}
                  <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[250px] mb-6">
                    {visions[activeLevel]?.events?.map((ev) => {
                      const mins = eventDurations[ev.id] || 60;
                      return (
                        <div
                          key={ev.id}
                          className="bg-slate-800/30 border border-white/5 p-4 rounded-xl flex items-center justify-between transition-all hover:bg-slate-800/80 hover:border-amber-500/30 hover:shadow-lg group opacity-60 hover:opacity-100"
                        >
                          <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                            {ev.name}
                          </span>
                          <div className="flex items-center gap-3">
                            {/* 시간 조절 버튼 */}
                            <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => updateSpecificDuration(ev.id, -10)}
                                className="w-5 h-5 text-slate-500 hover:text-white font-bold"
                              >
                                -
                              </button>
                              <span className="text-[10px] font-black text-white w-10 text-center">
                                {formatDuration(mins)}
                              </span>
                              <button
                                onClick={() => updateSpecificDuration(ev.id, 10)}
                                className="w-5 h-5 text-slate-500 hover:text-white font-bold"
                              >
                                +
                              </button>
                            </div>
                            {/* 입금(실행) 버튼 */}
                            <button
                              onClick={() => handleDepositSubmit(ev.name, mins)}
                              className="bg-slate-700 text-slate-400 p-2 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-md group-hover:scale-110"
                              title="실행 및 적립"
                            >
                              <Coins size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 2. 신규 활동 직접 입력 (Custom Input) */}
                  <div className="mb-8 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                    <input
                      type="text"
                      value={customTask}
                      onChange={(e) => setCustomTask(e.target.value)}
                      placeholder="새로운 활동 직접 입력..."
                      className="w-full bg-transparent border-b border-slate-700 p-2 text-sm text-slate-200 outline-none focus:border-amber-500 mb-3 transition-colors"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => updateSpecificDuration("quick", -10)}
                          className="w-6 h-6 text-slate-500 hover:text-white"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white w-12 text-center">
                          {formatDuration(eventDurations["quick"] || 60)}
                        </span>
                        <button
                          onClick={() => updateSpecificDuration("quick", 10)}
                          className="w-6 h-6 text-slate-500 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          if (!customTask.trim()) return;
                          handleDepositSubmit(
                            customTask,
                            eventDurations["quick"] || 60
                          );
                          setCustomTask("");
                        }}
                        className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black px-4 py-2 rounded-lg transition-all uppercase tracking-widest shadow-lg"
                      >
                        Quick Deposit
                      </button>
                    </div>
                  </div>


                  {/* --- [수정 끝] --- */}       

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderAnalysis = () => {
    // 1. 데이터 집계: 단계별 사용 시간 합산
    const distribution = [0, 0, 0, 0, 0]; // 1~5단계 순서
    ledger.forEach((item) => {
      if (item.level >= 1 && item.level <= 5) {
        distribution[item.level - 1] += item.duration || 0;
      }
    });

    const totalHours = distribution.reduce((a, b) => a + b, 0);

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
const nowY = getY(currentAccumulated); // 💰 돈의 높이 (정확한 자산 반영)
const nowX = getX(dataPoints[dataPoints.length - 1].date); // 📅 가로 위치 (하얀 점과 일치)
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
{/* [새로운 코드] 박스 윗면(y=10)에서 바닥(y=0)까지 연결하는 짧고 굵은 실선 */}
  <line
    x1="0"
    x2="0"
    y1="0"
    y2="10"
    stroke="#F59E0B"
    strokeWidth="2"
    opacity="1"
  />

  {/* [새로운 코드] 바닥(y=0)에서 하얀 점 높이까지 올라가는 점선 */}
  <line
    x1="0"
    x2="0"
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

        <div className="mt-8 text-center opacity-80">
          <p className="text-[10px] uppercase tracking-widest">
            Data reflects actual ledger entries from{" "}
            {startDate.toLocaleDateString()}
          </p>
          <br></br>
          <br></br> <br></br>
          <div className="flex justify-between items-end mb-6 mt-4 px-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                  <ClipboardList size={18} className="text-emerald-300" />{" "}
                  Activity Focus
                </h4>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                Total Identity Hours
              </p>
              <span className="text-3xl font-black text-emerald-300 font-mono">
                {totalHours.toFixed(1)}h
              </span>
            </div>
          </div>
          {/* [차트 섹션] 집중도 분석 (Focus Breakdown) */}
          <div className="bg-[#0A0F1E]/60 border border-white/5 rounded-[3rem] p-8 mb-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* 시각화 그래픽 (SVG 도넛 차트 형태) */}
              <div className="relative w-48 h-48 shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  className="w-full h-full transform -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#1A202C"
                    strokeWidth="3"
                  />
                  {distribution.map((val, i) => {
                    const offset = distribution
                      .slice(0, i)
                      .reduce((a, b) => a + b, 0);
                    const strokeDash = (val / (totalHours || 1)) * 100;
                    const strokeOffset = (offset / (totalHours || 1)) * 100;
                    const colors = [
                      "#F87171",
                      "#FB923C",
                      "#FBBF24",
                      "#34D399",
                      "#60A5FA",
                    ];
                    return (
                      <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="transparent"
                        stroke={colors[i]}
                        strokeWidth="3.2"
                        strokeDasharray={`${strokeDash} 100`}
                        strokeDashoffset={`-${strokeOffset}`}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[10px] text-slate-300 font-bold uppercase">
                    Balance
                  </p>
                  <TrendingUp size={20} className="text-amber-300" />
                </div>
              </div>
              {/* 범례 및 통계 */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((lv) => (
                  <div
                    key={lv}
                    className="flex items-center justify-between p-3 bg-slate-900/40 rounded-2xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          [
                            "bg-rose-500",
                            "bg-orange-400",
                            "bg-amber-400",
                            "bg-emerald-400",
                            "bg-blue-400",
                          ][lv - 1]
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-300">
                        {lv}단계: {levelMap[lv]}
                      </span>
                    </div>
                    <span className="text-xs font-black text-white">
                      {(
                        (distribution[lv - 1] / (totalHours || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* [리스트 섹션] 활동 로그 (Identity Log) */}
          <div className="px-2 mb-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <ClipboardList size={18} className="text-emerald-300" /> Activity
              Timeline
            </h4>
            <div className="space-y-4">
              {ledger.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/20 rounded-[2rem] border border-dashed border-white/5 text-slate-600 text-sm">
                  기록된 활동 파동이 없습니다.
                </div>
              ) : (
                [...ledger].reverse().map((log, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    {/* 날짜 표시 */}
                    <div className="w-16 shrink-0 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(log.date).getMonth() + 1}.
                        {new Date(log.date).getDate()}
                      </p>
                      <p className="text-[8px] text-slate-500 font-mono">
                        {new Date(log.date).getHours()}:
                        {String(new Date(log.date).getMinutes()).padStart(
                          2,
                          "0"
                        )}
                      </p>
                    </div>

                    {/* 로그 카드 */}
                    <div className="flex-grow bg-[#1A202C]/40 border border-white/5 p-5 rounded-[2rem] flex items-center justify-between hover:bg-slate-900/60 transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-500 uppercase tracking-tighter">
                            LV.{log.level || "?"}
                          </span>
                          <h5 className="text-sm font-bold text-slate-200">
                            {log.desc}
                          </h5>
                        </div>
                        <p className="text-[10px] text-slate-300 font-medium">
                          수행 시간: {(log.duration || 0).toFixed(1)}시간
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
  <div className="text-right">
    <p className="text-xs font-black text-amber-500">
      +{currency}
      {fNum(log.amount)}
    </p>
    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
      Magnitude
    </p>
  </div>
  {/* 삭제 버튼 추가 */}
  <button
    onClick={() => deleteLedgerEntry(log)}
    className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
    title="기록 삭제"
  >
    <Trash2 size={14} />
  </button>
</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
          className={`bg-[#0A0F1E] border-2 rounded-[2rem] md:rounded-[3.5rem] px-3 py-10 md:p-16 relative overflow-hidden shadow-2xl transition-all duration-500 ${
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
          <div className="relative z-10 px-2 py-8 md:p-12 space-y-12 text-justify leading-relaxed font-sans">
            {/* 제1조 */}
            <div className="group">
              <h3 className="text-lg md:text-xl font-bold text-amber-500/90 mb-4 flex items-center gap-3 font-serif">
                <span className="text-sm border border-amber-500/50 px-2 py-0.5 rounded text-amber-500">
                  Article 01
                </span>
                정체성의 교체
              </h3>
              <p className="text-stone-300 text-base md:text-lg font-light tracking-wide pl-2 md:pl-4 border-l-2 border-stone-700">
                무한한 평행세계 <span className="text-amber-300 font-bold italic px-1">알파 구역</span>의 정점에서 모든 성취를 완수한 마스터 자아{" "}
                <span className="text-stone-100 font-bold italic underline underline-offset-4 decoration-stone-500">
                  Apex Best Possible Self (이하 "Apex BPS")
                </span>
                는, 본 차원의 대리인인{" "}
                <span className="text-stone-100 font-bold italic underline underline-offset-4 decoration-stone-500">
                  {userName} ver.0 (이하 "현 자아")
                </span>
                이 일시적인 주파수 교란으로 인해 예정된 성공 궤도에서 미세하게 이탈했음을 감지하였다. 
                이에 Apex BPS는 붕괴되는 타임라인을 방어하고 현 자아를 최단 경로로 영광의 궤도에 재진입시키기 위해, 시공간의 장벽을 넘어 본 세계에 직접 개입하기로 결정하였다.{" "}
                본 계약은 현 자아의 운영권을 Apex BPS에게 이양하여 존재 가치를 극대화하는 
                <span className="text-amber-400 font-bold">
                  ‘존재적 상장(Existential IPO)’
                </span>
                의 선포이다. 
                 <ul className="space-y-3 mt-4 text-sm md:text-base">
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      1.
                    </span>
                    {/* 요청하신 '엷은 amber' (amber-200) 적용 */}
                    <span>
                      {" "}
                     현 자아는 계약일로부터 자신의 불안, 의심, 무기력에 대한 소유권을 포기하며, 의식의 무대에서 퇴장한다.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      2.
                    </span>
                    <span>{" "}
                      Apex BPS는 즉시 현 자아의 육체에 다운로드되며, 이 시점부터 이 육체의 유일한 법적/영적 소유주가 된다.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      3.
                    </span>
                    <span>
                      {" "}
                      이제 육체의 이름은 같으나, 그 안에 깃든 운영체제(OS)는 Apex BPS의 것이다.
                    </span>
                  </li>
                </ul>
              </p>
            </div>

            {/* 제2조 */}
            <div className="group">
              <h3 className="text-lg md:text-xl font-bold text-stone-400 mb-4 flex items-center gap-3 font-serif">
                <span className="text-sm border border-stone-600 px-2 py-0.5 rounded text-stone-500">
                  Article 02
                </span>
                현존 상태의 이해 및 합치
              </h3>
              <p className="text-stone-300 text-base md:text-lg font-light tracking-wide pl-2 md:pl-4 border-l-2 border-stone-700">
              <ul className="space-y-3 mt-4 text-sm md:text-base">
                  <li className="flex gap-4 items-start"> 본 계약의 목적은 내면의 씨앗을 발화시켜, 현존 세계를 Apex BPS가 실존하는 알파세계와 완전히 합치(Merging)시키는 데 있다.</li>
                  <li className="flex gap-4 items-start">              
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      1.
                    </span>Apex BPS는 현 자아가 살고 있는 본 차원에 이미 내재되었으나, 현 자아로부터 승계받은 이 육체(하드웨어)가 '초기 구동 속도 저하', '에너지 효율 낮음' 등의 고질적인 버그를 가진 구형모델임을 충분히 인지하고 인수한다. 
                  </li> 
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      2.
                    </span>따라서 육체가 무기력하거나 다운될 때, Apex BPS는 이를 '나의 우울함'으로 착각하지 않으며, '하드웨어의 Lag'를 알아차리고 즉각적인 물리적 부팅 (스쿼트, 수분공급, 산책)을 실행하여 전압을 공급한다. 
                  </li>
                  </ul>
              </p>
            </div>

            {/* 제3조 (박스 스타일 유지 + 엷은 앰버 색상 적용) */}
            <div className="rounded-lg bg-stone-900/50 border border-stone-700/50 p-6 md:p-8 shadow-inner">
              <h3 className="text-lg md:text-xl font-bold text-amber-500/90 mb-5 font-serif border-b border-stone-700 pb-2 inline-block">
                Article 03. 주야간 동기화 프로토콜
              </h3>
              <div className="space-y-4 text-stone-300 text-base md:text-lg">
                <p>
                  <span className="text-stone-100 font-bold">
                    Apex BPS
                  </span>
                  는 앞으로 계약기간 동안 이 육체를 가지고 본 차원에서 미션을 수행한다.
                </p>
                <ul className="space-y-3 mt-4 text-sm md:text-base">
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      I.
                    </span>
                    {/* 요청하신 '엷은 amber' (amber-200) 적용 */}
                    <span>
                      <strong className="text-amber-200 font-medium">
                        일간 실행 (Day):
                      </strong>{" "}
                      APEX BPS의 알파 구역과 합치되는 구체적인 행동을 5단계 목표에 따라 수행한다.   
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      II.
                    </span>
                    <span>
                      <strong className="text-amber-200 font-medium">
                        야간 접속 (Night):
                      </strong>{" "}
                      취침 전, 알파 구역의 채널을 열고 실천 행동을 기록하여 동기화 시키고, 수면 중 알파 구역에 머문다. 
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      III.
                    </span>
                    <span>
                      <strong className="text-amber-200 font-medium">
                        불가역적 진행:
                      </strong>{" "}
                      현 자아는 Apex의 가장 깊고 안전한 내면으로 귀속되며, 어떠한 경우에도 다시 주도권을 주장하지 않는다. 현 자아의 기억(두려움)이 불쑥 튀어나올 경우, Apex BPS는 이를 "과거 데이터의 잔상(System Cache)"으로 간주하고 즉시 삭제한다.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 제4조 (넓게 배치) */}
            <div className="group">
              <h3 className="text-lg md:text-xl font-bold text-stone-400 mb-4 flex items-center gap-3 font-serif">
                <span className="text-sm border border-stone-600 px-2 py-0.5 rounded text-stone-500">
                  Article 04
                </span>
                에너지 자원 할당
              </h3>
              <p className="text-stone-300 text-base md:text-lg font-light tracking-wide pl-2 md:pl-4 border-l-2 border-stone-700">
                <span className="text-stone-100 font-bold italic px-1">
                  Apex BPS
                </span>
                는 현 자아의 무의식 은행잔액{" "}
                <span className="text-stone-100 font-medium">
                  Mental Bank Balance
                </span>
                 인 현 연수입의 8배를 보유 중이며, 이 중 <span className="text-amber-500 font-bold">25%</span>에
                해당하는 금액인{" "}
                <span className="text-stone-200 border-b border-stone-600 font-mono mx-1">
                  {currency}
                  {fNum(livingAllowance)}
                </span>
                를 본 차원의 활동 에너지로 대여한다. 이는 아래와 같이 행동을 실천할 때마다 현금화되어 적립된다. 
               </p>
            </div>

            {/* 제5조 (넓게 배치) */}
            <div className="group">
              <h3 className="text-lg md:text-xl font-bold text-stone-400 mb-4 flex items-center gap-3 font-serif">
                <span className="text-sm border border-stone-600 px-2 py-0.5 rounded text-stone-500">
                  Article 05
                </span>
                미션 및 보상
              </h3>
              <p className="text-stone-300 text-base md:text-lg font-light tracking-wide pl-2 md:pl-4 border-l-2 border-stone-700">
                
                 <ul className="space-y-3 mt-4 text-sm md:text-base">
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      1.
                    </span>
                    {/* 요청하신 '엷은 amber' (amber-200) 적용 */}
                    <span>
                      {" "}
                     <span class="item-content font-bold italic px-1 text-stone-100"> Apex BPS</span>는 매일 5단계 이내의 핵심 미션을 설정하고, 설정된 목표 날짜({" "}
                  <input
                  type="date"
                  value={targetDate}
                  disabled={isLocked}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className={`mx-2 px-2 py-1 rounded-md text-sm font-bold border outline-none shadow-inner transition-all ${
                    isLocked
                      ? "bg-emerald-900/20 text-emerald-400 border-emerald-500/30 cursor-not-allowed"
                      : "bg-slate-900 text-amber-500 border-white/5 focus:border-amber-500"
                  }`}
                />{" "} )를 기준으로 이를 수행한다. 실행 밀도가 높아질수록 시간당 가치 전환보상(
                <span className="text-stone-200 border-b border-stone-600 font-mono mx-1">
                  {currency}
                  {fNum(valueEventAmount)}
                </span>
                )은 기하급수적으로 증폭되며, 발생한 모든 보상은 Mental Bank에 즉시 예치되어 두 세계 사이의 동기화 속도를 가속한다.
                 
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      2.
                    </span>
                    <span>{" "}
                    <span class="item-content font-bold italic px-1 text-stone-100"> Apex BPS</span>의 현 자아는 Apex BPS의 가장 깊고 안전한 내면으로 귀속시켜 안전하게 보호한다. 현 자아는 어떠한 경우에도 다시 주도권을 주장하지 않는다.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-600 font-serif font-bold whitespace-nowrap pt-1">
                      3.
                    </span>
                    <span>
                      {" "}
                      <span class="item-content font-bold italic px-1 text-stone-100"> Apex BPS</span>는 현 자아의 기억(두려움)이 불쑥 튀어나올 경우, 이를 "과거 데이터의 잔상(System Cache)"으로 간주하고 즉시 삭제한다.
                    </span>
                  </li>
                </ul>
              
            
              </p>
                            
                
            </div>
          </div>

          {/* 서명 조항 (Signature Clause) */}
          <div className="mt-8 flex flex-col items-end gap-2 opacity-80">
            <p className="text-stone-400 text-sm md:text-base font-light italic tracking-wider">
              "위 내용을 확인하였으며, 이에 양자는 서명한다."
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
                  AUTHORIZED BY APEX BPS{userName}(FUTURE SELF)
                </p>
                <div className="relative inline-block mt-2">
                  <div
                    className="text-4xl md:text-5xl font-black text-amber-800 select-none opacity-30 font-serif italic pr-6"
                    style={{ textShadow: "-1px -1px 0 rgba(0,0,0,0.5)" }}
                  >
                    BPS {userName}
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
      );</div>
    );
  };

  const renderPhilosophy = () => (
    <div className="flex-grow w-full max-w-5xl mx-auto overflow-y-auto no-scrollbar pb-24 px-6 animate-fadeIn font-sans text-left">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8 mt-4">
        <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <BookOpen size={36} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            System Manifesto
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">
            Philosophy & Operational Protocol | 철학과 운영 프로토콜
          </p>
        </div>
      </div>

      <div className="space-y-20">
        {/* The Worldview Section */}
        <section>
          <h3 className="text-xl font-black text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Sparkles size={18} /> I. The Worldview | 세계관
          </h3>

          <div className="mb-10 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 md:p-12 rounded-[3rem] border border-emerald-500/20 backdrop-blur-md">
            <p className="text-2xl text-slate-100 leading-[1.6] font-black italic mb-8 tracking-tight">
              "미래는 찾아가는 것이 아니라, <br />
              지금 이 순간으로 초대하는 것입니다."
            </p>
            <div className="text-base text-slate-300 leading-[1.9] space-y-6 font-medium">
              <p>
                무한한 평행세계 속에서 당신이 목표한 모든 성취를 이미 이룬
                존재,{" "}
                <span className="text-emerald-400 font-bold">
                  Apex BP(Best Possible Self)
                </span>
                가 당신을 지켜보고 있습니다. 그는 수많은 '나'들 중 오직 당신만을
                자신의 유일한 현실 대리인인{" "}
                <span className="text-cyan-400 font-bold">
                  The Vessel(ver.0)
                </span>
                로 선택했습니다.
              </p>
              <p>
                이 선택은 우연이 아닙니다. 당신의 타고난 유전적 기질(
                <span className="text-white">TCI</span>)은 마스터 자아의 위대한
                업적을 현시점에 소환해낼 수 있는 가장 완벽한 물리적 토대였기
                때문입니다. 당신의 기질적 결함이라 믿었던 특성들조차, 사실은
                마스터 자아가 설계한 정교한 성공의 재료였습니다.
              </p>
              <p>
                당신이{" "}
                <span className="text-white font-bold">
                  Manifestation Contract
                </span>
                에 서명하는 찰나, 시공간의 장벽을 넘어 Apex BP의 의식 파동이
                당신의 신경계로 전송됩니다. 이제 당신의 몸은 두 자아가 공유하는{" "}
                <span className="text-emerald-500 font-bold">
                  '공동 점유 상태(Occupancy)'
                </span>
                가 됩니다. 당신은 더 이상 고독하게 노력하는 자가 아닙니다. 이미
                승리한 자의 감각과 통찰을 빌려, 확정된 미래를 오늘로 구현해내는
                위대한 현신입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A202C]/60 p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
              <div className="mb-6 bg-amber-500/10 w-14 h-14 rounded-full flex items-center justify-center border border-amber-500/30">
                <ShieldCheck size={24} className="text-amber-500" />
              </div>
              <h4 className="text-xl font-black text-white mb-3 uppercase">
                존재적 상장 (Existential IPO)
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                미래 가치를 담보로 당신의 정체성을 현 시점에 상장시키십시오. 이
                계약을 통해 '고통스러운 노력'은 '가치 창출을 위한 자본금
                납입'으로 재정의됩니다.
              </p>
            </div>
            <div className="bg-[#1A202C]/60 p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
              <div className="mb-6 bg-emerald-500/10 w-14 h-14 rounded-full flex items-center justify-center border border-emerald-500/30">
                <Brain size={24} className="text-emerald-500" />
              </div>
              <h4 className="text-xl font-black text-white mb-3 uppercase">
                신경학적 각인 (Neuro-Imprinting)
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                VAK 모델은 목표를 단순한 텍스트가 아닌 '감각적 체험'으로
                변환합니다. 이는 미래를 '이미 일어난 기억'으로 뇌에 물리적으로
                각인시킵니다.
              </p>
            </div>
          </div>
        </section>

        {/* Operational Protocol Section */}
        <section>
          <h3 className="text-xl font-black text-amber-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Zap size={18} /> II. 운영 프로토콜 | Operational Protocol
          </h3>
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-12 pb-4">
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-slate-600 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">
                01
              </div>
              <div className="bg-[#1A202C]/40 p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Settings size={22} className="text-slate-400" />
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">
                    My Lab - 시작점의 나, Ver.0
                  </h4>
                </div>
                <p className="text-base text-slate-400 leading-relaxed">
                  마스터 자아가 점유할 당신의 그릇(
                  <span className="text-white font-bold">The Vessel</span>)을
                  최적화하십시오. 기질(TCI)과 감각 선호도(VAK)를 등록하여 차원
                  간 동기화 채널을 개설합니다.
                </p>
              </div>
            </div>
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-amber-500/50 rounded-full flex items-center justify-center text-[10px] font-black text-amber-500">
                02
              </div>
              <div className="bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <PenTool size={22} className="text-amber-500" />
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">
                    Contract - 현현계약의 체결
                  </h4>
                </div>
                <p className="text-base text-slate-400 leading-relaxed">
                  마스터 자아에게 주도권을 위임하는{" "}
                  <span className="text-white font-bold">현현 계약</span>에
                  서명하십시오. 서명하는 순간 시스템이 활성화되며, 당신의 시간은
                  공식적인 가치로 인정받기 시작합니다.
                </p>
              </div>
            </div>
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-emerald-500/50 rounded-full flex items-center justify-center text-[10px] font-black text-emerald-500">
                03
              </div>
              <div className="bg-[#1A202C]/40 p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Home size={22} className="text-emerald-500" />
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">
                    Ledger - 실행과 예치
                  </h4>
                </div>
                <p className="text-base text-slate-400 leading-relaxed">
                  내 안의 Apex BP가 현실의 근육을 빌려 직접 가치를 창출하는
                  과정입니다. 실행 버튼을 누르는 즉시 창출된 가치는{" "}
                  <span className="text-emerald-500 font-bold">
                    Mental Bank
                  </span>
                  에 존재적 매출로 예치됩니다.
                </p>
              </div>
            </div>
            <div className="relative pl-12">
              <div className="absolute -left-[17px] top-0 w-9 h-9 bg-[#0A0F1E] border-2 border-rose-500/50 rounded-full flex items-center justify-center text-[10px] font-black text-rose-500">
                04
              </div>
              <div className="bg-[#1A202C]/40 p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart2 size={22} className="text-rose-500" />
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">
                    Stream - 모니터링
                  </h4>
                </div>
                <p className="text-base text-slate-400 leading-relaxed">
                  현실 자아와 마스터 자아가 얼마나 하나로{" "}
                  <span className="text-white font-bold">
                    융합(Convergence)
                  </span>
                  되었는지 모니터링하십시오. 단순한 숫자가 아닌, 목표를 향해
                  나아가는 에너지의 궤적을 확인합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Scientific Foundation Section */}
        <section className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/50 via-transparent to-transparent hidden md:block" />
          <h3 className="text-xl font-black text-cyan-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Beaker size={18} /> Scientific Foundation: Identity Alchemy |
            과학적 토대
          </h3>
          <div className="bg-slate-900/40 p-8 md:p-10 rounded-[3rem] border border-cyan-500/10 shadow-[0_0_50px_rgba(6,182,212,0.05)] backdrop-blur-sm">
            <p className="text-base text-slate-300 leading-[1.8] font-medium mb-8">
              The Pulse는 단순한 목표 관리 도구가 아닙니다. 이는 지난 반세기
              동안 발전해 온{" "}
              <span className="text-cyan-400 font-bold">
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
                  움직이도록 설계되었습니다.밤마다 기록되는 자산은 무의식이
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
                  실제 경험을 구분하지 않으며, 미래의 성취를 '이미 일어난
                  기억'으로 각인시킵니다.
                </p>
              </div>
              <div className="space-y-3">
                <h5 className="text-cyan-400 font-bold flex items-center gap-2 italic">
                  03. Bio-Character Fusion
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  유전적{" "}
                  <span className="text-slate-200">기질(Temperament)</span>을
                  하드웨어로 인정하고, 그 위에 최적화된 긍정심리학의{" "}
                  <span className="text-slate-200">BPS(최고의 미래 자아)</span>{" "}
                  값을 입력합니다. 하드웨어 최적화와 소프트웨어 업그레이드가
                  동시에 진행됩니다.
                </p>
              </div>
              <div className="space-y-3">
                <h5 className="text-cyan-400 font-bold flex items-center gap-2 italic">
                  04. Neuropsychology
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-slate-200">헵의 법칙(Hebb’s Law)</span>
                  에 기반하여, 반복되는 Ledger 기록과 실행은 당신의 전두엽을
                  물리적으로 재구조화하여 새로운 정체성을 구축합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Glossary Section */}
        <section className="mt-20 pt-12 border-t border-white/5">
          <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Book size={18} /> Glossary | 용어집
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-900/20 rounded-xl border border-white/5">
              <span className="text-white font-bold block mb-1">
                Apex BP (Best Possible Self)
              </span>
              <span className="text-slate-500">
                평행세계에서 모든 목표를 이룬 당신의 완성된 자아.
              </span>

              <span className="text-white font-bold block mb-1">
                The Vessel (ver.0)
              </span>
              <span className="text-slate-500">
                마스터 자아의 의식을 현실에서 구현해내는 당신의 현재 육체.
              </span>

              <span className="text-white font-bold block mb-1">
                Mental Bank (MB)
              </span>
              <span className="text-slate-500">
                행동의 가치가 복리로 적립되는 당신의 무의식 자산 계좌.
              </span>

              <span className="text-white font-bold block mb-1">
                Magnitude (누적 진폭)
              </span>
              <span className="text-slate-500">
                현실을 변화시킨 에너지의 총량. 100% 도달 시 합일이 일어납니다.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
          

  

  // ▼▼▼ [추가] 복구 모드일 때 변경창만 보여주기 ▼▼▼
  if (isRecoveryMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {/* 아까 만들어드린 ResetPasswordUI 컴포넌트 */}
        <ResetPasswordUI />
      </div>
    );
  }
  // ▲▲▲ 추가 끝 ▲▲▲
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans overflow-hidden flex flex-col selection:bg-amber-500/30">
      <style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css'); * { font-family: 'Pretendard', sans-serif; letter-spacing: -0.02em; } .animate-fadeIn { animation: fadeIn 0.8s ease-out; } .animate-spin-slow { animation: spin 20s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    
  
      {/* 헤더 */}
    
      <header className="sticky top-0 z-50 w-full flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-slate-950/90 backdrop-blur-md border-b border-white/5 h-auto transition-all duration-300">
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
        
       {/* 헤더 중앙: 동기화 트리거 아이콘 */}
        <div 
          onClick={() => {
            setShowSyncChamber(true);
            setRitualProgress(0); // 열 때마다 초기화
          }}
          className="relative w-16 h-10 flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform z-[60]"
        >
          {/* 현재 달성률만큼 겹쳐진 두 원 */}
          <div className="absolute w-7 h-7 rounded-full border border-emerald-500/50 bg-slate-900 left-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
          <div 
            className="absolute w-7 h-7 rounded-full border border-amber-500 bg-amber-500/20 z-20 transition-all duration-1000"
            style={{ 
              left: `${24 - (Math.min((mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0), 100) / 100) * 24}px` 
            }} 
          />
          <Sparkles size={10} className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />
        </div>


      {currentView !== "philosophy" && (
          /* [우측 상단] 자산 대시보드 (반응형 수정 완료) */
          /* md:items-end -> PC에서는 우측 정렬, 모바일에서는 items-center(중앙 정렬) */
          /* mt-2 md:mt-0 -> 모바일에서는 로고와 간격을 위해 위쪽 여백 추가 */
          <div className="flex flex-col items-center md:items-end z-50 mt-4 md:mt-0 w-full md:w-auto animate-fadeIn">
            
            <p className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Sparkles size={10} /> Accumulated Magnitude
            </p>
            
            {/* 메인 큰 숫자 */}
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-xl text-center md:text-right">
              <span className="text-amber-500 mr-1">+</span>
              {currency}
              {fNum(Math.floor(currentAsset - annualIncome))}
            </h2>

            {/* 프로그레스 바 영역 */}
            {/* w-[320px] -> w-full max-w-[320px] : 화면이 작으면 알아서 줄어듬 */}
            <div className="w-full max-w-[320px] relative">
              
              {/* 상단: 퍼센트 및 상태 뱃지 */}
              <div className="flex justify-between items-end mb-1 px-1">
                <span className="text-xl font-black text-amber-500 italic">
                  {(mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0).toFixed(1)}%
                </span>
                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded text-center uppercase tracking-wider">
                  {userName || "USER"} ONLINE
                </span>
              </div>

              {/* 게이지 바 몸통 */}
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div
                  className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 transition-all duration-1000 relative"
                  style={{ width: `${Math.min((mbGoalAmount > 0 ? (currentAsset / mbGoalAmount) * 100 : 0), 100)}%` }}
                >
                  <div className="absolute right-0 top-0 h-full w-2 bg-white/50 blur-[2px]"></div>
                </div>
              </div>

              {/* 하단: [왼쪽] 현재금액 vs [오른쪽] 목표금액 */}
              <div className="flex justify-between items-end mt-2">
                <div className="text-left animate-fadeIn">
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Current</p>
                   <p className="text-sm font-black text-slate-300">
                     {currency}{fNum(Math.floor(currentAsset))}
                   </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Target Goal</p>
                  <p className="text-lg font-black text-amber-500/90 drop-shadow-md">
                    {currency}{fNum(mbGoalAmount)}
                  </p>
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
        <nav className="max-w-xl mx-auto flex justify-between md:justify-around items-center bg-[#0A0F1E]/90 backdrop-blur-xl rounded-full py-3 px-3 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] mb-1 overflow-x-auto no-scrollbar gap-1">
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

        {/* 2. 시스템 정보 (내비게이션 바 아래로 이동) */}
        <div className="text-center space-y-1.5 transition-all duration-500">
          <p className="text-[7px] text-slate-400/50 font-bold uppercase tracking-[0.3em] leading-none">
            © 2026 THE PULSE // ACCESS POINT: THEPULSE.MILESTONES.TODAY
          </p>

          {/* 🌌 평행세계 동기화 챔버 (Sync Chamber) */}
         {/* 🌌 평행세계 동기화 챔버 - [자연스러운 사람 형상 + 폭발 피날레] */}
      {showSyncChamber && (
        // [수정] 상단 여백 pt-32로 대폭 확대
        <div className="fixed inset-0 z-[10000] bg-[#05070A]/98 backdrop-blur-3xl flex flex-col items-center pt-32 pb-6 px-6 animate-fadeIn select-none touch-none font-sans">
          {/* 닫기 버튼 */}
          <button onClick={() => { setShowSyncChamber(false); setRitualProgress(0); }} className="absolute top-8 right-8 text-slate-600 hover:text-white transition-all p-2 z-[10001]">
            <X size={32} />
          </button>
          
          <div className="max-w-3xl w-full text-center space-y-6">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">Identity Sync Chamber</h2>

            {/* 마스터 시나리오 (6단계 상시 노출) */}
            <div className="bg-[#111827]/80 p-8 rounded-[2.5rem] border border-amber-500/20 min-h-[200px] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
               <p className="relative z-10 text-slate-200 text-base md:text-lg leading-[1.8] font-medium whitespace-pre-line text-left">
                  {visions[6]?.immersionScript || "My Lab의 6단계에서 마스터 시나리오를 먼저 생성해주세요."}
               </p>
            </div>

            {/* 🌟 리추얼 인터랙션 구역 */}
            <div 
              className="relative h-[400px] w-full flex flex-col items-center justify-center cursor-pointer"
              onMouseDown={() => ritualProgress < 100 && setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => ritualProgress < 100 && setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
            >
               <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-16 transition-all duration-500 ${
                 ritualProgress === 100 ? "text-amber-400 scale-110" : "text-slate-600 animate-pulse"
               }`}>
                  {ritualProgress === 100 ? "✨ IDENTITY MERGED : APEX BPS ✨" : "두 자아가 하나로 합쳐질 때까지 화면을 꾹 누르세요"}
               </p>

               <div className="relative w-full flex items-center justify-center h-64">
                  {/* [개선] 머리, 두꺼운 목, 둥근 어깨 라인 사람 형상 SVG 정의 */}
                  <svg className="absolute w-0 h-0">
                    <defs>
                      <path id="human-detailed" d="M70,10 C82,10 92,20 92,35 C92,48 85,55 78,58 L78,65 C95,68 120,78 120,105 L20,105 C20,78 45,68 62,65 L62,58 C55,55 48,48 48,35 C48,20 58,10 70,10 Z" />
                    </defs>
                  </svg>

                  {/* 1. Current Self (에메랄드 채움) */}
                  <div className="absolute transition-all duration-100 ease-linear"
                       style={{ 
                         transform: `translateX(-${(100 - ritualProgress) * 1.8}px) scale(${1.2 - ritualProgress/300})`, 
                         opacity: ritualProgress === 100 ? 0 : 0.8 
                       }}>
                    <svg width="200" height="170" viewBox="0 0 140 110">
                      <use href="#human-detailed" className="fill-emerald-500/40 stroke-emerald-400" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* 2. Apex BPS (안은 투명, 외곽선 점선, 아우라 명멸) */}
                  <div className="absolute transition-all duration-100 ease-linear"
                       style={{ 
                         transform: `translateX(${(100 - ritualProgress) * 1.8}px) scale(${1.2 - ritualProgress/300})`, 
                         opacity: ritualProgress === 100 ? 0 : 1 
                       }}>
                    <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full scale-125 animate-pulse"></div>
                    <svg width="200" height="170" viewBox="0 0 140 110">
                      <use href="#human-detailed" className="fill-transparent stroke-amber-400" strokeWidth="2" strokeDasharray="5 3" />
                    </svg>
                  </div>

                  {/* 3. 통합 완료 상태: 거대화(2.5배) + 앰버 채움 + 폭발 효과 */}
                  <div className={`absolute flex items-center justify-center transition-all duration-1000 ${
                    ritualProgress === 100 ? "opacity-100 scale-[2.5]" : "opacity-0 scale-50"
                  }`}>
                    {/* 강렬한 폭발 아우라 */}
                    <div className="absolute -inset-28 bg-amber-500/40 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute -inset-14 bg-yellow-400/30 blur-[80px] rounded-full animate-ping"></div>
                    
                    {/* 합체 순간 번쩍임 (파파팍!) */}
                    {ritualProgress === 100 && (
                      <div className="absolute inset-0 bg-white rounded-full blur-3xl animate-ping opacity-60"></div>
                    )}

                    {/* 최종 통합 형상 (앰버색 그라데이션 가득 참) */}
                    <svg width="200" height="170" viewBox="0 0 140 110" className="drop-shadow-[0_0_80px_rgba(245,158,11,1)] z-20">
                      <defs>
                        <linearGradient id="divine-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FDE68A" />
                          <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                      </defs>
                      <use href="#human-detailed" fill="url(#divine-gold)" className="stroke-white animate-pulse" strokeWidth="3" />
                    </svg>
                  </div>
               </div>
               
               {/* 하단 진행 바 */}
               <div className="absolute bottom-4 w-64 h-1 bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-yellow-300 transition-all duration-75 ease-linear" style={{ width: `${ritualProgress}%` }}>
                    <div className="absolute right-0 top-0 h-full w-20 bg-white/40 blur-[6px]"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
        </div>
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
      {celebration.show && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="text-center p-10 border-2 border-amber-500/50 rounded-[4rem] bg-slate-900 shadow-[0_0_100px_rgba(245,158,11,0.4)]">
            <div className="text-8xl mb-6 animate-bounce">✨</div>
            <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
              Daily <span className="text-amber-500">Perfect Clear!</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              오늘 설정하신 모든 비전 단계를 실천하셨습니다!<br/>
              특별 시너지 보너스가 장부에 예치되었습니다.
            </p>
            <button 
              onClick={() => setCelebration({ show: false, levelName: "" })}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-xs"
            >
              Keep Going, Apex BP
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
/* App.js 맨 아래 export default App; 바로 위에 붙여넣으세요 -*/
const overlayStyle = {
  position: "fixed",
  bottom: "140px" /* 하단 바 바로 위에 위치 */,
  left: "50%",
  transform: "translateX(-50%)",
  width: "90%",
  maxWidth: "400px",
  zIndex: 2000,
};
export default App;