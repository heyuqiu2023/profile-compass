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

  // Step 2: About
  bio: string;
  location: string;
  websiteUrl: string;
  linkedinUrl: string;
  githubUrl: string;

  // Step 3: Experiences
  experiences: Experience[];

  // Step 4: Skills & Interests
  skills: string[];
  interests: string[];

  // Step 5: Badges
  badges: BadgeEntry[];

  // Theme
  theme: ThemeId;
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
}

export interface BadgeEntry {
  id: string;
  title: string;
  issuer: string;
  dateReceived: string;
  category: string;
  icon: string;
}

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
  bio: "",
  location: "",
  websiteUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  experiences: [],
  skills: [],
  interests: [],
  badges: [],
  theme: "navy",
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
