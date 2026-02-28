import { ThemeId } from "@/lib/themes";

export interface OnboardingData {
  // Step 1: Basics
  firstName: string;
  lastName: string;
  headline: string;
  university: string;
  course: string;
  yearOfStudy: string;
  expectedGraduation: string;
  profilePhoto: File | null;
  profilePhotoPreview: string;

  // Contact
  email: string;
  phone: string;
  portfolioUrl: string;

  // Step 2: About
  bio: string;
  location: string;
  websiteUrl: string;
  linkedinUrl: string;
  githubUrl: string;

  // Step 3: Experiences
  experiences: Experience[];

  // Education
  education: EducationEntry[];

  // Step 4: Skills & Interests
  skills: Skill[];
  interests: string[];

  // Languages
  languages: LanguageEntry[];

  // Step 5: Badges
  badges: BadgeEntry[];

  // Certifications
  certifications: CertificationEntry[];

  // Activities
  activities: ActivityEntry[];

  // Theme
  theme: ThemeId;

  // Open To
  openTo: string;
}

export interface Experience {
  id: string;
  type: string;
  title: string;
  organisation: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string;
  achievements: string;
  tools: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  grade: string;
  coursework: string;
  thesisTitle: string;
  description: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
}

export type LanguageProficiency = "Native" | "Fluent" | "Professional" | "Conversational" | "Basic";

export const LANGUAGE_PROFICIENCY_LEVELS: { value: LanguageProficiency; label: string; dots: number }[] = [
  { value: "Native", label: "Native", dots: 5 },
  { value: "Fluent", label: "Fluent", dots: 4 },
  { value: "Professional", label: "Professional", dots: 3 },
  { value: "Conversational", label: "Conversational", dots: 2 },
  { value: "Basic", label: "Basic", dots: 1 },
];

export interface BadgeEntry {
  id: string;
  title: string;
  issuer: string;
  dateReceived: string;
  category: string;
  icon: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  noExpiry: boolean;
  credentialId: string;
  credentialUrl: string;
}

export interface ActivityEntry {
  id: string;
  title: string;
  type: string;
  activityDate: string;
  note: string;
}

export type Proficiency = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
  id: string;
  name: string;
  proficiency: Proficiency;
}

export const PROFICIENCY_LEVELS: { value: Proficiency; label: string; percent: number; color: string }[] = [
  { value: "beginner", label: "Beginner", percent: 25, color: "bg-muted-foreground/30" },
  { value: "intermediate", label: "Intermediate", percent: 50, color: "bg-[hsl(36,60%,65%)]" },
  { value: "advanced", label: "Advanced", percent: 75, color: "bg-[hsl(213,52%,24%)]" },
  { value: "expert", label: "Expert", percent: 100, color: "bg-emerald-600" },
];

export const ACTIVITY_TYPES = [
  "Event",
  "Workshop",
  "Conference",
  "Hackathon",
  "Seminar",
  "Social",
  "Sports",
  "Other",
];

export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  Event: "bg-blue-100 text-blue-800",
  Workshop: "bg-purple-100 text-purple-800",
  Conference: "bg-teal-100 text-teal-800",
  Hackathon: "bg-orange-100 text-orange-800",
  Seminar: "bg-gray-100 text-gray-700",
  Social: "bg-pink-100 text-pink-800",
  Sports: "bg-green-100 text-green-800",
  Other: "bg-gray-100 text-gray-700",
};

export const defaultOnboardingData: OnboardingData = {
  firstName: "",
  lastName: "",
  headline: "",
  university: "",
  course: "",
  yearOfStudy: "",
  expectedGraduation: "",
  profilePhoto: null,
  profilePhotoPreview: "",
  email: "",
  phone: "",
  portfolioUrl: "",
  bio: "",
  location: "",
  websiteUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  interests: [],
  languages: [],
  badges: [],
  activities: [],
  theme: "navy",
  openTo: "",
};

export const EXPERIENCE_TYPES = [
  "Internship",
  "Part-time Job",
  "Volunteering",
  "Society Role",
  "Project",
  "Competition",
  "Research",
  "Other",
];

export const BADGE_CATEGORIES = [
  "Certification",
  "Award",
  "Achievement",
  "Competition",
  "Publication",
  "Other",
];

export const BADGE_ICONS = [
  "🏆", "🎓", "💼", "🏅", "⭐", "🎯", "📜", "🔬",
  "💡", "🚀", "📊", "🎨", "🛡️", "📝", "🌍", "💻",
];

export const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgrad"];
