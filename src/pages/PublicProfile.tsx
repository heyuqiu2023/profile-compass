import { useState } from "react";
import { PROFICIENCY_LEVELS, Proficiency, LANGUAGE_PROFICIENCY_LEVELS, LanguageProficiency, EducationEntry } from "@/types/onboarding";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Github, Globe, MapPin, GraduationCap, ChevronDown, ChevronUp, Briefcase, CalendarDays, ExternalLink, ShieldCheck, Mail, Palette } from "lucide-react";
import { THEMES, ThemeId, ThemeColors } from "@/lib/themes";
import { ACTIVITY_TYPE_COLORS } from "@/types/onboarding";

// Demo data
const demoProfile = {
  firstName: "Alex",
  lastName: "Chen",
  headline: "CS student at UCL",
  university: "University College London",
  course: "BSc Computer Science",
  yearOfStudy: "2nd Year",
  bio: "Passionate about building products at the intersection of tech and finance. Currently exploring ML and its applications in fintech. Always looking for new challenges and people to collaborate with.",
  location: "London, UK",
  profilePhotoPreview: "",
  linkedinUrl: "https://linkedin.com/in/alexchen",
  githubUrl: "https://github.com/alexchen",
  websiteUrl: "https://alexchen.dev",
  theme: "navy" as ThemeId,
  openTo: "Product internships for Summer 2026, coffee chats about fintech",
  email: "alex.chen@ucl.ac.uk",
  portfolioUrl: "https://alexchen.dev/portfolio",
};

const demoExperiences = [
  { id: "1", type: "Internship", title: "Software Engineering Intern", organisation: "Google", startDate: "2025-06", endDate: "", isCurrent: true, description: "", responsibilities: "Building reusable React components for the Cloud Console design system. Reviewing PRs and mentoring junior interns.", achievements: "Component library adopted by 20+ teams. Improved page load times by 30% through code splitting.", tools: ["React", "TypeScript", "Storybook", "GCP"] },
  { id: "2", type: "Society Role", title: "President", organisation: "UCL Tech Society", startDate: "2024-09", endDate: "2025-06", isCurrent: false, description: "", responsibilities: "Managing 30 committee members. Planning event calendar. Managing £15k budget.", achievements: "Grew membership from 200 to 500. Secured sponsorships from Google, Meta, Bloomberg.", tools: ["Notion", "Slack", "Figma"] },
  { id: "3", type: "Project", title: "FinTrack", organisation: "Personal Project", startDate: "2024-03", endDate: "2024-06", isCurrent: false, description: "Built a personal finance tracker with React and Supabase. 500+ users in first month.", responsibilities: "", achievements: "500+ users in first month. Featured on Product Hunt.", tools: ["React", "Supabase", "Tailwind CSS", "Vercel"] },
  { id: "4", type: "Research", title: "Undergraduate Researcher", organisation: "UCL NLP Group", startDate: "2024-01", endDate: "2024-05", isCurrent: false, description: "Researched transformer-based models for financial sentiment analysis. Co-authored paper submitted to ACL 2025.", responsibilities: "", achievements: "", tools: [] },
];

const demoEducation: EducationEntry[] = [
  { id: "e1", institution: "University College London", degree: "BSc Computer Science", startDate: "2023-09", endDate: "", isCurrent: true, grade: "First Class (predicted)", coursework: "Algorithms, Machine Learning, Software Engineering, Databases", thesisTitle: "", description: "" },
];

const demoBadges = [
  { id: "1", title: "Hackathon Winner", issuer: "MLH", category: "Competition", icon: "🏆" },
  { id: "2", title: "Dean's List 2025", issuer: "UCL", category: "Award", icon: "🎓" },
  { id: "3", title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", category: "Certification", icon: "💻" },
  { id: "4", title: "Bloomberg Fellowship", issuer: "Bloomberg", category: "Achievement", icon: "🚀" },
  { id: "5", title: "Best Paper Award", issuer: "UCL CS Department", category: "Award", icon: "📝" },
];

const demoSkills = [
  { id: "s1", name: "Python", proficiency: "advanced" as Proficiency },
  { id: "s2", name: "React", proficiency: "advanced" as Proficiency },
  { id: "s3", name: "TypeScript", proficiency: "intermediate" as Proficiency },
  { id: "s4", name: "Figma", proficiency: "intermediate" as Proficiency },
  { id: "s5", name: "SQL", proficiency: "advanced" as Proficiency },
  { id: "s6", name: "TensorFlow", proficiency: "beginner" as Proficiency },
  { id: "s7", name: "Docker", proficiency: "intermediate" as Proficiency },
  { id: "s8", name: "Node.js", proficiency: "intermediate" as Proficiency },
];
const demoInterests = ["Fintech", "UI Design", "Sustainability", "Machine Learning", "Open Source"];

const demoLanguages = [
  { id: "l1", language: "English", proficiency: "Native" as LanguageProficiency },
  { id: "l2", language: "Mandarin", proficiency: "Fluent" as LanguageProficiency },
  { id: "l3", language: "French", proficiency: "Conversational" as LanguageProficiency },
];

const demoCertifications = [
  { id: "c1", name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", issueDate: "2024-11", expiryDate: "2027-11", noExpiry: false, credentialId: "AWS-CLP-2024-98765", credentialUrl: "https://aws.amazon.com/verification" },
  { id: "c2", name: "Google Analytics Professional", issuer: "Google", issueDate: "2024-06", expiryDate: "", noExpiry: true, credentialId: "", credentialUrl: "" },
];

const demoActivities = [
  { id: "1", title: "Attended UCL AI Summit 2025", type: "Conference", activityDate: "2025-03", note: "Met 3 potential co-founders" },
  { id: "2", title: "Volunteered at Freshers' Fair", type: "Event", activityDate: "2024-09", note: "Helped run the Tech Society stall" },
  { id: "3", title: "Bloomberg Tech Workshop", type: "Workshop", activityDate: "2024-11", note: "" },
];

const demoProfiles: Record<string, {
  profile: typeof demoProfile;
  experiences: typeof demoExperiences;
  education: typeof demoEducation;
  badges: typeof demoBadges;
  activities: typeof demoActivities;
  certifications: typeof demoCertifications;
  skills: typeof demoSkills;
  languages: typeof demoLanguages;
  interests: string[];
} | undefined> = {};

demoProfiles["demotozero"] = { profile: demoProfile, experiences: demoExperiences, education: demoEducation, badges: demoBadges, activities: demoActivities, certifications: demoCertifications, skills: demoSkills, languages: demoLanguages, interests: demoInterests };

const formatDate = (d: string) => {
  if (!d) return "Present";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

const FadeInSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 1, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

const ExperienceCard = ({ exp, index, colors }: { exp: typeof demoExperiences[0]; index: number; colors: ThemeColors }) => {
  const [expanded, setExpanded] = useState(false);
  const hasStructured = !!(exp.responsibilities || exp.achievements || exp.tools?.length);

  return (
    <FadeInSection delay={index * 0.08}>
      <div className="flex gap-4 pb-8 group">
        <div className="relative flex-shrink-0 flex flex-col items-center">
          <div className="w-3 h-3 rounded-full border-2 mt-1.5 z-10 transition-colors"
            style={{ borderColor: exp.isCurrent ? colors.accent : colors.muted + "66", backgroundColor: exp.isCurrent ? colors.accent : colors.bg }} />
          <div className="w-px flex-1" style={{ backgroundColor: colors.isDark ? colors.secondary + "30" : "#e5e7eb" }} />
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
              style={{ backgroundColor: colors.accent + "15", color: colors.accent, borderColor: colors.accent + "30" }}>
              {exp.type}
            </span>
            {exp.isCurrent && <span className="text-xs font-medium" style={{ color: colors.accent }}> Current</span>}
          </div>
          <h3 className="font-semibold mt-1" style={{ color: colors.text }}>{exp.title}</h3>
          <p className="text-sm" style={{ color: colors.muted }}>{exp.organisation}</p>
          <p className="text-xs mt-0.5" style={{ color: colors.muted }}>{formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}</p>
          <motion.div initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            {hasStructured ? (
              <div className="mt-3 space-y-2">
                {exp.responsibilities && (
                  <div>
                    <p className="text-xs font-semibold" style={{ color: colors.text }}>Responsibilities</p>
                    <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>{exp.responsibilities}</p>
                  </div>
                )}
                {exp.achievements && (
                  <div>
                    <p className="text-xs font-semibold" style={{ color: colors.text }}>Achievements</p>
                    <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>{exp.achievements}</p>
                  </div>
                )}
                {exp.tools?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {exp.tools.map((tool) => (
                      <span key={tool} className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                        style={{ borderColor: colors.accent + "30", color: colors.accent }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm mt-3 leading-relaxed" style={{ color: colors.muted }}>{exp.description}</p>
            )}
          </motion.div>
          <button className="text-xs mt-2 flex items-center gap-1 transition-colors" style={{ color: colors.accent + "b0" }}>
            {expanded ? <><ChevronUp className="w-3 h-3" /> Less</> : <><ChevronDown className="w-3 h-3" /> More</>}
          </button>
        </div>
      </div>
    </FadeInSection>
  );
};

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const resolvedUsername = username || "demotozero";
  const profileData = demoProfiles[resolvedUsername];

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground">This profile doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  const { profile, experiences, education, badges, activities, certifications, skills, languages, interests } = profileData;
  const themeId = (profile.theme || "navy") as ThemeId;
  const theme = THEMES[themeId] || THEMES.navy;
  const c = theme.colors;

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg }}>
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="container max-w-3xl px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center text-center">
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 shadow-lg" style={{ borderColor: c.accent }}>
              <AvatarImage src={profile.profilePhotoPreview} />
              <AvatarFallback className="text-4xl md:text-5xl font-bold text-white" style={{ backgroundColor: c.accent }}>{profile.firstName[0]}</AvatarFallback>
            </Avatar>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-bold mt-6" style={{ color: c.text }}>{profile.firstName} {profile.lastName}</h1>
              <p className="text-lg mt-1" style={{ color: c.muted }}>{profile.headline}</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm flex-wrap" style={{ color: c.muted }}>
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile.university}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
              </div>
              {/* Contact in hero: email + portfolio */}
              <div className="flex items-center justify-center gap-4 mt-2 text-sm" style={{ color: c.muted }}>
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-1 transition-colors hover:underline" style={{ color: c.accent }}>
                    <Mail className="w-3.5 h-3.5" /> {profile.email}
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition-colors hover:underline" style={{ color: c.accent }}>
                    <Palette className="w-3.5 h-3.5" /> Portfolio
                  </a>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex items-center gap-3 mt-5">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors"
                  style={{ borderColor: c.isDark ? c.secondary + "40" : "#e5e7eb", color: c.muted }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = c.accent; e.currentTarget.style.borderColor = c.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = c.muted; e.currentTarget.style.borderColor = c.isDark ? c.secondary + "40" : "#e5e7eb"; }}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors"
                  style={{ borderColor: c.isDark ? c.secondary + "40" : "#e5e7eb", color: c.muted }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = c.accent; e.currentTarget.style.borderColor = c.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = c.muted; e.currentTarget.style.borderColor = c.isDark ? c.secondary + "40" : "#e5e7eb"; }}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors"
                  style={{ borderColor: c.isDark ? c.secondary + "40" : "#e5e7eb", color: c.muted }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = c.accent; e.currentTarget.style.borderColor = c.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = c.muted; e.currentTarget.style.borderColor = c.isDark ? c.secondary + "40" : "#e5e7eb"; }}
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Open To Banner */}
      {profile.openTo && (
        <section className="pb-8 md:pb-10">
          <div className="container max-w-3xl px-6">
            <FadeInSection delay={0.15}>
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl mx-auto max-w-fit"
                style={{ backgroundColor: c.secondary + (c.isDark ? "20" : "60"), color: c.isDark ? c.text : c.accent }}>
                <Briefcase className="w-4 h-4 flex-shrink-0" style={{ color: c.accent }} />
                <p className="text-sm font-medium">{profile.openTo}</p>
              </div>
            </FadeInSection>
          </div>
        </section>
      )}

      {/* About */}
      <section className="pb-12 md:pb-16">
        <div className="container max-w-3xl px-6">
          <FadeInSection>
            <h2 className="text-xl font-bold mb-3" style={{ color: c.text }}>About</h2>
            <p className="leading-relaxed" style={{ color: c.muted }}>{profile.bio}</p>
          </FadeInSection>
        </div>
      </section>

      {/* Education */}
      {education.length > 0 && (
        <section className="pb-12 md:pb-16">
          <div className="container max-w-3xl px-6">
            <FadeInSection><h2 className="text-xl font-bold mb-4" style={{ color: c.text }}>Education</h2></FadeInSection>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <FadeInSection key={edu.id} delay={i * 0.06}>
                  <div className="flex items-start gap-3 p-4 rounded-lg border"
                    style={{ backgroundColor: c.isDark ? c.secondary + "10" : c.accent + "06", borderColor: c.isDark ? c.secondary + "25" : c.accent + "15" }}>
                    <GraduationCap className="w-5 h-5 mt-0.5 shrink-0" style={{ color: c.accent }} />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm" style={{ color: c.text }}>{edu.degree}</h4>
                      <p className="text-sm" style={{ color: c.muted }}>{edu.institution}</p>
                      <p className="text-xs mt-0.5" style={{ color: c.muted }}>
                        {formatDate(edu.startDate)} — {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                        {edu.grade && <span className="ml-2">· {edu.grade}</span>}
                      </p>
                      {edu.coursework && <p className="text-xs mt-1 italic" style={{ color: c.muted }}>{edu.coursework}</p>}
                      {edu.thesisTitle && <p className="text-xs mt-0.5" style={{ color: c.muted }}>Thesis: {edu.thesisTitle}</p>}
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      <section className="pb-12 md:pb-16">
        <div className="container max-w-3xl px-6">
          <FadeInSection><h2 className="text-xl font-bold mb-6" style={{ color: c.text }}>Experience</h2></FadeInSection>
          <div className="ml-1">{experiences.map((exp, i) => <ExperienceCard key={exp.id} exp={exp} index={i} colors={c} />)}</div>
        </div>
      </section>

      {/* Activities */}
      {activities.length > 0 && (
        <section className="pb-12 md:pb-16">
          <div className="container max-w-3xl px-6">
            <FadeInSection><h2 className="text-xl font-bold mb-4" style={{ color: c.text }}>Activities</h2></FadeInSection>
            <div className="space-y-2.5">
              {activities.sort((a, b) => b.activityDate.localeCompare(a.activityDate)).map((act, i) => (
                <FadeInSection key={act.id} delay={i * 0.06}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{ backgroundColor: c.isDark ? c.secondary + "10" : c.accent + "06", border: `1px solid ${c.isDark ? c.secondary + "20" : c.accent + "12"}` }}>
                    <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                      style={{ backgroundColor: c.accent + "15", color: c.accent }}>{act.type}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium" style={{ color: c.text }}>{act.title}</span>
                      {act.note && <span className="text-xs ml-2" style={{ color: c.muted }}>· {act.note}</span>}
                    </div>
                    <span className="text-xs shrink-0" style={{ color: c.muted }}>{formatDate(act.activityDate)}</span>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      <section className="pb-12 md:pb-16">
        <div className="container max-w-3xl px-6">
          <FadeInSection><h2 className="text-xl font-bold mb-6" style={{ color: c.text }}>Achievements</h2></FadeInSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <FadeInSection key={badge.id} delay={i * 0.06}>
                <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="h-full" style={{ backgroundColor: c.isDark ? c.secondary + "10" : undefined, borderColor: c.isDark ? c.secondary + "30" : c.accent + "20" }}>
                    <CardContent className="pt-5 pb-4 text-center">
                      <span className="text-3xl">{badge.icon}</span>
                      <h4 className="font-semibold text-sm mt-2 leading-tight" style={{ color: c.text }}>{badge.title}</h4>
                      <p className="text-xs mt-1" style={{ color: c.muted }}>{badge.issuer}</p>
                      <span className="inline-block text-[10px] mt-2 px-2 py-0.5 rounded-full border font-medium"
                        style={{ borderColor: c.accent + "40", color: c.accent }}>{badge.category}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="pb-12 md:pb-16">
        <div className="container max-w-3xl px-6">
          <FadeInSection>
            <h2 className="text-xl font-bold mb-4" style={{ color: c.text }}>Skills</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map((skill, i) => {
                const level = PROFICIENCY_LEVELS.find((l) => l.value === skill.proficiency) ?? PROFICIENCY_LEVELS[1];
                return (
                  <motion.div key={skill.id} initial={{ opacity: 1, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="p-3 rounded-lg border"
                    style={{ backgroundColor: c.isDark ? c.secondary + "10" : c.accent + "06", borderColor: c.isDark ? c.secondary + "25" : c.accent + "15" }}>
                    <p className="font-semibold text-sm" style={{ color: c.text }}>{skill.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: c.muted }}>{level.label}</p>
                    <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: c.isDark ? c.secondary + "20" : "#e5e7eb" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${level.percent}%`, backgroundColor: level.value === "expert" ? "#059669" : level.value === "advanced" ? c.accent : level.value === "intermediate" ? "#d4a574" : (c.muted + "60") }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Languages */}
      {languages.length > 0 && (
        <section className="pb-12 md:pb-16">
          <div className="container max-w-3xl px-6">
            <FadeInSection>
              <h2 className="text-xl font-bold mb-4" style={{ color: c.text }}>Languages</h2>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang, i) => {
                  const level = LANGUAGE_PROFICIENCY_LEVELS.find((l) => l.value === lang.proficiency) ?? LANGUAGE_PROFICIENCY_LEVELS[3];
                  return (
                    <motion.div key={lang.id} initial={{ opacity: 1, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                      style={{ backgroundColor: c.isDark ? c.secondary + "10" : c.accent + "06", borderColor: c.isDark ? c.secondary + "25" : c.accent + "15" }}>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: c.text }}>{lang.language}</p>
                        <p className="text-xs" style={{ color: c.muted }}>{lang.proficiency}</p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, j) => (
                          <span key={j} className="w-2 h-2 rounded-full" style={{ backgroundColor: j < level.dots ? c.accent : (c.isDark ? c.secondary + "30" : "#e5e7eb") }} />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </FadeInSection>
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="pb-12 md:pb-16">
          <div className="container max-w-3xl px-6">
            <FadeInSection><h2 className="text-xl font-bold mb-4" style={{ color: c.text }}>Certifications</h2></FadeInSection>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <FadeInSection key={cert.id} delay={i * 0.06}>
                  <div className="flex items-start gap-3 p-4 rounded-lg border"
                    style={{ backgroundColor: c.isDark ? c.secondary + "10" : c.accent + "06", borderColor: c.isDark ? c.secondary + "25" : c.accent + "15" }}>
                    <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: c.accent }} />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm" style={{ color: c.text }}>{cert.name}</h4>
                      <p className="text-sm" style={{ color: c.muted }}>{cert.issuer}</p>
                      <p className="text-xs mt-0.5" style={{ color: c.muted }}>
                        Issued {formatDate(cert.issueDate)}
                        {cert.noExpiry ? <span style={{ color: c.muted + "80" }}> · No expiry</span> : cert.expiryDate ? ` — Expires ${formatDate(cert.expiryDate)}` : ""}
                      </p>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-1 transition-colors" style={{ color: c.accent }}>
                          <ExternalLink className="w-3 h-3" /> Verify
                        </a>
                      )}
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interests */}
      <section className="pb-16 md:pb-20">
        <div className="container max-w-3xl px-6">
          <FadeInSection>
            <h2 className="text-xl font-bold mb-4" style={{ color: c.text }}>Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <motion.span key={interest} initial={{ opacity: 1, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="px-3 py-1.5 rounded-full border text-sm font-medium transition-colors"
                  style={{ borderColor: c.isDark ? c.secondary + "40" : c.secondary, color: c.muted }}>
                  {interest}
                </motion.span>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: `1px solid ${c.isDark ? c.secondary + "20" : "#e5e7eb"}` }}>
        <div className="container text-center">
          <p className="text-sm" style={{ color: c.muted }}>
            Built with <a href="/" className="font-semibold transition-colors" style={{ color: c.text }}
              onMouseEnter={(e) => e.currentTarget.style.color = c.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = c.text}
            >Lumora</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicProfile;
