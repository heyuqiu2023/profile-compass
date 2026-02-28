import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { OnboardingData } from "@/types/onboarding";

/* ---------- Scoring helpers ---------- */

const STOP_WORDS = new Set([
  "the", "and", "or", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "a", "an", "in", "on", "at",
  "to", "for", "of", "with", "by", "from", "as", "into", "about", "that",
  "this", "it", "its", "we", "you", "your", "our", "their", "they", "them",
  "not", "no", "but", "if", "then", "than", "so", "very", "just", "also",
  "more", "most", "all", "any", "each", "every", "both", "such", "own",
  "up", "out", "new", "well", "way", "use", "one", "two", "who", "how",
  "what", "when", "where", "which", "while", "after", "before",
  "work", "team", "role", "working", "looking", "join", "ability",
]);

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-z0-9#+.]+/g) || [];
  return [...new Set(words.filter((w) => w.length > 3 && !STOP_WORDS.has(w)))];
}

function extractJobTitle(jd: string): string {
  const firstLine = jd.trim().split("\n")[0]?.trim() || "";
  // Take first line, cap at 50 chars
  if (firstLine.length > 50) return firstLine.slice(0, 47) + "…";
  return firstLine || "Job Role";
}

function calcExperienceMatch(experiences: OnboardingData["experiences"], jdText: string): number {
  if (experiences.length === 0) return 0;
  const keywords = extractKeywords(jdText);
  if (keywords.length === 0) return 0;
  let matched = 0;
  for (const exp of experiences) {
    const descLower = (exp.description + " " + exp.title + " " + exp.organisation).toLowerCase();
    if (keywords.some((kw) => descLower.includes(kw))) matched++;
  }
  return Math.round((matched / experiences.length) * 100);
}

function calcSkillAlignment(skills: string[], jdText: string): { score: number; matchedNames: string[] } {
  if (skills.length === 0) return { score: 0, matchedNames: [] };
  const jdLower = jdText.toLowerCase();
  const matchedNames: string[] = [];
  for (const skill of skills) {
    if (jdLower.includes(skill.toLowerCase())) matchedNames.push(skill);
  }
  return { score: Math.round((matchedNames.length / skills.length) * 100), matchedNames };
}

function calcEducationFit(data: OnboardingData, jdText: string): number {
  const jdLower = jdText.toLowerCase();
  let score = 30;
  const fields = [data.course, data.university, data.yearOfStudy].filter(Boolean);
  for (const field of fields) {
    if (field && jdLower.includes(field.toLowerCase())) {
      score = Math.max(score, 90);
      break;
    }
    // Partial match — check individual words
    const words = field?.toLowerCase().split(/\s+/) || [];
    for (const w of words) {
      if (w.length > 3 && jdLower.includes(w)) {
        score = Math.max(score, 70);
      }
    }
  }
  return score;
}

function calcKeywordCoverage(data: OnboardingData, jdText: string): number {
  const jdKeywords = extractKeywords(jdText);
  if (jdKeywords.length === 0) return 0;
  // Build full profile text
  const profileText = [
    data.firstName, data.lastName, data.headline, data.bio, data.location,
    data.university, data.course,
    ...data.skills,
    ...data.interests,
    ...data.experiences.map((e) => `${e.title} ${e.organisation} ${e.description}`),
    ...data.badges.map((b) => `${b.title} ${b.issuer}`),
  ].join(" ").toLowerCase();

  let hits = 0;
  for (const kw of jdKeywords) {
    if (profileText.includes(kw)) hits++;
  }
  return Math.round((hits / jdKeywords.length) * 100);
}

export interface CVScoreResult {
  overall: number;
  experienceMatch: number;
  skillAlignment: number;
  educationFit: number;
  keywordCoverage: number;
  matchedSkillNames: string[];
  jobTitle: string;
}

export function computeCVScore(data: OnboardingData, jdText: string): CVScoreResult {
  const experienceMatch = calcExperienceMatch(data.experiences, jdText);
  const { score: skillAlignment, matchedNames } = calcSkillAlignment(data.skills, jdText);
  const educationFit = calcEducationFit(data, jdText);
  const keywordCoverage = calcKeywordCoverage(data, jdText);
  const overall = Math.round(
    experienceMatch * 0.3 + skillAlignment * 0.3 + educationFit * 0.2 + keywordCoverage * 0.2
  );
  return {
    overall,
    experienceMatch,
    skillAlignment,
    educationFit,
    keywordCoverage,
    matchedSkillNames: matchedNames,
    jobTitle: extractJobTitle(jdText),
  };
}

/* ---------- Animated Score Ring ---------- */

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const color =
    score >= 75 ? "#22c55e"
    : score >= 50 ? "#1e3a5f"
    : "#ef4444";

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(220,13%,93%)" strokeWidth="7" />
        <motion.circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold"
          style={{ color: "hsl(0,0%,10%)" }}
        >
          {score}
        </motion.span>
        <span className="text-[9px]" style={{ color: "hsl(0,0%,50%)" }}>/100</span>
      </div>
    </div>
  );
};

/* ---------- Metric Card ---------- */

const MetricCard = ({
  label, score, barColor, delay,
}: {
  label: string; score: number; barColor: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="rounded-lg border border-[hsl(220,13%,91%)] p-3"
  >
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-medium" style={{ color: "hsl(0,0%,35%)" }}>{label}</span>
      <span className="text-[11px] font-bold" style={{ color: barColor }}>{score}%</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "hsl(220,13%,93%)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: barColor }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
      />
    </div>
  </motion.div>
);

/* ---------- Main Dashboard Card ---------- */

interface CVScoreDashboardProps {
  data: OnboardingData;
  jobDescription: string;
  purpose?: "job" | "university" | "social";
}

const CVScoreDashboard = ({ data, jobDescription, purpose = "job" }: CVScoreDashboardProps) => {
  const navigate = useNavigate();
  const result = useMemo(
    () => computeCVScore(data, jobDescription),
    [data, jobDescription]
  );

  const scoreLabel =
    result.overall >= 75 ? "Excellent Match"
    : result.overall >= 50 ? "Good Match"
    : "Needs Improvement";

  const scoreSubtitle =
    result.overall >= 75 ? "Your CV is highly aligned with this role"
    : result.overall >= 50 ? "Your CV partially matches this role"
    : "Consider tailoring your CV further";

  const GREEN = "#22c55e";
  const NAVY = "#1e3a5f";

  const metrics = [
    { label: "Experience Match", score: result.experienceMatch, color: GREEN },
    { label: "Skill Alignment", score: result.skillAlignment, color: NAVY },
    { label: "Education Fit", score: result.educationFit, color: GREEN },
    { label: "Keyword Coverage", score: result.keywordCoverage, color: NAVY },
  ];

  const unmatchedCount = Math.max(0, data.skills.length - result.matchedSkillNames.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Subtle glow */}
      <div className="absolute -inset-2 bg-gradient-to-br from-[hsl(213,52%,24%,0.06)] to-transparent rounded-2xl blur-xl pointer-events-none" />

      <div className="relative bg-white rounded-2xl shadow-lg border border-[hsl(220,13%,91%)] overflow-hidden">
        {/* macOS-style toolbar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b" style={{ backgroundColor: "hsl(220,13%,97%)", borderColor: "hsl(220,13%,91%)" }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#eab308" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
          <span className="ml-3 text-[10px] font-medium" style={{ color: "hsl(0,0%,50%)" }}>
            {purpose === "university" ? "Programme Score" : purpose === "social" ? "Context Score" : "CV Score"} — {result.jobTitle}
          </span>
        </div>

        <div className="p-6">
          {/* Main score section */}
          <div className="flex items-center gap-5 mb-5">
            <ScoreRing score={result.overall} />
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <p className="text-sm font-semibold" style={{ color: "hsl(0,0%,10%)" }}>{scoreLabel}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "hsl(0,0%,50%)" }}>{scoreSubtitle}</p>
            </motion.div>
          </div>

          {/* 2x2 metric grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {metrics.map((m, i) => (
              <MetricCard
                key={m.label}
                label={m.label}
                score={m.score}
                barColor={m.color}
                delay={0.6 + i * 0.12}
              />
            ))}
          </div>

          {/* Matched skill pills */}
          {result.matchedSkillNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-4 flex flex-wrap gap-1.5"
            >
              {result.matchedSkillNames.map((s) => (
                <span
                  key={s}
                  className="text-[9px] px-2 py-0.5 rounded-full font-medium text-white"
                  style={{ backgroundColor: "#1e3a5f" }}
                >
                  {s}
                </span>
              ))}
              {unmatchedCount > 0 && (
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full font-medium border"
                  style={{ borderColor: "hsl(220,13%,91%)", color: "hsl(0,0%,50%)" }}
                >
                  +{unmatchedCount} more
                </span>
              )}
            </motion.div>
          )}

          {/* Improvement tips */}
          {(() => {
            const tips: { icon: string; text: string; section: string }[] = [];
            if (result.experienceMatch < 50)
              tips.push({ icon: "💼", text: "Add experiences with keywords that match this description.", section: "section-experiences" });
            if (result.skillAlignment < 50)
              tips.push({ icon: "🎯", text: "Add more relevant skills to your profile to improve alignment.", section: "section-skills" });
            if (result.educationFit < 50)
              tips.push({ icon: "🎓", text: "Ensure your course or university details match what's mentioned.", section: "section-basics" });
            if (result.keywordCoverage < 50)
              tips.push({ icon: "🔑", text: "Your profile is missing key terms — try updating your bio or experience descriptions.", section: "section-about" });
            if (tips.length === 0) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                className="mt-4 rounded-lg p-3 space-y-1.5"
                style={{ backgroundColor: "hsl(45,100%,97%)", border: "1px solid hsl(45,80%,85%)" }}
              >
                <p className="text-[10px] font-semibold" style={{ color: "hsl(30,60%,40%)" }}>Tips to improve your score</p>
                {tips.map((tip, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/dashboard/profile#${tip.section}`)}
                    className="flex items-center gap-1 text-[10px] leading-relaxed text-left w-full rounded px-1 -mx-1 transition-colors hover:bg-[hsl(45,80%,90%)]"
                    style={{ color: "hsl(30,30%,35%)" }}
                  >
                    <span>{tip.icon}</span>
                    <span className="underline decoration-dotted underline-offset-2">{tip.text}</span>
                  </button>
                ))}
              </motion.div>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
};

export default CVScoreDashboard;
