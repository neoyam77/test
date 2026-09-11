export interface RelatedProduct {
  name: string;
  description: string;
}

export interface ProposalResult {
  title: string;
  introduction: string;
  advantages: string[];
  requiredChecks: string[];
  relatedProducts: RelatedProduct[];
}

export type ProposalTone =
  | "다정하고 따뜻한 감성체"
  | "세련된 키즈 인테리어 큐레이터체"
  | "친근하고 발랄한 키즈 프렌들리체"
  | "정갈하고 신뢰감 있는 브랜드 공식체";

export interface ToneOption {
  id: ProposalTone;
  label: string;
  description: string;
  example: string;
}

export interface SamplePreset {
  id: string;
  title: string;
  tag: string;
  purpose: string;
  tone: ProposalTone;
  imageUrl: string;
  caption: string;
}
