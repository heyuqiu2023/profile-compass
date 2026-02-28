import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { OnboardingData, defaultOnboardingData } from "@/types/onboarding";
import StepBasics from "@/components/onboarding/StepBasics";
import StepAbout from "@/components/onboarding/StepAbout";
import StepExperiences from "@/components/onboarding/StepExperiences";
import StepSkills from "@/components/onboarding/StepSkills";
import StepBadges from "@/components/onboarding/StepBadges";
import StepReview from "@/components/onboarding/StepReview";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

const STEP_LABELS = ["Basics", "About", "Experiences", "Skills & Interests", "Badges", "Review"];
const SKIPPABLE_STEPS = [2, 3, 4]; // 0-indexed

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const navigate = useNavigate();

  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = () => {
    if (step === 0) {
      return data.firstName.trim() && data.lastName.trim() && data.university.trim() && data.course.trim() && data.yearOfStudy;
    }
    return true;
  };

  const next = () => {
    if (step < STEP_LABELS.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleCreate = () => {
    // TODO: Save to database when Supabase is connected
    console.log("Onboarding data:", data);
    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepBasics data={data} updateData={updateData} />;
      case 1:
        return <StepAbout data={data} updateData={updateData} />;
      case 2:
        return <StepExperiences data={data} updateData={updateData} />;
      case 3:
        return <StepSkills data={data} updateData={updateData} />;
      case 4:
        return <StepBadges data={data} updateData={updateData} />;
      case 5:
        return <StepReview data={data} onEdit={setStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-tight text-foreground">Layer</span>
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {STEP_LABELS.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="container max-w-2xl pt-6">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-xs font-medium hidden sm:inline ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          ))}
          <span className="text-xs font-medium sm:hidden text-primary">
            {STEP_LABELS[step]}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <div className="flex-1 container max-w-2xl py-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="border-t border-border bg-background sticky bottom-0">
        <div className="container max-w-2xl flex items-center justify-between py-4">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-2">
            {SKIPPABLE_STEPS.includes(step) && (
              <Button variant="ghost" onClick={next} className="gap-2 text-muted-foreground">
                Skip <SkipForward className="w-4 h-4" />
              </Button>
            )}

            {step < STEP_LABELS.length - 1 ? (
              <Button onClick={next} disabled={!canProceed()} className="gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleCreate} className="gap-2">
                Create My Layer 🚀
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
