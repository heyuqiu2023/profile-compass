import { useMemo } from "react";
import { OnboardingData } from "@/types/onboarding";

interface Props {
  data: OnboardingData;
}

interface Suggestion {
  text: string;
  weight: number;
}

const ProfileCompletenessRing = ({ data }: Props) => {
  const { percentage, suggestions } = useMemo(() => {
    let score = 0;
    const tips: Suggestion[] = [];

    // Photo: 10%
    if (data.profilePhotoPreview) score += 10;
    else tips.push({ text: "Add a profile photo", weight: 10 });

    // Headline: 5%
    if (data.headline.trim()) score += 5;
    else tips.push({ text: "Add a headline", weight: 5 });

    // Bio: 5%
    if (data.bio.trim()) score += 5;
    else tips.push({ text: "Write a short bio", weight: 5 });

    // Education: 15%
    if ((data.education?.length ?? 0) >= 1) score += 15;
    else tips.push({ text: "Add at least 1 education entry", weight: 15 });

    // Experience with structured descriptions: 20%
    const hasStructuredExp = data.experiences.some((e) => e.responsibilities?.trim() || e.achievements?.trim());
    if (data.experiences.length >= 1 && hasStructuredExp) score += 20;
    else if (data.experiences.length >= 1) { score += 10; tips.push({ text: "Add structured descriptions to an experience", weight: 10 }); }
    else tips.push({ text: "Add at least 1 experience", weight: 20 });

    // Skills: 10%
    if (data.skills.length >= 3) score += 10;
    else tips.push({ text: "Add at least 3 skills", weight: 10 });

    // Language: 5%
    if ((data.languages?.length ?? 0) >= 1) score += 5;
    else tips.push({ text: "Add at least 1 language", weight: 5 });

    // Certification: 5%
    if ((data.certifications?.length ?? 0) >= 1) score += 5;
    else tips.push({ text: "Add a certification", weight: 5 });

    // Badge: 5%
    if (data.badges.length >= 1) score += 5;
    else tips.push({ text: "Add a badge", weight: 5 });

    // Interest: 5%
    if (data.interests.length >= 1) score += 5;
    else tips.push({ text: "Add an interest", weight: 5 });

    // LinkedIn: 5%
    if (data.linkedinUrl.trim()) score += 5;
    else tips.push({ text: "Add your LinkedIn URL", weight: 5 });

    // Phone or email: 5%
    if (data.phone?.trim() || data.email?.trim()) score += 5;
    else tips.push({ text: "Add phone or email", weight: 5 });

    // Open To: 5%
    if (data.openTo.trim()) score += 5;
    else tips.push({ text: "Fill in what you're open to", weight: 5 });

    tips.sort((a, b) => b.weight - a.weight);
    const topSuggestions = tips.slice(0, 2).map((t) => {
      const nextScore = Math.min(100, score + t.weight);
      return `${t.text} to reach ${nextScore}%`;
    });

    return { percentage: Math.min(100, score), suggestions: topSuggestions };
  }, [data]);

  const ringColor =
    percentage >= 70 ? "#1e3a5f" :
    percentage >= 40 ? "#c8b89a" :
    "#ef4444";

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="8" className="stroke-muted/30" />
          <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="8" stroke={ringColor} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.6s ease-out, stroke 0.3s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{percentage}%</span>
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Profile Completeness</p>
      {percentage < 100 && suggestions.length > 0 && (
        <div className="space-y-1 text-center max-w-xs">
          {suggestions.map((s, i) => (
            <p key={i} className="text-xs text-muted-foreground">💡 {s}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletenessRing;
