/**
 * api/generate.js
 * Vercel Serverless Function
 *
 * 역할: OpenAI API 키를 서버에서만 사용하여 프론트엔드에 노출되지 않게 보호.
 *       (기존에는 브라우저에서 OpenAI를 직접 호출해 VITE_/REACT_APP_ 키가 번들에 노출됐음)
 * 엔드포인트: POST /api/generate
 *
 * Request body:
 *   { messages: [{ role, content }], temperature?: number }
 * Response:
 *   { content: string }   // 어시스턴트 응답 텍스트만 반환 (파싱은 클라이언트에서)
 */

export default async function handler(req, res) {
  // CORS (같은 Vercel 도메인에서만 호출되지만 안전하게 설정)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY가 설정되지 않았습니다." });
  }

  const { messages, temperature } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages가 비어있습니다." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 두 호출부 모두 동일 모델 사용
        messages,
        temperature: typeof temperature === "number" ? temperature : 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok || data.error) {
      const msg = data.error?.message || `OpenAI API 오류 (${openaiRes.status})`;
      console.error("OpenAI API 오류:", openaiRes.status, msg);
      return res.status(openaiRes.status || 500).json({ error: msg });
    }

    const content = data.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ content });
  } catch (err) {
    console.error("generate handler 오류:", err);
    return res.status(500).json({ error: err.message || "서버 오류가 발생했습니다." });
  }
}
