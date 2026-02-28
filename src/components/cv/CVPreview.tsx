import { forwardRef } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Badge } from "@/components/ui/badge";
import { MapPin, Linkedin, Github, Globe, Mail } from "lucide-react";

export type CVPurpose = "job" | "university" | "social";

export interface CVVisibility {
  education: boolean;
  experience: boolean;
  skills: boolean;
  interests: boolean;
  badges: boolean;
  experienceIds: string[];
}

interface CVPreviewProps {
  data: OnboardingData;
  purpose: CVPurpose;
  visibility: CVVisibility;
}

const sectionOrder: Record<CVPurpose, string[]> = {
  job: ["experience", "skills", "education", "badges", "interests"],
  university: ["education", "experience", "skills", "badges", "interests"],
  social: ["interests", "skills", "experience", "education", "badges"],
};

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data, purpose, visibility }, ref) => {
    const visibleExperiences = data.experiences.filter((e) =>
      visibility.experienceIds.includes(e.id)
    );

    const formatDate = (d: string) => {
      if (!d) return "";
      const [y, m] = d.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    };

    const sections: Record<string, JSX.Element | null> = {
      education: visibility.education ? (
        <div key="education" className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[hsl(213,52%,24%)] border-b border-[hsl(213,52%,24%)/0.2] pb-1 mb-2">
            Education
          </h2>
          <div>
            <p className="text-[10px] font-semibold text-[hsl(0,0%,10%)]">{data.university}</p>
            <p className="text-[9px] text-[hsl(0,0%,40%)]">
              {data.course}{data.yearOfStudy ? ` · ${data.yearOfStudy}` : ""}
              {data.expectedGraduation ? ` · Expected ${data.expectedGraduation}` : ""}
            </p>
          </div>
        </div>
      ) : null,

      experience: visibility.experience && visibleExperiences.length > 0 ? (
        <div key="experience" className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[hsl(213,52%,24%)] border-b border-[hsl(213,52%,24%)/0.2] pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-2.5">
            {visibleExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className="text-[10px] font-semibold text-[hsl(0,0%,10%)]">{exp.title}</p>
                  <p className="text-[8px] text-[hsl(0,0%,40%)] shrink-0 ml-2">
                    {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                <p className="text-[9px] text-[hsl(213,52%,24%)] font-medium">{exp.organisation} · {exp.type}</p>
                {exp.description && (
                  <p className="text-[8.5px] text-[hsl(0,0%,30%)] mt-0.5 leading-[1.4]">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

      skills: visibility.skills && data.skills.length > 0 ? (
        <div key="skills" className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[hsl(213,52%,24%)] border-b border-[hsl(213,52%,24%)/0.2] pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="text-[8px] px-1.5 py-0.5 rounded-sm bg-[hsl(213,52%,24%)/0.08] text-[hsl(213,52%,24%)] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ) : null,

      interests: visibility.interests && data.interests.length > 0 ? (
        <div key="interests" className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[hsl(213,52%,24%)] border-b border-[hsl(213,52%,24%)/0.2] pb-1 mb-2">
            Interests
          </h2>
          <div className="flex flex-wrap gap-1">
            {data.interests.map((interest) => (
              <span
                key={interest}
                className="text-[8px] px-1.5 py-0.5 rounded-sm bg-[hsl(40,20%,95%)] text-[hsl(0,0%,30%)] font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      ) : null,

      badges: visibility.badges && data.badges.length > 0 ? (
        <div key="badges" className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[hsl(213,52%,24%)] border-b border-[hsl(213,52%,24%)/0.2] pb-1 mb-2">
            Certifications & Awards
          </h2>
          <div className="space-y-1">
            {data.badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-1.5">
                <span className="text-[10px]">{badge.icon}</span>
                <span className="text-[9px] font-medium text-[hsl(0,0%,10%)]">{badge.title}</span>
                <span className="text-[8px] text-[hsl(0,0%,40%)]">— {badge.issuer}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null,
    };

    const orderedSections = sectionOrder[purpose]
      .map((key) => sections[key])
      .filter(Boolean);

    return (
      <div
        ref={ref}
        className="bg-white text-[hsl(0,0%,10%)] w-[595px] min-h-[842px] p-10 font-sans"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[18px] font-bold text-[hsl(213,52%,24%)] leading-tight">
            {data.firstName} {data.lastName}
          </h1>
          {data.headline && (
            <p className="text-[10px] text-[hsl(0,0%,40%)] mt-0.5">{data.headline}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[8px] text-[hsl(0,0%,40%)]">
            {data.location && (
              <span className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> {data.location}
              </span>
            )}
            {data.linkedinUrl && (
              <span className="flex items-center gap-0.5">
                <Linkedin className="w-2.5 h-2.5" /> LinkedIn
              </span>
            )}
            {data.githubUrl && (
              <span className="flex items-center gap-0.5">
                <Github className="w-2.5 h-2.5" /> GitHub
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {data.bio && (
          <p className="text-[9px] text-[hsl(0,0%,30%)] leading-[1.5] mb-4">{data.bio}</p>
        )}

        {/* Sections */}
        {orderedSections}
      </div>
    );
  }
);

CVPreview.displayName = "CVPreview";

export default CVPreview;
