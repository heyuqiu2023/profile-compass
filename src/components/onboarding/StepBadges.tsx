import { OnboardingData, BadgeEntry, BADGE_CATEGORIES, BADGE_ICONS } from "@/types/onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
}

const emptyBadge = (): BadgeEntry => ({
  id: crypto.randomUUID(),
  title: "",
  issuer: "",
  dateReceived: "",
  category: "",
  icon: "🏆",
});

const StepBadges = ({ data, updateData }: Props) => {
  const updateBadge = (id: string, partial: Partial<BadgeEntry>) => {
    updateData({
      badges: data.badges.map((b) => (b.id === id ? { ...b, ...partial } : b)),
    });
  };

  const addBadge = () => {
    updateData({ badges: [...data.badges, emptyBadge()] });
  };

  const removeBadge = (id: string) => {
    updateData({ badges: data.badges.filter((b) => b.id !== id) });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Badges</h2>
        <p className="text-muted-foreground mt-1">Certifications, awards, and achievements. You can skip this for now.</p>
      </div>

      {data.badges.map((badge) => (
        <Card key={badge.id} className="border border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{badge.icon}</span>
              <Button variant="ghost" size="icon" onClick={() => removeBadge(badge.id)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Icon picker */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {BADGE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => updateBadge(badge.id, { icon })}
                    className={`w-9 h-9 rounded-md flex items-center justify-center text-lg border transition-colors ${
                      badge.icon === icon
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={badge.title}
                  onChange={(e) => updateBadge(badge.id, { title: e.target.value })}
                  placeholder="AWS Cloud Practitioner"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input
                  value={badge.issuer}
                  onChange={(e) => updateBadge(badge.id, { issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date received</Label>
                <Input
                  type="month"
                  value={badge.dateReceived}
                  onChange={(e) => updateBadge(badge.id, { dateReceived: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={badge.category} onValueChange={(v) => updateBadge(badge.id, { category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {BADGE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addBadge} className="w-full gap-2">
        <Plus className="w-4 h-4" /> Add Badge
      </Button>
    </div>
  );
};

export default StepBadges;
