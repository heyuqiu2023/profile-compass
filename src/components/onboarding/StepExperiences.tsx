import { OnboardingData, Experience, EXPERIENCE_TYPES } from "@/types/onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
}

const emptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  type: "",
  title: "",
  organisation: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
});

const StepExperiences = ({ data, updateData }: Props) => {
  const updateExp = (id: string, partial: Partial<Experience>) => {
    updateData({
      experiences: data.experiences.map((e) =>
        e.id === id ? { ...e, ...partial } : e
      ),
    });
  };

  const addExp = () => {
    updateData({ experiences: [...data.experiences, emptyExperience()] });
  };

  const removeExp = (id: string) => {
    updateData({ experiences: data.experiences.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Experiences</h2>
        <p className="text-muted-foreground mt-1">Add internships, roles, projects, and more. You can skip this for now.</p>
      </div>

      {data.experiences.map((exp) => (
        <Card key={exp.id} className="border border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-foreground">Experience</Label>
              <Button variant="ghost" size="icon" onClick={() => removeExp(exp.id)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={exp.type} onValueChange={(v) => updateExp(exp.id, { type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateExp(exp.id, { title: e.target.value })}
                  placeholder="Marketing Intern"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Organisation</Label>
              <Input
                value={exp.organisation}
                onChange={(e) => updateExp(exp.id, { organisation: e.target.value })}
                placeholder="Deloitte"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExp(exp.id, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExp(exp.id, { endDate: e.target.value })}
                  disabled={exp.isCurrent}
                />
                <div className="flex items-center gap-2 mt-1">
                  <Switch
                    checked={exp.isCurrent}
                    onCheckedChange={(v) => updateExp(exp.id, { isCurrent: v, endDate: "" })}
                  />
                  <span className="text-xs text-muted-foreground">I currently do this</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExp(exp.id, { description: e.target.value.slice(0, 500) })}
                placeholder="What did you do? What was the impact?"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">{exp.description.length}/500</p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addExp} className="w-full gap-2">
        <Plus className="w-4 h-4" /> Add Experience
      </Button>
    </div>
  );
};

export default StepExperiences;
