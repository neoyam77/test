import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateProposalWithGemini } from "./src/services/proposalService";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", brand: "Framboise (프랑브아즈)" });
});

// AI Product Proposal Card generation endpoint
app.post("/api/generate-proposal", async (req, res) => {
  try {
    const { imageBase64, mimeType, purpose, tone } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "제품 이미지를 제공해주세요." });
    }

    const outcome = await generateProposalWithGemini({
      imageBase64,
      mimeType,
      purpose,
      tone,
    });

    return res.json(outcome);
  } catch (error: any) {
    console.error("AI 제안 처리 오류:", error);
    let userMsg = "AI 제안 카드를 생성하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

    const rawMsg = error?.message || "";
    if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
      userMsg = "현재 AI 서버 접속량이 많아 일시적으로 지연되고 있습니다. 잠시 후 다시 시도해주세요.";
    }

    return res.status(500).json({
      error: userMsg,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Framboise AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
