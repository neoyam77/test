import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  ShoppingBag,
  HelpCircle,
  FileText,
  Layers,
  ZoomIn,
  X,
  ExternalLink,
} from "lucide-react";
import { ProposalResult } from "../types";
import { resolveRelatedProductImage } from "../data/matchingProducts";

interface ResultCardProps {
  result: ProposalResult | null;
  imagePreview: string | null;
  isLoading: boolean;
  purpose: string;
  tone: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  imagePreview,
  isLoading,
  purpose,
  tone,
}) => {
  const [copied, setCopied] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `[프랑브아즈 AI 제품 제안 카드]
■ 제목: ${result.title}

■ 제품 소개:
${result.introduction}

■ 주요 장점 (3가지):
1. ${result.advantages[0] || ""}
2. ${result.advantages[1] || ""}
3. ${result.advantages[2] || ""}

■ 추가 확인 정보 (가격/크기/소재/성능):
1. ${result.requiredChecks[0] || ""}
2. ${result.requiredChecks[1] || ""}

■ 연관 제안 제품 (2가지):
1. ${result.relatedProducts[0]?.name || ""}: ${result.relatedProducts[0]?.description || ""}
2. ${result.relatedProducts[1]?.name || ""}: ${result.relatedProducts[1]?.description || ""}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-xs flex flex-col items-center justify-center min-h-[480px] text-center">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-orange-600">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
          </span>
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-1.5">
          프랑브아즈 AI 제안 카드를 생성하는 중입니다
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mb-4">
          제품 이미지의 색감과 디자인, 사용 장소({purpose || "아이방"}), 문체(
          {tone})를 종합 분석하고 있습니다.
        </p>
        <div className="w-48 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-orange-500 h-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full"></div>
        </div>
      </section>
    );
  }

  // 2. Empty State (Before Generation)
  if (!result) {
    return (
      <section className="bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-xs flex flex-col items-center justify-center min-h-[480px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-4 shadow-xs">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-1.5 font-serif">
          프랑브아즈 AI 제품 제안 카드
        </h3>
        <p className="text-xs text-neutral-500 max-w-xs leading-relaxed mb-6">
          왼쪽 패널에서 제품 이미지를 등록하고 장소 및 문체를 선택한 뒤{" "}
          <span className="text-orange-600 font-semibold">‘AI 제안문 만들기’</span>{" "}
          버튼을 클릭하면 완성된 제안 카드가 이곳에 표시됩니다.
        </p>

        <div className="w-full max-w-sm bg-neutral-50/80 border border-neutral-200/60 rounded-xl p-4 text-left">
          <p className="text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            제안 카드 포함 항목:
          </p>
          <ul className="text-xs text-neutral-500 space-y-1.5 pl-3 border-l border-neutral-200">
            <li>• 감각적인 카드 제목 & 2~3문장 브랜드 소개</li>
            <li>• 이미지 기반 주요 장점 3개</li>
            <li>• 가격·크기·소재 등 <strong>‘확인 필요’</strong> 항목 2개</li>
            <li>• 함께 스타일링할 프랑브아즈 연관 제품 2개</li>
          </ul>
        </div>
      </section>
    );
  }

  // 3. Generated Result State
  return (
    <section
      id="framboise-proposal-card"
      className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col transition-all"
    >
      {/* Card Header Bar */}
      <div className="bg-neutral-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider uppercase text-orange-400 font-mono">
            FRAMBOISE CURATION
          </span>
          <span className="text-xs text-neutral-400">|</span>
          <span className="text-xs text-neutral-300 font-medium">
            AI 제품 제안 카드
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">복사 완료</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-300" />
              <span>텍스트 복사</span>
            </>
          )}
        </button>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Product Visual Snapshot & Title */}
        <div className="flex flex-col sm:flex-row gap-4 items-start pb-5 border-b border-neutral-100">
          {imagePreview && (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 shrink-0 shadow-xs">
              <img
                src={imagePreview}
                alt="제안 제품 이미지"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                {tone}
              </span>
              {purpose && (
                <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                  장소: {purpose}
                </span>
              )}
            </div>
            {/* 1. 제목 */}
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
              {result.title}
            </h2>
          </div>
        </div>

        {/* 2. 2~3문장 소개 */}
        <div className="bg-orange-50/40 border-l-4 border-orange-500 rounded-r-xl p-4 sm:p-4.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>제품 소개</span>
          </div>
          <p className="text-sm text-neutral-800 leading-relaxed font-normal">
            {result.introduction}
          </p>
        </div>

        {/* 3. 장점 3개 */}
        <div>
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4 text-orange-500" />
            <span>프랑브아즈 핵심 장점 (3가지)</span>
          </h3>
          <div className="space-y-2">
            {result.advantages.map((adv, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 text-sm text-neutral-800"
              >
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{adv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 추가 확인 정보 2개 (가격, 크기, 소재, 성능 등 추측 방지 항목) */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>추가 확인 정보 (2가지)</span>
            </h3>
            <span className="text-[11px] text-neutral-400 flex items-center gap-0.5">
              <HelpCircle className="w-3 h-3" />
              사진 외 필수 체크 항목
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-3">
            사진만으로 단정할 수 없는 가격·치수·원단 혼용률·안전성 정보는 추측하지 않고 스토어 문의나 실측 상세정보로 안내합니다.
          </p>

          <div className="space-y-2">
            {result.requiredChecks.map((item, idx) => {
              // Ensure highlight on '확인 필요'
              const hasCheckTag = item.includes("확인 필요");
              return (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-white border border-amber-200/80 text-xs text-neutral-800 shadow-2xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span className="font-medium text-neutral-800 leading-relaxed">
                      {item.replace(/\[?확인 필요\]?/g, "").trim()}
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[11px]">
                    확인 필요
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. 연관 제품 2개 (추천 매칭 + 제품 이미지 사진) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              <span>프랑브아즈 함께 스타일링할 연관 제품 (2가지)</span>
            </h3>
            <span className="text-[11px] text-neutral-400">
              사진 클릭 시 확대 보기
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {result.relatedProducts.map((prod, idx) => {
              const imageInfo = resolveRelatedProductImage(prod, idx);
              const displayImg = prod.imageUrl || imageInfo.imageUrl;
              const displayCategory = prod.category || imageInfo.category;
              const displayTag = prod.tag || imageInfo.tag;

              return (
                <div
                  key={idx}
                  className="group rounded-xl border border-neutral-200/90 bg-white hover:border-orange-300 hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Recommended Product Photo Thumbnail */}
                  <div
                    className="relative w-full aspect-16/10 bg-neutral-100 overflow-hidden cursor-pointer"
                    onClick={() =>
                      setZoomedImage({
                        url: displayImg,
                        title: prod.name,
                      })
                    }
                    title="클릭하여 제품 사진 확대"
                  >
                    <img
                      src={displayImg}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category / Tag Pill */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/65 text-white backdrop-blur-xs">
                        {displayCategory}
                      </span>
                    </div>

                    {/* Hover Zoom Icon */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="p-1.5 rounded-lg bg-white/90 text-neutral-800 shadow-xs flex items-center justify-center hover:bg-white">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                          {prod.name}
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-orange-600 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        {displayTag}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setZoomedImage({
                            url: displayImg,
                            title: prod.name,
                          })
                        }
                        className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        <ZoomIn className="w-3 h-3" />
                        <span>사진 확대</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-400">
        <span>프랑브아즈(Framboise) 키즈 리빙 공식 AI 큐레이션</span>
        <span>© Framboise Kids Living</span>
      </div>

      {/* Product Image Zoom Lightbox Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <h4 className="text-sm font-bold text-neutral-900">
                  {zoomedImage.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-neutral-100">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 bg-neutral-50 text-center text-xs text-neutral-500">
              프랑브아즈 추천 연관 제품 스타일링 사진
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
