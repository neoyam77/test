import React, { useState } from "react";
import { Header } from "./components/Header";
import { InputPanel } from "./components/InputPanel";
import { ResultCard } from "./components/ResultCard";
import { ProposalResult, ProposalTone } from "./types";
import { AlertCircle } from "lucide-react";

export default function App() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<string>("아이방 침실 (수면 공간)");
  const [tone, setTone] = useState<ProposalTone>("다정하고 따뜻한 감성체");
  const [result, setResult] = useState<ProposalResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!imagePreview) {
      setErrorMessage("제품 사진을 먼저 등록해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          purpose: purpose.trim() || "아이방 공간",
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "제안 카드를 생성하지 못했습니다.");
      }

      setResult(data.result);

      // On mobile devices, smoothly scroll down to the result card
      setTimeout(() => {
        const resultElement = document.getElementById("framboise-proposal-card");
        if (resultElement && window.innerWidth < 1024) {
          resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      console.error("제안 카드 생성 실패:", err);
      setErrorMessage(err.message || "오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/40 text-neutral-900 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Intro banner */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif mb-1">
            프랑브아즈 AI 제품 제안 카드
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            제품 사진 한 장으로 완성하는 우리 아이 맞춤형 키즈 리빙 제안 카드
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="font-bold text-red-800 hover:text-red-950 px-2 py-0.5"
            >
              닫기
            </button>
          </div>
        )}

        {/* 2-Column Layout on PC (Left: Input / Right: Result), 1-Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Input (5 cols on PC) */}
          <div className="lg:col-span-5">
            <InputPanel
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              purpose={purpose}
              setPurpose={setPurpose}
              tone={tone}
              setTone={setTone}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Result (7 cols on PC) */}
          <div className="lg:col-span-7">
            <ResultCard
              result={result}
              imagePreview={imagePreview}
              isLoading={isLoading}
              purpose={purpose}
              tone={tone}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
