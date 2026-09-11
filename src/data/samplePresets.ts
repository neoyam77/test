import { SamplePreset, ToneOption } from "../types";

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "다정하고 따뜻한 감성체",
    label: "다정하고 따뜻한 감성체",
    description: "엄마·아빠의 포근한 눈길로 우리 아이의 매일을 다정하게 감싸주는 문체",
    example: '"우리 아이의 꿈결이 더 깊고 평온해질 수 있도록..."',
  },
  {
    id: "세련된 키즈 인테리어 큐레이터체",
    label: "세련된 키즈 인테리어 큐레이터체",
    description: "감각적인 컬러와 공간의 조화를 돋보이게 하는 전문적인 스타일링 문체",
    example: '"자연스러운 뉴트럴 톤으로 아이방의 온도를 우아하게 완성합니다."',
  },
  {
    id: "친근하고 발랄한 키즈 프렌들리체",
    label: "친근하고 발랄한 키즈 프렌들리체",
    description: "아이들의 호기심과 즐거운 상상력을 돋우는 활기차고 귀여운 문체",
    example: '"매일 아침이 신나는 모험이 되는 우리 아이만의 특별한 공간!"',
  },
  {
    id: "정갈하고 신뢰감 있는 브랜드 공식체",
    label: "정갈하고 신뢰감 있는 브랜드 공식체",
    description: "안전성과 품질에 대한 확신을 정중하고 격조 있게 전달하는 어조",
    example: '"아이의 안전과 라이프스타일을 최우선으로 고려한 프랑브아즈의 공식 제안입니다."',
  },
];

export const PURPOSE_SUGGESTIONS = [
  "아이방 침실 (수면 공간)",
  "거실 키즈 플레이존 (놀이 공간)",
  "신생아 첫 베이비룸",
  "어린이집/유치원 입학 축하 선물",
  "아이만의 아지트 독서 코너",
  "감성 장난감·패브릭 수납 정리",
];

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "bedding",
    title: "프랑브아즈 쁘띠 코튼 키즈 베딩 세트",
    tag: "베딩 & 패브릭",
    purpose: "아이방 침실 (수면 공간)",
    tone: "다정하고 따뜻한 감성체",
    imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80",
    caption: "부드럽고 포근한 파스텔 웜톤의 키즈 침구 공간",
  },
  {
    id: "storage",
    title: "프랑브아즈 내추럴 우드 토이 정리 수납함",
    tag: "가구 & 수납",
    purpose: "거실 키즈 플레이존 (놀이 공간)",
    tone: "세련된 키즈 인테리어 큐레이터체",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    caption: "단정하고 정돈된 원목 질감의 아이방 수납존",
  },
  {
    id: "canopy",
    title: "프랑브아즈 몽슈슈 린넨 베이비 캐노피",
    tag: "인테리어 소품",
    purpose: "아이만의 아지트 독서 코너",
    tone: "친근하고 발랄한 키즈 프렌들리체",
    imageUrl: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=900&q=80",
    caption: "상상력을 자극하는 은은한 캐노피 아지트",
  },
];
