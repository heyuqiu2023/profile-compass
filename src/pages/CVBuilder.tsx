import { useState, useRef, useCallback, useMemo } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import CVPreview, { CVPurpose, CVTemplate, CVVisibility } from "@/components/cv/CVPreview";
import CVScoreDashboard, { computeCVScore } from "@/components/cv/CVScoreDashboard";
import { Briefcase, GraduationCap, Users, ArrowLeft, ArrowRight, Download, Loader2, Palette, FileText, Minus, Save } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";

const purposes: { id: CVPurpose; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "job", label: "Job Application", desc: "Emphasises work experience, skills and measurable results.", icon: <Briefcase className="w-6 h-6" /> },
  { id: "university", label: "University Application", desc: "Highlights academics, research and project work.", icon: <GraduationCap className="w-6 h-6" /> },
  { id: "social", label: "Social / Networking", desc: "Lighter format — interests and personality first.", icon: <Users className="w-6 h-6" /> },
];

const templates: { id: CVTemplate; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "modern", label: "Modern", desc: "Clean navy accents, Inter font, contemporary feel.", icon: <Palette className="w-5 h-5" /> },
  { id: "classic", label: "Classic", desc: "Serif typography, bold dividers, traditional layout.", icon: <FileText className="w-5 h-5" /> },
  { id: "minimal", label: "Minimal", desc: "Helvetica, subtle borders, maximum whitespace.", icon: <Minus className="w-5 h-5" /> },
];

const defaultVisibility = (purpose: CVPurpose, experienceIds: string[]): CVVisibility => {
  const base = { experienceIds };
  switch (purpose) {
    case "job":
      return { ...base, education: true, experience: true, skills: true, interests: false, badges: true, certifications: true, languages: true };
    case "university":
      return { ...base, education: true, experience: true, skills: true, interests: false, badges: true, certifications: true, languages: true };
    case "social":
      return { ...base, education: true, experience: false, skills: true, interests: true, badges: false, certifications: false, languages: true };
  }
};

/* ---------- JD keyword helpers for experience relevance ---------- */

function extractJDKeywords(jdText: string): string[] {
  const lower = jdText.toLowerCase();
  const words = lower.match(/[a-z0-9#+.]+/g) || [];
  const stopWords = new Set([
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
  return [...new Set(words.filter((w) => w.length >= 2 && !stopWords.has(w)))];
}

function experienceMatchesJD(description: string, jdText: string): boolean {
  if (!description || !jdText.trim()) return false;
  const jdKeywords = extractJDKeywords(jdText);
  const descLower = description.toLowerCase();
  let hits = 0;
  for (const kw of jdKeywords) {
    if (descLower.includes(kw)) hits++;
    if (hits >= 3) return true;
  }
  return false;
}

const CVBuilder = () => {
  const { data } = useProfile();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<CVPurpose | null>(null);
  const [template, setTemplate] = useState<CVTemplate>("modern");
  const [visibility, setVisibility] = useState<CVVisibility | null>(null);
  const [exporting, setExporting] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);
  const [contextDescription, setContextDescription] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const selectPurpose = (p: CVPurpose) => {
    setPurpose(p);
    setVisibility(defaultVisibility(p, data.experiences.map((e) => e.id)));
  };

  const toggleSection = (key: keyof Omit<CVVisibility, "experienceIds">) => {
    setVisibility((prev) => prev ? { ...prev, [key]: !prev[key] } : prev);
  };

  const toggleExperience = (id: string) => {
    setVisibility((prev) => {
      if (!prev) return prev;
      const ids = prev.experienceIds.includes(id)
        ? prev.experienceIds.filter((x) => x !== id)
        : [...prev.experienceIds, id];
      return { ...prev, experienceIds: ids };
    });
  };

  const contextFieldConfig: Record<CVPurpose, { label: string; placeholder: string }> = {
    job: {
      label: "Paste a job description (optional)",
      placeholder: "Paste the job listing here to tailor your CV...",
    },
    university: {
      label: "Paste the programme description (optional)",
      placeholder: "Paste the university course or programme details here — we'll tailor your CV to match what they're looking for...",
    },
    social: {
      label: "Describe the context (optional)",
      placeholder: "What's the occasion? e.g. 'Tech networking event in London', 'Startup community meetup', 'Sharing with a recruiter on LinkedIn'...",
    },
  };

  // Matched skills for CV preview highlighting
  const matchedSkillsSet = useMemo(() => {
    if (!purpose || !contextDescription.trim()) return undefined;
    const result = computeCVScore(data, contextDescription);
    return new Set(result.matchedSkillNames.map((s) => s.toLowerCase()));
  }, [data, contextDescription, purpose]);

  const showScore = !!purpose && contextDescription.trim().length > 0;

  const exportPDF = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`${data.firstName || "CV"}_${data.lastName || ""}_CV.pdf`);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setExporting(false);
    }
  }, [data.firstName, data.lastName]);

  const saveCV = async () => {
    if (!saveName.trim() || !purpose || !visibility) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please sign in to save CVs"); setSaving(false); return; }
      const { error } = await supabase.from("saved_cvs").insert({
        user_id: user.id,
        name: saveName.trim(),
        purpose,
        template,
        visibility: visibility as any,
      });
      if (error) throw error;
      toast.success("CV saved!");
      setSaveOpen(false);
      setSaveName("");
    } catch {
      toast.error("Failed to save CV");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 animate-fade-in-up">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className={step >= 1 ? "text-primary font-medium" : ""}>1 · Purpose</span>
          <span className={step >= 2 ? "text-primary font-medium" : ""}>2 · Customise</span>
          <span className={step >= 3 ? "text-primary font-medium" : ""}>3 · Export</span>
        </div>
        <Progress value={(step / 3) * 100} className="h-1.5" />
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Choose a purpose</h1>
            <p className="text-muted-foreground text-sm mt-1">This decides which sections are emphasised on your CV.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {purposes.map((p) => (
              <Card
                key={p.id}
                className={`cursor-pointer transition-all hover:shadow-md ${purpose === p.id ? "ring-2 ring-primary shadow-md" : "hover:border-primary/40"}`}
                onClick={() => selectPurpose(p.id)}
              >
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="text-primary">{p.icon}</div>
                  <h3 className="font-semibold text-foreground">{p.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Context description field — adapts label/placeholder per purpose */}
          {purpose && (
            <div className="space-y-2">
              <Label htmlFor="context-input" className="text-sm font-medium text-foreground">
                {contextFieldConfig[purpose].label}
              </Label>
              <Textarea
                id="context-input"
                placeholder={contextFieldConfig[purpose].placeholder}
                value={contextDescription}
                onChange={(e) => setContextDescription(e.target.value)}
                className="min-h-[120px] resize-y"
              />
            </div>
          )}

          {/* Template picker */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Choose a template</h2>
            <p className="text-muted-foreground text-sm mb-4">Pick the visual style for your CV.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {templates.map((t) => (
              <Card
                key={t.id}
                className={`cursor-pointer transition-all hover:shadow-md ${template === t.id ? "ring-2 ring-primary shadow-md" : "hover:border-primary/40"}`}
                onClick={() => setTemplate(t.id)}
              >
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="text-primary">{t.icon}</div>
                  <h3 className="font-semibold text-foreground">{t.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button disabled={!purpose} onClick={() => setStep(2)}>
              Next <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && purpose && visibility && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customise your CV</h1>
            <p className="text-muted-foreground text-sm mt-1">Toggle sections and entries. The preview updates live.</p>
          </div>
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Preview column */}
            <div className="space-y-4">
              {/* CV Score Dashboard */}
              {showScore && (
              <CVScoreDashboard data={data} jobDescription={contextDescription} purpose={purpose} />
              )}

              {/* Preview */}
              <div className="overflow-auto rounded-lg border bg-muted/30 p-4 flex justify-center">
                <div className="origin-top" style={{ transform: "scale(0.72)", transformOrigin: "top center" }}>
                  <CVPreview
                    ref={previewRef}
                    data={data}
                    purpose={purpose}
                    visibility={visibility}
                    template={template}
                    matchedSkills={matchedSkillsSet}
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <Card>
              <CardContent className="p-5 space-y-5">
                {/* Template switcher */}
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">Template</h3>
                  <div className="flex gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`flex-1 text-xs py-1.5 px-2 rounded-md border transition-all ${
                          template === t.id
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context textarea on step 2 */}
                {purpose && (
                  <div className="space-y-2">
                    <Label htmlFor="context-input-2" className="text-xs font-medium text-foreground">
                      {contextFieldConfig[purpose].label.replace(" (optional)", "")}
                    </Label>
                    <Textarea
                      id="context-input-2"
                      placeholder={contextFieldConfig[purpose].placeholder}
                      value={contextDescription}
                      onChange={(e) => setContextDescription(e.target.value)}
                      className="min-h-[80px] resize-y text-xs"
                    />
                  </div>
                )}

                <h3 className="font-semibold text-foreground text-sm">Sections</h3>
                {(["education", "experience", "skills", "languages", "certifications", "interests", "badges"] as const).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-foreground">{key}</span>
                    <Switch checked={visibility[key]} onCheckedChange={() => toggleSection(key)} />
                  </div>
                ))}

                {visibility.experience && data.experiences.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-foreground text-sm mb-3">Experience entries</h3>
                    <div className="space-y-2">
                      {data.experiences.map((exp) => {
                        const isRelevant = contextDescription.trim()
                          ? experienceMatchesJD(exp.description, contextDescription)
                          : false;
                        return (
                          <label key={exp.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox checked={visibility.experienceIds.includes(exp.id)} onCheckedChange={() => toggleExperience(exp.id)} />
                            <span className="text-sm text-foreground">{exp.title}</span>
                            <span className="text-xs text-muted-foreground">({exp.organisation})</span>
                            {isRelevant && (
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: "#22c55e" }}
                                title="Relevant to job description"
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-1 w-4 h-4" /> Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && purpose && visibility && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Export your CV</h1>
            <p className="text-muted-foreground text-sm mt-1">Review the final preview and download as PDF.</p>
          </div>

          {/* CV Score Dashboard on export step */}
          {showScore && (
            <CVScoreDashboard data={data} jobDescription={contextDescription} purpose={purpose} />
          )}

          <div className="overflow-auto rounded-lg border bg-muted/30 p-4 flex justify-center">
            <div className="origin-top" style={{ transform: "scale(0.72)", transformOrigin: "top center" }}>
              <CVPreview
                ref={previewRef}
                data={data}
                purpose={purpose}
                visibility={visibility}
                template={template}
                matchedSkills={matchedSkillsSet}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-1 w-4 h-4" /> Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSaveOpen(true)}>
                <Save className="mr-1 w-4 h-4" /> Save CV
              </Button>
              <Button onClick={exportPDF} disabled={exporting}>
                {exporting ? (
                  <><Loader2 className="mr-1 w-4 h-4 animate-spin" /> Generating…</>
                ) : (
                  <><Download className="mr-1 w-4 h-4" /> Download PDF</>
                )}
              </Button>
            </div>
          </div>

          {/* Save CV Dialog */}
          <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Save CV Configuration</DialogTitle></DialogHeader>
              <div className="py-2">
                <Input placeholder="e.g. Google Summer Internship CV" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={saveCV} disabled={saving || !saveName.trim()}>
                  {saving ? <><Loader2 className="mr-1 w-4 h-4 animate-spin" /> Saving…</> : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default CVBuilder;
