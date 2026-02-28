import { useState, useRef, useCallback } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import CVPreview, { CVPurpose, CVVisibility } from "@/components/cv/CVPreview";
import { Briefcase, GraduationCap, Users, ArrowLeft, ArrowRight, Download, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const purposes: { id: CVPurpose; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: "job",
    label: "Job Application",
    desc: "Emphasises work experience, skills and measurable results.",
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: "university",
    label: "University Application",
    desc: "Highlights academics, research and project work.",
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    id: "social",
    label: "Social / Networking",
    desc: "Lighter format — interests and personality first.",
    icon: <Users className="w-6 h-6" />,
  },
];

const defaultVisibility = (purpose: CVPurpose, experienceIds: string[]): CVVisibility => {
  const base = { experienceIds };
  switch (purpose) {
    case "job":
      return { ...base, education: true, experience: true, skills: true, interests: false, badges: true };
    case "university":
      return { ...base, education: true, experience: true, skills: true, interests: false, badges: true };
    case "social":
      return { ...base, education: true, experience: false, skills: true, interests: true, badges: false };
  }
};

const CVBuilder = () => {
  const { data } = useProfile();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<CVPurpose | null>(null);
  const [visibility, setVisibility] = useState<CVVisibility | null>(null);
  const [exporting, setExporting] = useState(false);
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

  const exportPDF = useCallback(async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
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
                className={`cursor-pointer transition-all hover:shadow-md ${
                  purpose === p.id
                    ? "ring-2 ring-primary shadow-md"
                    : "hover:border-primary/40"
                }`}
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
            {/* Preview */}
            <div className="overflow-auto rounded-lg border bg-muted/30 p-4 flex justify-center">
              <div className="origin-top" style={{ transform: "scale(0.72)", transformOrigin: "top center" }}>
                <CVPreview ref={previewRef} data={data} purpose={purpose} visibility={visibility} />
              </div>
            </div>

            {/* Controls */}
            <Card>
              <CardContent className="p-5 space-y-5">
                <h3 className="font-semibold text-foreground text-sm">Sections</h3>
                {(["education", "experience", "skills", "interests", "badges"] as const).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-foreground">{key}</span>
                    <Switch
                      checked={visibility[key]}
                      onCheckedChange={() => toggleSection(key)}
                    />
                  </div>
                ))}

                {visibility.experience && data.experiences.length > 0 && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-foreground text-sm mb-3">Experience entries</h3>
                      <div className="space-y-2">
                        {data.experiences.map((exp) => (
                          <label key={exp.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={visibility.experienceIds.includes(exp.id)}
                              onCheckedChange={() => toggleExperience(exp.id)}
                            />
                            <span className="text-sm text-foreground">{exp.title}</span>
                            <span className="text-xs text-muted-foreground">({exp.organisation})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
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

          <div className="overflow-auto rounded-lg border bg-muted/30 p-4 flex justify-center">
            <div className="origin-top" style={{ transform: "scale(0.72)", transformOrigin: "top center" }}>
              <CVPreview ref={previewRef} data={data} purpose={purpose} visibility={visibility} />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-1 w-4 h-4" /> Back
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
      )}
    </div>
  );
};

export default CVBuilder;
