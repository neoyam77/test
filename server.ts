import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

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

    const ai = getAiClient();
    if (!ai) {
      // Fallback demo response if GEMINI_API_KEY is not configured
      const fallbackResult = {
        title: `포근한 일상을 선물하는 프랑브아즈 감성 키즈 컬렉션`,
        introduction: `아이의 ${purpose || "소중한 공간"}을 한층 따뜻하고 아늑하게 채워주는 프랑브아즈의 시그니처 키즈 리빙 아이템입니다. 부드러운 색감과 안락한 무드가 조화를 이루어 아이에게는 편안한 안식처를, 부모에게는 감각적인 인테리어 만족감을 선사합니다.`,
        advantages: [
          "자연스럽고 따뜻한 뉴트럴 톤으로 어느 공간에나 조화롭게 어우러지는 감성 디자인",
          "아이의 정서적 안정감과 편안한 휴식을 고려한 프랑브아즈만의 부드러운 터치감",
          "일상적인 놀이와 휴식 공간 모두에서 실용적으로 활용 가능한 다목적 홈 리빙 아이템"
        ],
        requiredChecks: [
          "정확한 판매 가격 및 프로모션 혜택 [확인 필요]",
          "배치 공간에 알맞은 상세 실측 규격(치수) 및 원단 세부 혼용률 [확인 필요]"
        ],
        relatedProducts: [
          {
            name: "프랑브아즈 오가닉 코튼 베개 커버 세트",
            description: "동일한 파스텔 웜톤으로 통일감을 주어 침실과 놀이 공간을 더욱 포근하게 연출할 수 있습니다."
          },
          {
            name: "프랑브아즈 내추럴 캔버스 수납 바스켓",
            description: "아이의 장난감이나 작은 소품들을 깔끔하고 감성적으로 정리할 수 있는 실용적인 매칭 아이템입니다."
          }
        ]
      };
      return res.json({ result: fallbackResult, isFallback: true });
    }

    // Clean base64 string if it contains data URI prefix
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType || "image/jpeg";

    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      const mimeMatch = parts[0].match(/:(.*?)$/);
      if (mimeMatch && mimeMatch[1]) {
        detectedMime = mimeMatch[1];
      }
      cleanBase64 = parts[1];
    }

    const systemInstruction = `당신은 프리미엄 키즈 리빙 & 홈 패브릭 브랜드 '프랑브아즈(Framboise)'의 공식 AI 제품 큐레이터입니다.
프랑브아즈는 아이의 정서 발달과 안전, 그리고 부모의 라이프스타일 인테리어를 섬세하게 배려하는 키즈 리빙 브랜드입니다.
입력된 제품 사진과 사용 목적, 문체를 깊이 있게 분석하여 구매 고객과 인테리어 상담 고객에게 전달할 'AI 제품 제안 카드'를 작성하세요.

[필수 규칙 및 제약사항]
1. 제목(title): 1줄의 감각적이고 신뢰감 있는 제안 카드 헤드라인.
2. 소개(introduction): 지정된 문체 스타일에 맞춰 **반드시 2~3문장**으로 작성.
3. 장점(advantages): 이미지에서 직접 관찰되는 외관, 색감, 조화로움, 감성 디자인 등 매력적인 **장점 3개**.
4. 추가 확인 정보(requiredChecks): **가장 중요한 규칙**입니다. 사진만으로 결코 단정할 수 없는 '가격, 실측 크기/규격, 세부 소재/인증, 구체적 기능/내구성' 등은 절대로 지어내거나 추측하지 마세요. **정확히 2개 항목**을 선정하고, 각 항목 텍스트에 반드시 **'[확인 필요]'**를 명확하게 포함하세요. (예: "공식 판매 가격 및 구매 옵션 [확인 필요]", "상세 실측 크기(W×D×H) 및 권장 연령 [확인 필요]")
5. 연관 제품(relatedProducts): 함께 스타일링하면 완벽한 프랑브아즈 키즈 리빙 제품 **정확히 2개**. 각각 name과 description(추천 사유 및 코디 팁)을 작성.`;

    const userPrompt = `[제품 정보 분석 요청]
- 사용할 장소 또는 목적: ${purpose || "아이방 인테리어 및 일상 휴식"}
- 제안 문체 스타일: ${tone || "다정하고 따뜻한 감성체"}

첨부된 제품 이미지를 바탕으로 위 규칙에 맞는 JSON 데이터를 생성해주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: detectedMime,
              data: cleanBase64,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "제품 제안 카드의 감각적인 제목 (1줄)",
            },
            introduction: {
              type: Type.STRING,
              description: "지정된 문체로 작성된 2~3문장의 따뜻하고 정돈된 소개글",
            },
            advantages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "제품의 장점 정확히 3개",
            },
            requiredChecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "사진으로 알 수 없어 확인이 필요한 정보 2개 (가격/크기/소재/성능 등 추측 금지 항목, 반드시 '[확인 필요]' 포함)",
            },
            relatedProducts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "연관 제품명",
                  },
                  description: {
                    type: Type.STRING,
                    description: "연관 제품 추천 사유 및 믹스매치 팁",
                  },
                },
                required: ["name", "description"],
              },
              description: "함께 제안할 연관 제품 2개",
            },
          },
          required: ["title", "introduction", "advantages", "requiredChecks", "relatedProducts"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("모델로부터 응답을 받지 못했습니다.");
    }

    const parsed = JSON.parse(text);
    return res.json({ result: parsed });
  } catch (error: any) {
    console.error("AI 제안 생성 오류:", error);
    return res.status(500).json({
      error: error?.message || "AI 제안 카드를 생성하는 도중 오류가 발생했습니다.",
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
