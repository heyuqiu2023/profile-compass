import { OnboardingData } from "@/types/onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
}

const StepAbout = ({ data, updateData }: Props) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">About you</h2>
        <p className="text-muted-foreground mt-1">Tell people a bit more about yourself.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Short bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value.slice(0, 300) })}
          placeholder="I'm a second-year CS student passionate about fintech and design…"
          rows={4}
          maxLength={300}
        />
        <p className="text-xs text-muted-foreground text-right">{data.bio.length}/300</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => updateData({ location: e.target.value })}
          placeholder="London, UK"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
        <Input
          id="linkedinUrl"
          value={data.linkedinUrl}
          onChange={(e) => updateData({ linkedinUrl: e.target.value })}
          placeholder="https://linkedin.com/in/yourname"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub URL</Label>
        <Input
          id="githubUrl"
          value={data.githubUrl}
          onChange={(e) => updateData({ githubUrl: e.target.value })}
          placeholder="https://github.com/yourname"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Personal website</Label>
        <Input
          id="websiteUrl"
          value={data.websiteUrl}
          onChange={(e) => updateData({ websiteUrl: e.target.value })}
          placeholder="https://yoursite.com"
        />
      </div>
    </div>
  );
};

export default StepAbout;
