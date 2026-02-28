import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OnboardingData, Experience, BadgeEntry, EXPERIENCE_TYPES, BADGE_CATEGORIES, BADGE_ICONS, YEAR_OPTIONS } from "@/types/onboarding";
import { useProfile } from "@/contexts/ProfileContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, Plus, Trash2, Save, X, Pencil } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

// Demo data removed — now provided by ProfileContext
const EXPERIENCE_TYPE_COLORS: Record<string, string> = {
  Internship: "bg-blue-100 text-blue-800",
  "Part-time Job": "bg-green-100 text-green-800",
  Volunteering: "bg-purple-100 text-purple-800",
  "Society Role": "bg-amber-100 text-amber-800",
  Project: "bg-cyan-100 text-cyan-800",
  Competition: "bg-rose-100 text-rose-800",
  Research: "bg-indigo-100 text-indigo-800",
  Other: "bg-gray-100 text-gray-800",
};

const formatDate = (d: string) => {
  if (!d) return "Present";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

// ─── Tag Input ───
const TagInput = ({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) => {
  const [input, setInput] = useState("");
  const addTag = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput("");
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
  };
  return (
    <div className="flex flex-wrap gap-2 p-3 min-h-[44px] rounded-md border border-input bg-background">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="ml-1 hover:text-foreground">
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
  );
};

// ─── Experience Form Dialog (inline) ───
const ExperienceForm = ({
  exp,
  onSave,
  onCancel,
}: {
  exp: Experience;
  onSave: (exp: Experience) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(exp);
  const update = (p: Partial<Experience>) => setForm((f) => ({ ...f, ...p }));

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => update({ type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{EXPERIENCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => update({ title: e.target.value })} placeholder="Software Engineer" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Organisation</Label>
          <Input value={form.organisation} onChange={(e) => update({ organisation: e.target.value })} placeholder="Company name" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input type="month" value={form.startDate} onChange={(e) => update({ startDate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>End date</Label>
            <Input type="month" value={form.endDate} onChange={(e) => update({ endDate: e.target.value })} disabled={form.isCurrent} />
            <div className="flex items-center gap-2 mt-1">
              <Switch checked={form.isCurrent} onCheckedChange={(v) => update({ isCurrent: v, endDate: "" })} />
              <span className="text-xs text-muted-foreground">I currently do this</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => update({ description: e.target.value.slice(0, 500) })} rows={3} maxLength={500} placeholder="What did you do?" />
          <p className="text-xs text-muted-foreground text-right">{form.description.length}/500</p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" onClick={() => onSave(form)} className="gap-1"><Save className="w-3.5 h-3.5" /> Save</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Badge Form (inline) ───
const BadgeForm = ({
  badge,
  onSave,
  onCancel,
}: {
  badge: BadgeEntry;
  onSave: (b: BadgeEntry) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(badge);
  const update = (p: Partial<BadgeEntry>) => setForm((f) => ({ ...f, ...p }));

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2">
            {BADGE_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => update({ icon })}
                className={`w-9 h-9 rounded-md flex items-center justify-center text-lg border transition-colors ${
                  form.icon === icon ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
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
            <Input value={form.title} onChange={(e) => update({ title: e.target.value })} placeholder="Badge title" />
          </div>
          <div className="space-y-2">
            <Label>Issuer</Label>
            <Input value={form.issuer} onChange={(e) => update({ issuer: e.target.value })} placeholder="Issuing org" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date received</Label>
            <Input type="month" value={form.dateReceived} onChange={(e) => update({ dateReceived: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => update({ category: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{BADGE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" onClick={() => onSave(form)} className="gap-1"><Save className="w-3.5 h-3.5" /> Save</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Main Profile Editor ───
const ProfileEditor = () => {
  const { data, update } = useProfile();
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [addingExp, setAddingExp] = useState(false);
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
  const [addingBadge, setAddingBadge] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [location.hash]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) update({ profilePhoto: file, profilePhotoPreview: URL.createObjectURL(file) });
  };

  const saveExperience = (exp: Experience) => {
    if (editingExpId) {
      update({ experiences: data.experiences.map((e) => (e.id === editingExpId ? exp : e)) });
      setEditingExpId(null);
    } else {
      update({ experiences: [exp, ...data.experiences] });
      setAddingExp(false);
    }
    toast.success("Experience saved");
  };

  const deleteExperience = (id: string) => {
    update({ experiences: data.experiences.filter((e) => e.id !== id) });
    toast.success("Experience removed");
  };

  const saveBadge = (badge: BadgeEntry) => {
    if (editingBadgeId) {
      update({ badges: data.badges.map((b) => (b.id === editingBadgeId ? badge : b)) });
      setEditingBadgeId(null);
    } else {
      update({ badges: [...data.badges, badge] });
      setAddingBadge(false);
    }
    toast.success("Badge saved");
  };

  const deleteBadge = (id: string) => {
    update({ badges: data.badges.filter((b) => b.id !== id) });
    toast.success("Badge removed");
  };

  // Sort experiences by date (newest first)
  const sortedExperiences = [...data.experiences].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return b.startDate.localeCompare(a.startDate);
  });

  const handleSave = () => {
    // TODO: Save to database
    toast.success("Profile saved successfully");
  };

  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-1">Edit your information and keep it up to date.</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save
        </Button>
      </div>

      {/* Basics */}
      <Card id="section-basics">
        <CardHeader><CardTitle className="text-lg">Basics</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
              <Avatar className="w-24 h-24 border-2 border-border">
                <AvatarImage src={data.profilePhotoPreview} />
                <AvatarFallback className="bg-muted text-muted-foreground text-2xl">{data.firstName?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-background" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input value={data.firstName} onChange={(e) => update({ firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input value={data.lastName} onChange={(e) => update({ lastName: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input value={data.headline} onChange={(e) => update({ headline: e.target.value.slice(0, 120) })} maxLength={120} />
            <p className="text-xs text-muted-foreground text-right">{data.headline.length}/120</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>University</Label>
              <Input value={data.university} onChange={(e) => update({ university: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Input value={data.course} onChange={(e) => update({ course: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year of study</Label>
              <Select value={data.yearOfStudy} onValueChange={(v) => update({ yearOfStudy: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{YEAR_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expected graduation</Label>
              <Input value={data.expectedGraduation} onChange={(e) => update({ expectedGraduation: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card id="section-about">
        <CardHeader><CardTitle className="text-lg">About</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={data.bio} onChange={(e) => update({ bio: e.target.value.slice(0, 300) })} rows={3} maxLength={300} />
            <p className="text-xs text-muted-foreground text-right">{data.bio.length}/300</p>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={data.location} onChange={(e) => update({ location: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={data.linkedinUrl} onChange={(e) => update({ linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/…" />
            </div>
            <div className="space-y-2">
              <Label>GitHub</Label>
              <Input value={data.githubUrl} onChange={(e) => update({ githubUrl: e.target.value })} placeholder="https://github.com/…" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={data.websiteUrl} onChange={(e) => update({ websiteUrl: e.target.value })} placeholder="https://…" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experiences Timeline */}
      <Card id="section-experiences">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Experiences</CardTitle>
          {!addingExp && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setAddingExp(true);
                setEditingExpId(null);
              }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-0">
          {addingExp && (
            <div className="mb-6">
              <ExperienceForm
                exp={{ id: crypto.randomUUID(), type: "", title: "", organisation: "", startDate: "", endDate: "", isCurrent: false, description: "" }}
                onSave={saveExperience}
                onCancel={() => setAddingExp(false)}
              />
            </div>
          )}

          {/* Timeline */}
          <div className="relative">
            {sortedExperiences.length > 0 && (
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
            )}

            {sortedExperiences.map((exp) => (
              <div key={exp.id}>
                {editingExpId === exp.id ? (
                  <div className="mb-4 ml-10">
                    <ExperienceForm
                      exp={exp}
                      onSave={saveExperience}
                      onCancel={() => setEditingExpId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex gap-4 pb-6 group">
                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0 mt-1.5">
                      <div className={`w-[9px] h-[9px] rounded-full border-2 ${exp.isCurrent ? "border-primary bg-primary" : "border-muted-foreground bg-background"}`} style={{ marginLeft: "11px" }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EXPERIENCE_TYPE_COLORS[exp.type] || EXPERIENCE_TYPE_COLORS.Other}`}>
                              {exp.type || "Other"}
                            </span>
                            <h4 className="font-semibold text-foreground text-sm">{exp.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{exp.organisation}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingExpId(exp.id); setAddingExp(false); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteExperience(exp.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {sortedExperiences.length === 0 && !addingExp && (
              <p className="text-sm text-muted-foreground italic py-4">No experiences added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills & Interests */}
      <Card id="section-skills">
        <CardHeader><CardTitle className="text-lg">Skills & Interests</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skills</Label>
            <TagInput tags={data.skills} onChange={(skills) => update({ skills })} placeholder="e.g. Python, React, SQL" />
          </div>
          <div className="space-y-2">
            <Label>Interests</Label>
            <TagInput tags={data.interests} onChange={(interests) => update({ interests })} placeholder="e.g. Fintech, Sustainability" />
          </div>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <Card id="section-badges">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Badges</CardTitle>
          {!addingBadge && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setAddingBadge(true);
                setEditingBadgeId(null);
              }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {addingBadge && (
            <div className="mb-6">
              <BadgeForm
                badge={{ id: crypto.randomUUID(), title: "", issuer: "", dateReceived: "", category: "", icon: "🏆" }}
                onSave={saveBadge}
                onCancel={() => setAddingBadge(false)}
              />
            </div>
          )}

          {data.badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.badges.map((badge) => (
                <div key={badge.id}>
                  {editingBadgeId === badge.id ? (
                    <BadgeForm
                      badge={badge}
                      onSave={saveBadge}
                      onCancel={() => setEditingBadgeId(null)}
                    />
                  ) : (
                    <Card className="border border-border group hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5">{badge.icon}</span>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-foreground text-sm leading-tight">{badge.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{badge.issuer}</p>
                              {badge.category && (
                                <Badge variant="outline" className="text-[10px] mt-1.5">{badge.category}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingBadgeId(badge.id); setAddingBadge(false); }}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteBadge(badge.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !addingBadge && <p className="text-sm text-muted-foreground italic">No badges added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEditor;
