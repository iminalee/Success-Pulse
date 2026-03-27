/**
 * DiscoverJourney.jsx — Act 1: Discover 컨테이너
 *
 * Step 0: WelcomeScreen         ✅
 * Step 1: TCI 기질 프로파일링    ✅
 * Step 2: VAK 감각 채널 진단     ✅
 * Step 3: 회원가입 (SignupGate)  ✅  ← NEW
 * Step 4: 욕구 단계 선택         ✅
 * Step 5: 맞춤 질문              ✅
 * Step 6: AI BPS 초안 생성       ✅
 * Step 7: 양자 계약서 서명       ✅
 * Step 8: 결과 공유              ✅
 */

import React, { useState } from "react";
import WelcomeScreen       from "./WelcomeScreen";
import TciQuickTest        from "./TciQuickTest";
import VakTest             from "./VakTest";
import SignupGate          from "./SignupGate";
import NeedLevelScreen     from "./NeedLevelScreen";
import DiscoveryQuestions  from "./DiscoveryQuestions";
import BpsGenerator        from "./BpsGenerator";
import QuantumContract     from "./QuantumContract";
import ResultShareScreen   from "./ResultShareScreen";

const DiscoverJourney = ({ onComplete, userName: appUserName, isLoggedIn }) => {
  const [step, setStep] = useState(0);
  const [pendingSignature, setPendingSignature] = useState("");

  const [journeyData, setJourneyData] = useState({
    userName: appUserName || "",
    tciQuickProfile: { ns: 50, ha: 50, rd: 50, p: 50 },
    vakProfile: {
      vPercent: 34, aPercent: 33, kPercent: 33,
      dominant: "V", order: "V-A-K",
    },
    selectedNeedLevel: null,
    discoveryAnswers: { q1: "", q2: "", q3: "" },
    generatedBPS: {
      title: "", vision_v: "", vision_a: "", vision_k: "", immersionScript: "",
    },
    signature: "",
  });

  const goNext = () => setStep((s) => s + 1);

  const updateJourneyData = (key, value) =>
    setJourneyData((prev) => ({ ...prev, [key]: value }));

  switch (step) {
    // ── 비회원 구간 (Step 0~2) ────────────────────────────
    case 0:
      return <WelcomeScreen onStart={goNext} />;

    case 1:
      return (
        <TciQuickTest
          onComplete={(tci) => { updateJourneyData("tciQuickProfile", tci); goNext(); }}
        />
      );

    case 2:
      return (
        <VakTest
          onComplete={(vak) => { updateJourneyData("vakProfile", vak); goNext(); }}
        />
      );

    // ── 가입 게이트 (Step 3) ──────────────────────────────
    case 3:
      return (
        <SignupGate
          tciQuickProfile={journeyData.tciQuickProfile}
          vakProfile={journeyData.vakProfile}
          onComplete={(name) => {
            updateJourneyData("userName", name);
            goNext();
          }}
        />
      );

    // ── 회원 전용 구간 (Step 4~8) ─────────────────────────
    case 4:
      return (
        <NeedLevelScreen
          tciQuickProfile={journeyData.tciQuickProfile}
          onComplete={(lv) => { updateJourneyData("selectedNeedLevel", lv); goNext(); }}
        />
      );

    case 5:
      return (
        <DiscoveryQuestions
          needLevel={journeyData.selectedNeedLevel}
          vakProfile={journeyData.vakProfile}
          tciQuickProfile={journeyData.tciQuickProfile}
          onComplete={(answers) => {
            updateJourneyData("discoveryAnswers", {
              q1: answers[0] ?? "", q2: answers[1] ?? "", q3: answers[2] ?? "",
            });
            goNext();
          }}
        />
      );

    case 6:
      return (
        <BpsGenerator
          needLevel={journeyData.selectedNeedLevel}
          vakProfile={journeyData.vakProfile}
          tciQuickProfile={journeyData.tciQuickProfile}
          discoveryAnswers={journeyData.discoveryAnswers}
          userName={journeyData.userName}
          onComplete={(bps) => { updateJourneyData("generatedBPS", bps); goNext(); }}
        />
      );

    // Step 7: 양자 계약서
    case 7:
      return (
        <QuantumContract
          userName={journeyData.userName}
          generatedBPS={journeyData.generatedBPS}
          tciQuickProfile={journeyData.tciQuickProfile}
          vakProfile={journeyData.vakProfile}
          selectedNeedLevel={journeyData.selectedNeedLevel}
          onComplete={(signature) => {
            // 서명을 별도 state에 저장 후 다음 스텝으로 (async 경합 방지)
            setPendingSignature(signature);
            updateJourneyData("signature", signature);
            goNext();
          }}
        />
      );

    // Step 8: 결과 공유
    case 8:
      return (
        <ResultShareScreen
          journeyData={{ ...journeyData, signature: pendingSignature }}
          isLoggedIn={isLoggedIn}
          onComplete={(finalData) => onComplete(finalData)}
        />
      );

    default:
      return null;
  }
};

export default DiscoverJourney;
