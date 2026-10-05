export interface RuntimeConfig {
  apiBase: string;
  runtimeMode: string;
  platformTarget: string;
}

export interface NavLink {
  label: string;
  path: string;
  pageKey: string;
}

export interface FeatureCard {
  title: string;
  text: string;
  badge?: string;
  link?: string;
  linkText?: string;
}

export interface StatItem {
  label: string;
  value: string;
  count?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  description: string;
  chips?: string[];
  cta?: { label: string; path: string };
  panelLabel?: string;
  panelTitle?: string;
  panelItems?: string[];
}

export interface ContentSection {
  eyebrow?: string;
  heading: string;
  intro?: string;
  layout?: 'cards' | 'stats' | 'faq' | 'list' | 'process';
  columns?: number;
  cards?: FeatureCard[];
  stats?: StatItem[];
  faqs?: FaqItem[];
  bulletGroups?: Array<{ title: string; items: string[] }>;
}

export interface CtaContent {
  eyebrow?: string;
  title: string;
  text: string;
  primaryLabel: string;
  primaryPath: string;
  secondaryLabel?: string;
  secondaryPath?: string;
}

export interface ContentPageData {
  key: string;
  seoTitle: string;
  seoDescription: string;
  hero: HeroContent;
  sections: ContentSection[];
  cta: CtaContent;
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  interest: string;
  message: string;
  source?: string;
}

export interface Workshop {
  title: string;
  type: string;
  description: string;
  schedule_text: string;
  duration_text: string;
  level_text: string;
  cta_text: string;
  cta_link: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LeadCaptureData {
  name: string;
  contact: string;
  learnerType: string;
  interest: string;
}
