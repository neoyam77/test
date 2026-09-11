import type { IncomingMessage, ServerResponse } from "http";
import { generateProposalWithGemini } from "../src/services/proposalService";

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { imageBase64, mimeType, purpose, tone } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: "제품 이미지를 제공해주세요." });
    }

    const outcome = await generateProposalWithGemini({
      imageBase64,
      mimeType,
      purpose,
      tone,
    });

    return res.status(200).json(outcome);
  } catch (error: any) {
    console.error("Vercel AI 제안 처리 오류:", error);
    let userMsg = "AI 제안 카드를 생성하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

    const rawMsg = error?.message || "";
    if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
      userMsg = "현재 AI 서버 접속량이 많아 일시적으로 지연되고 있습니다. 잠시 후 다시 시도해주세요.";
    }

    return res.status(500).json({ error: userMsg });
  }
}
