/**
 * api/apex-chat.js
 * Vercel Serverless Function
 *
 * 역할: Dify API 키를 서버에서만 사용하여 프론트엔드에 노출되지 않게 보호.
 *       + 사용자의 최신 Pulse Profile 컨텍스트(inputs)를 Dify에 전달해
 *         Apex가 프로필을 반영하여 응답하도록 함(AGENTS.md 목표 아키텍처 #4).
 * 엔드포인트: POST /api/apex-chat
 *
 * Request body:
 *   { message: string, conversation_id: string | null, inputs?: object }
 *
 * Response:
 *   { answer: string, conversation_id: string }
 */

export default async function handler(req, res) {
  // CORS 허용 (같은 Vercel 도메인에서만 호출되지만 안전하게 설정)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS preflight 처리
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.DIFY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "DIFY_API_KEY가 설정되지 않았습니다." });
  }

  const { message, conversation_id, inputs } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "message가 비어있습니다." });
  }

  const endpoint = "https://api.dify.ai/v1/chat-messages";

  const callDify = async (requestBody) =>
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

  try {
    const body = {
      // 최신 Pulse Profile 컨텍스트(이름/취침시간/시급/오늘 원장/요약 등).
      // Dify 앱의 변수와 매칭됨. 없으면 빈 객체.
      inputs: inputs && typeof inputs === "object" ? inputs : {},
      query: message.trim(),
      response_mode: "blocking", // 스트리밍 없이 완전한 응답 한 번에 받기
      user: "pulse-user",        // Dify 쪽 사용자 식별자 (고정값 OK)
    };

    // 이전 대화가 있으면 conversation_id 포함 → 대화 이어짐
    if (conversation_id && typeof conversation_id === "string" && conversation_id.trim() !== "") {
      body.conversation_id = conversation_id.trim();
    }

    let difyRes = await callDify(body);
    let text = await difyRes.text();

    // conversation_id가 만료/삭제된 경우 새 대화로 재시도 (thePulse와 동일 동작)
    if (
      difyRes.status === 404 &&
      text.includes("Conversation Not Exists") &&
      body.conversation_id
    ) {
      delete body.conversation_id;
      difyRes = await callDify(body);
      text = await difyRes.text();
    }

    if (!difyRes.ok) {
      console.error("Dify API 오류:", difyRes.status, text.slice(0, 300));
      return res.status(difyRes.status).json({
        error: `Dify API 오류 (${difyRes.status})`,
        detail: text.slice(0, 300),
      });
    }

    const data = JSON.parse(text);

    return res.status(200).json({
      answer: data.answer || "",
      conversation_id: data.conversation_id || conversation_id || null,
    });
  } catch (err) {
    console.error("apex-chat handler 오류:", err);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}
