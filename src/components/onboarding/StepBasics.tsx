import { OnboardingData, YEAR_OPTIONS } from "@/types/onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useRef } from "react";

interface Props {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
}

const StepBasics = ({ data, updateData }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({
        profilePhoto: file,
        profilePhotoPreview: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">The basics</h2>
        <p className="text-muted-foreground mt-1">Let's start with who you are.</p>
      </div>

      {/* Photo */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative group"
        >
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={data.profilePhotoPreview} />
            <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
              {data.firstName?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-background" />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name *</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name *</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          value={data.headline}
          onChange={(e) => updateData({ headline: e.target.value.slice(0, 120) })}
          placeholder="Computer Science student at UCL"
          maxLength={120}
        />
        <p className="text-xs text-muted-foreground text-right">{data.headline.length}/120</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">University *</Label>
        <Input
          id="university"
          value={data.university}
          onChange={(e) => updateData({ university: e.target.value })}
          placeholder="University College London"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">Course / Programme *</Label>
        <Input
          id="course"
          value={data.course}
          onChange={(e) => updateData({ course: e.target.value })}
          placeholder="BSc Computer Science"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Year of study *</Label>
          <Select value={data.yearOfStudy} onValueChange={(v) => updateData({ yearOfStudy: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="graduation">Expected graduation</Label>
          <Input
            id="graduation"
            value={data.expectedGraduation}
            onChange={(e) => updateData({ expectedGraduation: e.target.value })}
            placeholder="2027"
          />
        </div>
      </div>
    </div>
  );
};

export default StepBasics;
