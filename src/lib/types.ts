export type AgeGroup = "Children" | "Teens" | "Adults" | "All Ages";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
export type VideoCategory = "Tutorial" | "Performance" | "Student Showcase" | "Practice Tip";

export interface ClassItem {
  id: string;
  title: string;
  ageGroup: AgeGroup;
  level: SkillLevel;
  duration: string;
  format: string;
  priceNote: string;
  summary: string;
  highlights: string[];
  featured?: boolean;
  published: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  category: VideoCategory;
  duration: string;
  description: string;
  published: boolean;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  published: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  published: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PillarItem {
  title: string;
  description: string;
}

export interface StudioProfile {
  brandName: string;
  teacherName: string;
  location: string;
  heroTag: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  aboutHeadline: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutQuote: string;
  aboutImageUrl: string;
  whatsappPrimary: string;
  whatsappSecondary: string;
  phoneDisplayPrimary: string;
  phoneDisplaySecondary: string;
  email: string;
  youtubeChannelUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  teachingHours: string;
  pillars: PillarItem[];
}

export interface SiteContent {
  profile: StudioProfile;
  classes: ClassItem[];
  videos: VideoItem[];
  articles: ArticleItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  updatedAt: string;
}
