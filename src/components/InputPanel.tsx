import React, { useRef, useState } from "react";
import { Upload, X, Wand2, Image as ImageIcon, Check, Info } from "lucide-react";
import { ProposalTone } from "../types";
import { TONE_OPTIONS, PURPOSE_SUGGESTIONS, SAMPLE_PRESETS } from "../data/samplePresets";
import { fileToBase64, urlToBase64 } from "../utils/imageUtils";

interface InputPanelProps {
  imagePreview: string | null;
  setImagePreview: (val: string | null) => void;
  purpose: string;
  setPurpose: (val: string) => void;
  tone: ProposalTone;
  setTone: (val: ProposalTone) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  imagePreview,
  setImagePreview,
  purpose,
  setPurpose,
  tone,
  setTone,
  onSubmit,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [presetLoading, setPresetLoading] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch (err) {
        console.error("파일 처리 실패:", err);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch (err) {
        console.error("드롭 이미지 처리 실패:", err);
      }
    }
  };

  const handleSelectPreset = async (presetId: string) => {
    const target = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!target) return;
    try {
      setPresetLoading(presetId);
      const base64 = await urlToBase64(target.imageUrl);
      setImagePreview(base64);
      setPurpose(target.purpose);
      setTone(target.tone);
    } catch (err) {
      console.error("샘플 프리셋 로드 실패:", err);
      // Fallback directly using image url
      setImagePreview(target.imageUrl);
      setPurpose(target.purpose);
      setTone(target.tone);
    } finally {
      setPresetLoading(null);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex flex-col gap-6">
      {/* Section 1: 제품 이미지 1장 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
            제품 이미지 1장
            <span className="text-xs font-normal text-orange-600 bg-orange-50 border border-orange-200/60 px-2 py-0.2 rounded-full">
              필수
            </span>
          </label>
          {imagePreview && (
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              이미지 지우기
            </button>
          )}
        </div>

        {/* Upload Box or Image Preview */}
        {!imagePreview ? (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-orange-500 bg-orange-50/50"
                  : "border-neutral-200 hover:border-orange-400 hover:bg-neutral-50/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2.5">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    프랑브아즈 제품 사진을 업로드하세요
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    클릭하여 사진 선택 또는 여기에 드래그 앤 드롭 (JPG, PNG, WebP)
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <p className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                추천 샘플 이미지로 바로 테스트:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={presetLoading === preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className="group relative flex flex-col items-center text-left p-1.5 rounded-lg border border-neutral-200 hover:border-orange-400 bg-neutral-50/50 hover:bg-orange-50/30 transition-all text-xs"
                  >
                    <div className="w-full h-14 rounded-md overflow-hidden bg-neutral-200 relative mb-1.5">
                      <img
                        src={preset.imageUrl}
                        alt={preset.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {presetLoading === preset.id && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-neutral-800 truncate w-full">
                      {preset.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-xl border border-neutral-200 overflow-hidden bg-neutral-900 group">
            <img
              src={imagePreview}
              alt="선택된 제품"
              referrerPolicy="no-referrer"
              className="w-full max-h-72 object-contain bg-neutral-950/90 mx-auto"
            />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-white/90 hover:bg-white text-neutral-800 font-medium px-2.5 py-1 rounded-md shadow-xs transition-colors"
              >
                변경
              </button>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs bg-black/60 hover:bg-black/80 text-white p-1 rounded-md transition-colors"
                aria-label="삭제"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Section 2: 사용할 장소나 목적 */}
      <div>
        <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
          사용할 장소나 목적
        </label>
        <p className="text-xs text-neutral-500 mb-2.5">
          아이방, 거실 놀이공간, 입학 선물 등 제품이 놓일 맥락을 알려주세요.
        </p>

        {/* Quick Selection Chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {PURPOSE_SUGGESTIONS.map((sug) => {
            const isSelected = purpose === sug;
            return (
              <button
                key={sug}
                type="button"
                onClick={() => setPurpose(sug)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? "bg-orange-50 border-orange-400 text-orange-700 font-medium"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {sug}
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="예: 3세 아이방 침실 수면 독립 공간 연출"
          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 outline-hidden text-sm transition-all"
        />
      </div>

      {/* Section 3: 제안 문체 */}
      <div>
        <label className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
          제안 문체
        </label>
        <p className="text-xs text-neutral-500 mb-2.5">
          브랜드 메시지와 어조를 고객 상황에 맞추어 선택하세요.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TONE_OPTIONS.map((item) => {
            const isSelected = tone === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTone(item.id)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-orange-50/60 border-orange-500 ring-1 ring-orange-500/50"
                    : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                }`}
              >
                <div className="flex items-start justify-between w-full mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-orange-700" : "text-neutral-800"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 leading-snug">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guidance Notice */}
      <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          사진으로 확인할 수 없는 <strong>가격·크기·소재·성능</strong>은 AI가
          추측하지 않고 <strong>‘[확인 필요]’</strong>로 명시하여 정확한 정보를 안내합니다.
        </p>
      </div>

      {/* Primary Action Button: ‘AI 제안문 만들기’ 1개 */}
      <button
        id="btn-generate-proposal"
        type="button"
        disabled={!imagePreview || isLoading}
        onClick={onSubmit}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          !imagePreview || isLoading
            ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
            : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 active:scale-[0.99] cursor-pointer"
        }`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>프랑브아즈 AI가 제안 카드를 구성하는 중...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            <span>AI 제안문 만들기</span>
          </>
        )}
      </button>
    </section>
  );
};
