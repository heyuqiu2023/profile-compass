import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
}

const TagInput = ({
  label,
  placeholder,
  tags,
  onChange,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 p-3 min-h-[44px] rounded-md border border-input bg-background">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="ml-1 hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
    </div>
  );
};

const StepSkills = ({ data, updateData }: Props) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Skills & Interests</h2>
        <p className="text-muted-foreground mt-1">What can you do, and what are you into? You can skip this for now.</p>
      </div>

      <TagInput
        label="Skills"
        placeholder="e.g. Python, Financial Modelling, Figma"
        tags={data.skills.map((s) => s.name)}
        onChange={(names) => updateData({ skills: names.map((n, i) => ({ id: data.skills[i]?.id || crypto.randomUUID(), name: n, proficiency: data.skills[i]?.proficiency || "intermediate" })) })}
      />

      <TagInput
        label="Interests"
        placeholder="e.g. Fintech, Sustainability, UI Design"
        tags={data.interests}
        onChange={(interests) => updateData({ interests })}
      />
    </div>
  );
};

export default StepSkills;
