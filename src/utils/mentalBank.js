/**
 * 멘탈뱅크 계산 공식 (thePulse에서 이식 — 순수 함수)
 *
 * Success-Pulse는 이미 App.js에서 hourlyRate = (annualIncome*2)/1000 을 계산하므로
 * 여기서는 "목표일 페이스 진단"에 필요한 함수들을 재사용 가능하게 제공한다.
 */

export function calcGoalAmount(annualIncome) {
  return annualIncome * 2;
}

export function calcHourlyRate(annualIncome) {
  const goalAmount = calcGoalAmount(annualIncome);
  return goalAmount / 1000; // ⚠️ 목표액/1000 (연봉/1000 아님) — App.js와 동일
}

export function calcEventAmount(hourlyRate, durationMinutes) {
  return hourlyRate * (durationMinutes / 60);
}

/**
 * 총 갭% 계산
 * baselines: { '1': 60, '2': 30, ... } (단계별 현재 만족도 0~100)
 */
export function calcTotalGap(baselines) {
  return Object.values(baselines).reduce((sum, b) => sum + (100 - b), 0);
}

/**
 * 필요 총 시간 계산
 * totalGap: 총 갭% 합계 (예: 180)
 */
export function calcRequiredHours(totalGap) {
  return (totalGap / 250) * 500;
}

/**
 * 목표일 진단
 * requiredHours: 목표 달성에 필요한 총 시간
 * dailyHours: 하루 투입 시간
 * weeklyDays: 주 실천일수
 * targetDate: 희망 목표일 (Date | string)
 *
 * 반환: { case: 'A'|'B'|'C', estimatedDate: Date, diffDays: number }
 *  - A: 목표일과 예상 완료일이 ±14일 이내 (적정)
 *  - B: 예상 완료일이 목표일보다 14일 이상 늦음 (빠듯 — 페이스를 높여야 함)
 *  - C: 예상 완료일이 목표일보다 14일 이상 빠름 (여유 있음)
 */
export function diagnoseTargetDate(requiredHours, dailyHours, weeklyDays, targetDate) {
  const weeklyHours = dailyHours * weeklyDays;
  if (!(weeklyHours > 0) || !(requiredHours > 0)) return null;

  const requiredWeeks = requiredHours / weeklyHours;
  const estimatedDays = Math.ceil(requiredWeeks * 7 * 1.12); // 12% 버퍼
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

  const targetMs = new Date(targetDate).getTime();
  const estimatedMs = estimatedDate.getTime();
  const diffDays = Math.round((targetMs - estimatedMs) / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) <= 14) {
    return { case: "A", estimatedDate, diffDays };
  } else if (diffDays < -14) {
    return { case: "B", estimatedDate, diffDays };
  } else {
    return { case: "C", estimatedDate, diffDays };
  }
}
