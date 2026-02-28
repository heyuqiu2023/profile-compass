import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Github, Globe, MapPin, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

// Demo data — will be replaced with DB fetch later
const demoProfiles: Record<string, {
  profile: typeof demoProfile;
  experiences: typeof demoExperiences;
  badges: typeof demoBadges;
  skills: string[];
  interests: string[];
} | undefined> = {};

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
};

const demoExperiences = [
  { id: "1", type: "Internship", title: "Software Engineering Intern", organisation: "Google", startDate: "2025-06", endDate: "", isCurrent: true, description: "Working on frontend infrastructure for Google Cloud Console. Built reusable component library used by 20+ teams. Improved page load times by 30% through code splitting and lazy loading optimisations." },
  { id: "2", type: "Society Role", title: "President", organisation: "UCL Tech Society", startDate: "2024-09", endDate: "2025-06", isCurrent: false, description: "Led a team of 30 committee members. Organised 15+ events including hackathons, speaker sessions, and workshops with industry partners like Google, Meta, and Bloomberg." },
  { id: "3", type: "Project", title: "FinTrack", organisation: "Personal Project", startDate: "2024-03", endDate: "2024-06", isCurrent: false, description: "Built a personal finance tracker with React and Supabase. Features include bank sync, budget tracking, and spending analytics. 500+ users in first month of launch." },
  { id: "4", type: "Research", title: "Undergraduate Researcher", organisation: "UCL NLP Group", startDate: "2024-01", endDate: "2024-05", isCurrent: false, description: "Researched transformer-based models for financial sentiment analysis. Co-authored paper submitted to ACL 2025." },
];

const demoBadges = [
  { id: "1", title: "Hackathon Winner", issuer: "MLH", category: "Competition", icon: "🏆" },
  { id: "2", title: "Dean's List 2025", issuer: "UCL", category: "Award", icon: "🎓" },
  { id: "3", title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", category: "Certification", icon: "💻" },
  { id: "4", title: "Bloomberg Fellowship", issuer: "Bloomberg", category: "Achievement", icon: "🚀" },
  { id: "5", title: "Best Paper Award", issuer: "UCL CS Department", category: "Award", icon: "📝" },
];

const demoSkills = ["Python", "React", "TypeScript", "Figma", "SQL", "TensorFlow", "Docker", "Node.js"];
const demoInterests = ["Fintech", "UI Design", "Sustainability", "Machine Learning", "Open Source"];

// Register demo user
demoProfiles["demotozero"] = { profile: demoProfile, experiences: demoExperiences, badges: demoBadges, skills: demoSkills, interests: demoInterests };

const TYPE_COLORS: Record<string, string> = {
  Internship: "bg-blue-100 text-blue-800 border-blue-200",
  "Part-time Job": "bg-green-100 text-green-800 border-green-200",
  Volunteering: "bg-purple-100 text-purple-800 border-purple-200",
  "Society Role": "bg-amber-100 text-amber-800 border-amber-200",
  Project: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Competition: "bg-rose-100 text-rose-800 border-rose-200",
  Research: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
};

const formatDate = (d: string) => {
  if (!d) return "Present";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

const FadeInSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

const ExperienceCard = ({ exp, index }: { exp: typeof demoExperiences[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <FadeInSection delay={index * 0.08}>
      <div className="flex gap-4 pb-8 group">
        <div className="relative flex-shrink-0 flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full border-2 mt-1.5 z-10 transition-colors ${exp.isCurrent ? "border-primary bg-primary" : "border-muted-foreground/40 bg-background group-hover:border-primary"}`} />
          <div className="w-px flex-1 bg-border" />
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${TYPE_COLORS[exp.type] || TYPE_COLORS.Other}`}>{exp.type}</span>
            {exp.isCurrent && <span className="text-xs text-primary font-medium">Current</span>}
          </div>
          <h3 className="font-semibold text-foreground mt-1">{exp.title}</h3>
          <p className="text-sm text-muted-foreground">{exp.organisation}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}</p>
          <motion.div initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{exp.description}</p>
          </motion.div>
          <button className="text-xs text-primary/70 hover:text-primary mt-2 flex items-center gap-1 transition-colors">
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

  const { profile, experiences, badges, skills, interests } = profileData;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="container max-w-3xl px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center text-center">
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-border shadow-lg">
              <AvatarImage src={profile.profilePhotoPreview} />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl md:text-5xl font-bold">{profile.firstName[0]}</AvatarFallback>
            </Avatar>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-6">{profile.firstName} {profile.lastName}</h1>
              <p className="text-lg text-muted-foreground mt-1">{profile.headline}</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {profile.university}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex items-center gap-3 mt-5">
              {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"><Linkedin className="w-4 h-4" /></a>}
              {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"><Github className="w-4 h-4" /></a>}
              {profile.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"><Globe className="w-4 h-4" /></a>}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="pb-12 md:pb-16">
        <div className="container max-w-3xl px-6">
          <FadeInSection>
            <h2 className="text-xl font-bold text-foreground mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
          </FadeInSection>
        </div>
      </section>

      {/* Experience */}
      <section className="pb-12 md:pb-16">
        <div className="container max-w-3xl px-6">
          <FadeInSection><h2 className="text-xl font-bold text-foreground mb-6">Experience</h2></FadeInSection>
          <div className="ml-1">{experiences.map((exp, i) => <ExperienceCard key={exp.id} exp={exp} index={i} />)}</div>
        </div>
      </section>

      {/* Achievements */}
      <section className="pb-12 md:pb-16">
        <div className="container max-w-3xl px-6">
          <FadeInSection><h2 className="text-xl font-bold text-foreground mb-6">Achievements</h2></FadeInSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <FadeInSection key={badge.id} delay={i * 0.06}>
                <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="border border-border h-full">
                    <CardContent className="pt-5 pb-4 text-center">
                      <span className="text-3xl">{badge.icon}</span>
                      <h4 className="font-semibold text-foreground text-sm mt-2 leading-tight">{badge.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{badge.issuer}</p>
                      <Badge variant="outline" className="text-[10px] mt-2">{badge.category}</Badge>
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
            <h2 className="text-xl font-bold text-foreground mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">{skill}</motion.span>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Interests */}
      <section className="pb-16 md:pb-20">
        <div className="container max-w-3xl px-6">
          <FadeInSection>
            <h2 className="text-xl font-bold text-foreground mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <motion.span key={interest} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }} className="px-3 py-1.5 rounded-full border border-border text-muted-foreground text-sm font-medium hover:border-primary/50 hover:text-foreground transition-colors">{interest}</motion.span>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">Built with <a href="/" className="font-semibold text-foreground hover:text-primary transition-colors">Layer</a></p>
        </div>
      </footer>
    </div>
  );
};

export default PublicProfile;
