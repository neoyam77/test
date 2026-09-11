import React from "react";
import { Sparkles, Sparkle } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-neutral-100 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30">
            <Sparkle className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-neutral-900 font-serif">
                Framboise
              </span>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-full">
                프랑브아즈
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              키즈 리빙 & 홈 패브릭 · AI 제품 제안 카드
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200/80 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>제품 사진과 공간 목적에 맞춘 맞춤 큐레이션</span>
        </div>
      </div>
    </header>
  );
};
