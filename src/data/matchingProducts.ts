import { RelatedProduct } from "../types";

export interface FramboiseCatalogItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  tag: string;
  keywords: string[];
}

export const FRAMBOISE_CATALOG: FramboiseCatalogItem[] = [
  {
    id: "bedding-pillow",
    name: "프랑브아즈 오가닉 쁘띠 베개 커버 세트",
    category: "베딩 & 패브릭",
    description: "동일한 웜톤 패브릭 라인으로 침실과 놀이 공간을 통일감 있고 포근하게 연출해 줍니다.",
    imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    tag: "인기 침구 매칭",
    keywords: ["베개", "이불", "침구", "베딩", "패브릭", "커버", "침대", "수면", "오가닉", "베이비룸"],
  },
  {
    id: "storage-basket",
    name: "프랑브아즈 내추럴 캔버스 수납 바스켓",
    category: "가구 & 수납",
    description: "아이의 장난감이나 소품들을 깔끔하고 감성적으로 정돈할 수 있는 필수 매칭 아이템입니다.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    tag: "수납 필수 매칭",
    keywords: ["바스켓", "수납", "정리", "바구니", "정리함", "수납함", "장난감", "캔버스"],
  },
  {
    id: "canopy-tent",
    name: "프랑브아즈 몽슈슈 린넨 베이비 캐노피",
    category: "소품 & 아지트",
    description: "은은한 햇살과 조명을 부드럽게 걸러주어 아이만의 아늑한 독서 및 비밀 아지트를 완성합니다.",
    imageUrl: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80",
    tag: "감성 공간 연출",
    keywords: ["캐노피", "텐트", "아지트", "독서", "플레이텐트", "비밀기지", "인디언텐트"],
  },
  {
    id: "round-rug",
    name: "프랑브아즈 포근 양모 원형 놀이방 러그",
    category: "러그 & 매트",
    description: "발끝에 닿는 감촉이 부드러운 도톰한 원형 러그로, 차가운 바닥을 보온하고 안전한 놀이존을 만듭니다.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tag: "바닥 인테리어",
    keywords: ["러그", "매트", "카페트", "바닥", "원형", "양모", "놀이방", "플레이존"],
  },
  {
    id: "cloud-nightlight",
    name: "프랑브아즈 쁘띠 클라우드 충전식 무드등",
    category: "조명 & 모빌",
    description: "눈부심 없는 은은한 웜 옐로우 라이트로 밤중 수유와 잠자리 수면 의식을 편안하게 돕습니다.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    tag: "수면 안심 조명",
    keywords: ["무드등", "조명", "수면등", "스탠드", "램프", "모빌", "밤", "취침", "클라우드"],
  },
  {
    id: "bumper-guard",
    name: "프랑브아즈 세이프티 범퍼 쿠션 가드",
    category: "안전 & 쿠션",
    description: "포근한 볼륨감과 안전한 쿠셔닝으로 아기 침대 벽면 충돌을 방지하고 안락함을 더합니다.",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    tag: "안전 가드 쿠션",
    keywords: ["가드", "범퍼", "쿠션", "안전", "방석", "침대가드", "벽쿠션", "안전가드"],
  },
  {
    id: "wooden-bookshelf",
    name: "프랑브아즈 자작나무 전면 키즈 북선반",
    category: "가구 & 수납",
    description: "아이 눈높이에 맞춰 책 표지가 보이도록 진열하여 자연스러운 독서 습관을 길러주는 원목 선반입니다.",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    tag: "원목 키즈 가구",
    keywords: ["책장", "선반", "북선반", "책꽂이", "원목", "자작나무", "가구", "독서대"],
  },
  {
    id: "gauze-blanket",
    name: "프랑브아즈 100% 코튼 거즈 낮잠 블랭킷",
    category: "베딩 & 패브릭",
    description: "가볍고 통기성이 우수한 다중직 거즈 원단으로 사계절 외출이나 유치원 낮잠용으로 제격입니다.",
    imageUrl: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80",
    tag: "휴대용 블랭킷",
    keywords: ["블랭킷", "담요", "낮잠", "거즈", "이불", "외출", "유모차", "덮개"],
  },
];

/**
 * Resolves an appropriate image URL and category for a recommended related product
 * by analyzing its name, category, and description against the Framboise catalog.
 */
export function resolveRelatedProductImage(prod: Partial<RelatedProduct>, fallbackIndex = 0): {
  imageUrl: string;
  category: string;
  tag: string;
} {
  // If product already provides a valid image URL, return it
  if (prod.imageUrl && prod.imageUrl.startsWith("http")) {
    return {
      imageUrl: prod.imageUrl,
      category: prod.category || "키즈 리빙 컬렉션",
      tag: prod.tag || "추천 매칭",
    };
  }

  const searchText = `${prod.name || ""} ${prod.category || ""} ${prod.description || ""}`.toLowerCase();

  // Score matching catalog items
  let bestMatch = FRAMBOISE_CATALOG[fallbackIndex % FRAMBOISE_CATALOG.length];
  let highestScore = 0;

  for (const item of FRAMBOISE_CATALOG) {
    let score = 0;
    for (const kw of item.keywords) {
      if (searchText.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    if (searchText.includes(item.category.toLowerCase())) {
      score += 3;
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return {
    imageUrl: bestMatch.imageUrl,
    category: prod.category || bestMatch.category,
    tag: prod.tag || bestMatch.tag,
  };
}
