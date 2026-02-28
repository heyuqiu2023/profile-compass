import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface Props {
  data: OnboardingData;
  onEdit: (step: number) => void;
}

const Section = ({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) => (
  <Card className="border border-border">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)} className="gap-1 text-muted-foreground">
          <Pencil className="w-3 h-3" /> Edit
        </Button>
      </div>
      {children}
    </CardContent>
  </Card>
);

const StepReview = ({ data, onEdit }: Props) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review your profile</h2>
        <p className="text-muted-foreground mt-1">Check everything looks good before creating your Layer.</p>
      </div>

      {/* Basics */}
      <Section title="Basics" step={0} onEdit={onEdit}>
        <div className="space-y-1 text-sm">
          <p className="text-foreground font-medium">{data.firstName} {data.lastName}</p>
          {data.headline && <p className="text-muted-foreground">{data.headline}</p>}
          <p className="text-muted-foreground">{data.university} · {data.course} · {data.yearOfStudy}</p>
          {data.expectedGraduation && <p className="text-muted-foreground">Graduating {data.expectedGraduation}</p>}
        </div>
      </Section>

      {/* About */}
      <Section title="About" step={1} onEdit={onEdit}>
        <div className="space-y-1 text-sm">
          {data.bio && <p className="text-muted-foreground">{data.bio}</p>}
          {data.location && <p className="text-muted-foreground">📍 {data.location}</p>}
          {!data.bio && !data.location && <p className="text-muted-foreground italic">Not filled in yet</p>}
        </div>
      </Section>

      {/* Experiences */}
      <Section title={`Experiences (${data.experiences.length})`} step={2} onEdit={onEdit}>
        {data.experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No experiences added</p>
        ) : (
          <div className="space-y-3">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{exp.type || "Other"}</Badge>
                  <span className="font-medium text-foreground">{exp.title}</span>
                </div>
                <p className="text-muted-foreground">{exp.organisation}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Skills & Interests */}
      <Section title="Skills & Interests" step={3} onEdit={onEdit}>
        {data.skills.length === 0 && data.interests.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">None added yet</p>
        ) : (
          <div className="space-y-3">
            {data.skills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.interests.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.interests.map((i) => (
                    <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Badges */}
      <Section title={`Badges (${data.badges.length})`} step={4} onEdit={onEdit}>
        {data.badges.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No badges added</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.badges.map((b) => (
              <div key={b.id} className="flex items-center gap-2 text-sm">
                <span className="text-lg">{b.icon}</span>
                <div>
                  <p className="font-medium text-foreground leading-tight">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default StepReview;
