import { forwardRef } from "react";
import { OnboardingData, LANGUAGE_PROFICIENCY_LEVELS } from "@/types/onboarding";
import { MapPin, Linkedin, Github, Mail, Phone, Palette } from "lucide-react";

export type CVPurpose = "job" | "university" | "social";
export type CVTemplate = "modern" | "classic" | "minimal";

export interface CVVisibility {
  education: boolean;
  experience: boolean;
  skills: boolean;
  interests: boolean;
  badges: boolean;
  certifications: boolean;
  languages: boolean;
  experienceIds: string[];
}

interface CVPreviewProps {
  data: OnboardingData;
  purpose: CVPurpose;
  visibility: CVVisibility;
  template: CVTemplate;
  matchedSkills?: Set<string>;
}

const sectionOrder: Record<CVPurpose, string[]> = {
  job: ["experience", "skills", "languages", "certifications", "education", "badges", "interests"],
  university: ["education", "experience", "skills", "languages", "certifications", "badges", "interests"],
  social: ["interests", "skills", "languages", "experience", "certifications", "education", "badges"],
};

const templateStyles: Record<CVTemplate, {
  fontFamily: string; heading: string; headingBorder: string; nameSize: string; nameColor: string;
  metaColor: string; bodyColor: string; subColor: string; skillBg: string; skillText: string;
  interestBg: string; interestText: string; accentColor: string; headerBg: string; headerPadding: string; sectionGap: string;
}> = {
  modern: {
    fontFamily: "'Inter', system-ui, sans-serif", heading: "text-[11px] font-bold uppercase tracking-wider",
    headingBorder: "border-b pb-1 mb-2", nameSize: "text-[18px]", nameColor: "text-[hsl(213,52%,24%)]",
    metaColor: "text-[hsl(0,0%,40%)]", bodyColor: "text-[hsl(0,0%,10%)]", subColor: "text-[hsl(0,0%,30%)]",
    skillBg: "bg-[hsl(213,52%,24%,0.08)]", skillText: "text-[hsl(213,52%,24%)]",
    interestBg: "bg-[hsl(40,20%,95%)]", interestText: "text-[hsl(0,0%,30%)]",
    accentColor: "hsl(213,52%,24%)", headerBg: "", headerPadding: "", sectionGap: "mb-4",
  },
  classic: {
    fontFamily: "'Georgia', 'Times New Roman', serif", heading: "text-[12px] font-bold uppercase tracking-[0.15em]",
    headingBorder: "border-b-2 border-[hsl(0,0%,20%)] pb-1 mb-2", nameSize: "text-[22px]", nameColor: "text-[hsl(0,0%,10%)]",
    metaColor: "text-[hsl(0,0%,45%)]", bodyColor: "text-[hsl(0,0%,10%)]", subColor: "text-[hsl(0,0%,35%)]",
    skillBg: "bg-[hsl(0,0%,93%)]", skillText: "text-[hsl(0,0%,20%)]",
    interestBg: "bg-[hsl(0,0%,93%)]", interestText: "text-[hsl(0,0%,35%)]",
    accentColor: "hsl(0,0%,20%)", headerBg: "", headerPadding: "", sectionGap: "mb-5",
  },
  minimal: {
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif", heading: "text-[10px] font-semibold uppercase tracking-[0.2em]",
    headingBorder: "border-b border-[hsl(0,0%,85%)] pb-1 mb-2", nameSize: "text-[16px]", nameColor: "text-[hsl(0,0%,15%)]",
    metaColor: "text-[hsl(0,0%,50%)]", bodyColor: "text-[hsl(0,0%,15%)]", subColor: "text-[hsl(0,0%,40%)]",
    skillBg: "bg-transparent border border-[hsl(0,0%,80%)]", skillText: "text-[hsl(0,0%,30%)]",
    interestBg: "bg-transparent border border-[hsl(0,0%,80%)]", interestText: "text-[hsl(0,0%,40%)]",
    accentColor: "hsl(0,0%,30%)", headerBg: "", headerPadding: "", sectionGap: "mb-3",
  },
};

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data, purpose, visibility, template, matchedSkills }, ref) => {
    const t = templateStyles[template];
    const visibleExperiences = data.experiences.filter((e) => visibility.experienceIds.includes(e.id));

    const formatDate = (d: string) => {
      if (!d) return "";
      const [y, m] = d.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    };

    const headingStyle = `${t.heading} ${t.headingBorder}`;
    const isSkillMatched = (skillName: string) => matchedSkills ? matchedSkills.has(skillName.toLowerCase()) : false;

    const sections: Record<string, JSX.Element | null> = {
      education: visibility.education && (data.education?.length > 0 || data.university) ? (
        <div key="education" className={t.sectionGap}>
          <h2 className={headingStyle} style={{ color: t.accentColor, borderColor: `${t.accentColor}33` }}>Education</h2>
          <div className="space-y-2">
            {data.education?.length > 0 ? data.education.map((edu) => (
              <div key={edu.id}>
                <p className={`text-[10px] font-semibold ${t.bodyColor}`}>{edu.degree}</p>
                <p className={`text-[9px] ${t.metaColor}`}>
                  {edu.institution}
                  {edu.startDate ? ` · ${formatDate(edu.startDate)} – ${edu.isCurrent ? "Present" : formatDate(edu.endDate)}` : ""}
                </p>
                {edu.grade && <p className={`text-[8.5px] ${t.subColor}`}>Grade: {edu.grade}</p>}
                {edu.coursework && <p className={`text-[8px] ${t.subColor} italic mt-0.5`}>{edu.coursework}</p>}
                {edu.thesisTitle && <p className={`text-[8px] ${t.subColor} mt-0.5`}>Thesis: {edu.thesisTitle}</p>}
              </div>
            )) : (
              <div>
                <p className={`text-[10px] font-semibold ${t.bodyColor}`}>{data.university}</p>
                <p className={`text-[9px] ${t.metaColor}`}>
                  {data.course}{data.yearOfStudy ? ` · ${data.yearOfStudy}` : ""}
                  {data.expectedGraduation ? ` · Expected ${data.expectedGraduation}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null,

      experience: visibility.experience && visibleExperiences.length > 0 ? (
        <div key="experience" className={t.sectionGap}>
          <h2 className={headingStyle} style={{ color: t.accentColor, borderColor: `${t.accentColor}33` }}>Experience</h2>
          <div className="space-y-2.5">
            {visibleExperiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <p className={`text-[10px] font-semibold ${t.bodyColor}`}>{exp.title}</p>
                  <p className={`text-[8px] ${t.metaColor} shrink-0 ml-2`}>
                    {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                <p className="text-[9px] font-medium" style={{ color: t.accentColor }}>
                  {exp.organisation} · {exp.type}
                </p>
                {/* Structured fields */}
                {exp.responsibilities && (
                  <div className="mt-0.5">
                    <p className={`text-[8px] font-semibold ${t.bodyColor}`}>Responsibilities</p>
                    <p className={`text-[8.5px] ${t.subColor} leading-[1.4]`}>{exp.responsibilities}</p>
                  </div>
                )}
                {exp.achievements && (
                  <div className="mt-0.5">
                    <p className={`text-[8px] font-semibold ${t.bodyColor}`}>Achievements</p>
                    <p className={`text-[8.5px] ${t.subColor} leading-[1.4]`}>{exp.achievements}</p>
                  </div>
                )}
                {exp.tools?.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {exp.tools.map((tool) => (
                      <span key={tool} className={`text-[7px] px-1 py-0 rounded-sm ${t.skillBg} ${t.skillText}`}>{tool}</span>
                    ))}
                  </div>
                )}
                {/* Fallback legacy description */}
                {exp.description && !exp.responsibilities && !exp.achievements && (
                  <p className={`text-[8.5px] ${t.subColor} mt-0.5 leading-[1.4]`}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

      skills: visibility.skills && data.skills.length > 0 ? (
        <div key="skills" className={t.sectionGap}>
          <h2 className={headingStyle} style={{ color: t.accentColor, borderColor: `${t.accentColor}33` }}>Skills</h2>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((skill) => {
              const matched = isSkillMatched(skill.name);
              const dots = skill.proficiency === "expert" ? "●●●●" : skill.proficiency === "advanced" ? "●●●○" : skill.proficiency === "intermediate" ? "●●○○" : "●○○○";
              return (
                <span key={skill.id} className={`text-[8px] px-1.5 py-0.5 rounded-sm font-medium ${matched ? "bg-[hsl(213,52%,24%)] text-white" : `${t.skillBg} ${t.skillText}`}`}>
                  {skill.name} <span className="opacity-50 ml-0.5">{dots}</span>
                </span>
              );
            })}
          </div>
        </div>
      ) : null,

      languages: visibility.languages && (data.languages?.length ?? 0) > 0 ? (
        <div key="languages" className={t.sectionGap}>
          <h2 className={headingStyle} style={{ color: t.accentColor, borderColor: `${t.accentColor}33` }}>Languages</h2>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => {
              const level = LANGUAGE_PROFICIENCY_LEVELS.find((l) => l.value === lang.proficiency) ?? LANGUAGE_PROFICIENCY_LEVELS[3];
              const langDots = Array.from({ length: 5 }, (_, i) => i < level.dots ? "●" : "○").join("");
              return (
                <span key={lang.id} className={`text-[8px] px-1.5 py-0.5 rounded-sm font-medium ${t.skillBg} ${t.skillText}`}>
                  {lang.language} <span className="opacity-50 ml-0.5">{langDots}</span>
                </span>
              );
            })}
          </div>
        </div>
      ) : null,

      interests: visibility.interests && data.interests.length > 0 ? (
        <div key="interests" className={t.sectionGap}>
          <h2 className={headingStyle} style={{ color: t.accentColor, borderColor: `${t.accentColor}33` }}>Interests</h2>
          <div className="flex flex-wrap gap-1">
            {data.interests.map((interest) => (
              <span key={interest} className={`text-[8px] px-1.5 py-0.5 rounded-sm font-medium ${t.interestBg} ${t.interestText}`}>{interest}</span>
            ))}
          </div>
        </div>
      ) : null,

      certifications: visibility.certifications && (data.certifications?.length ?? 0) > 0 ? (
        <div key="certifications" className={t.sectionGap}>
          <h2 className={headingStyle} style={{ color: t.accentColor, borderColor: `${t.accentColor}33` }}>Certifications</h2>
          <div className="space-y-1">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex items-baseline gap-1.5">
                <span className={`text-[9px] font-medium ${t.bodyColor}`}>{cert.name}</span>
                <span className={`text-[8px] ${t.metaColor}`}>— {cert.issuer}</span>
                {cert.issueDate && <span className={`text-[7.5px] ${t.metaColor}`}>({cert.issueDate.replace("-", "/")})</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

      badges: visibility.badges && data.badges.length > 0 ? (
        <div key="badges" className={t.sectionGap}>
          <h2 className={headingStyle} style={{ color: t.accentColor, borderColor: `${t.accentColor}33` }}>Awards & Achievements</h2>
          <div className="space-y-1">
            {data.badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-1.5">
                <span className="text-[10px]">{badge.icon}</span>
                <span className={`text-[9px] font-medium ${t.bodyColor}`}>{badge.title}</span>
                <span className={`text-[8px] ${t.metaColor}`}>— {badge.issuer}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null,
    };

    const orderedSections = sectionOrder[purpose].map((key) => sections[key]).filter(Boolean);

    return (
      <div ref={ref} className="bg-white w-[595px] min-h-[842px] p-10" style={{ fontFamily: t.fontFamily, color: "hsl(0,0%,10%)" }}>
        {/* Header with contact details */}
        <div className={`mb-5 ${t.headerPadding}`} style={{ background: t.headerBg || undefined }}>
          <h1 className={`${t.nameSize} font-bold leading-tight ${t.nameColor}`}>{data.firstName} {data.lastName}</h1>
          {data.headline && <p className={`text-[10px] ${t.metaColor} mt-0.5`}>{data.headline}</p>}
          <div className={`flex flex-wrap items-center gap-3 mt-2 text-[8px] ${t.metaColor}`}>
            {data.email && (
              <span className="flex items-center gap-0.5"><Mail className="w-2.5 h-2.5" /> {data.email}</span>
            )}
            {data.phone && (
              <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" /> {data.phone}</span>
            )}
            {data.location && (
              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {data.location}</span>
            )}
            {data.linkedinUrl && (
              <span className="flex items-center gap-0.5"><Linkedin className="w-2.5 h-2.5" /> LinkedIn</span>
            )}
            {data.githubUrl && (
              <span className="flex items-center gap-0.5"><Github className="w-2.5 h-2.5" /> GitHub</span>
            )}
            {data.portfolioUrl && (
              <span className="flex items-center gap-0.5"><Palette className="w-2.5 h-2.5" /> Portfolio</span>
            )}
          </div>
        </div>

        {/* Bio */}
        {data.bio && <p className={`text-[9px] ${t.subColor} leading-[1.5] mb-4`}>{data.bio}</p>}

        {/* Sections */}
        {orderedSections}
      </div>
    );
  }
);

CVPreview.displayName = "CVPreview";

export default CVPreview;
