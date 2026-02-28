import { createContext, useContext, useState, ReactNode } from "react";
import { OnboardingData, defaultOnboardingData } from "@/types/onboarding";

// Demo data matching ProfileEditor
const demoData: OnboardingData = {
  ...defaultOnboardingData,
  firstName: "Alex",
  lastName: "Chen",
  headline: "CS student at UCL",
  university: "University College London",
  course: "BSc Computer Science",
  yearOfStudy: "2nd Year",
  expectedGraduation: "2027",
  bio: "Passionate about building products at the intersection of tech and finance.",
  location: "London, UK",
  linkedinUrl: "https://linkedin.com/in/alexchen",
  githubUrl: "https://github.com/alexchen",
  experiences: [
    {
      id: "1",
      type: "Internship",
      title: "Software Engineering Intern",
      organisation: "Google",
      startDate: "2025-06",
      endDate: "",
      isCurrent: true,
      description: "Working on frontend infrastructure for Google Cloud Console. Built reusable component library used by 20+ teams.",
    },
    {
      id: "2",
      type: "Society Role",
      title: "President",
      organisation: "UCL Tech Society",
      startDate: "2024-09",
      endDate: "2025-06",
      isCurrent: false,
      description: "Led a team of 30 committee members. Organised 15+ events including hackathons and speaker sessions.",
    },
    {
      id: "3",
      type: "Project",
      title: "FinTrack",
      organisation: "Personal Project",
      startDate: "2024-03",
      endDate: "2024-06",
      isCurrent: false,
      description: "Built a personal finance tracker with React and Supabase. 500+ users in first month.",
    },
  ],
  skills: [
    { id: "s1", name: "Python", proficiency: "advanced" },
    { id: "s2", name: "React", proficiency: "advanced" },
    { id: "s3", name: "TypeScript", proficiency: "intermediate" },
    { id: "s4", name: "Figma", proficiency: "intermediate" },
    { id: "s5", name: "SQL", proficiency: "advanced" },
  ],
  interests: ["Fintech", "UI Design", "Sustainability"],
  badges: [
    { id: "1", title: "Hackathon Winner", issuer: "MLH", dateReceived: "2025-01", category: "Competition", icon: "🏆" },
    { id: "2", title: "Dean's List 2025", issuer: "UCL", dateReceived: "2025-06", category: "Award", icon: "🎓" },
    { id: "3", title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", dateReceived: "2024-11", category: "Certification", icon: "💻" },
  ],
  activities: [
    { id: "1", title: "Attended UCL AI Summit 2025", type: "Conference", activityDate: "2025-03", note: "Met 3 potential co-founders" },
    { id: "2", title: "Volunteered at Freshers' Fair", type: "Event", activityDate: "2024-09", note: "Helped run the Tech Society stall" },
    { id: "3", title: "Bloomberg Tech Workshop", type: "Workshop", activityDate: "2024-11", note: "" },
  ],
  theme: "navy",
  openTo: "Product internships for Summer 2026, coffee chats about fintech",
};

interface ProfileContextType {
  data: OnboardingData;
  update: (partial: Partial<OnboardingData>) => void;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(demoData);
  const update = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  return (
    <ProfileContext.Provider value={{ data, update, setData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};
