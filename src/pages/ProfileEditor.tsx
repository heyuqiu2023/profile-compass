import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  OnboardingData, Experience, BadgeEntry, ActivityEntry, Skill, Proficiency, CertificationEntry,
  EXPERIENCE_TYPES, BADGE_CATEGORIES, BADGE_ICONS,
  ACTIVITY_TYPES, ACTIVITY_TYPE_COLORS, YEAR_OPTIONS, PROFICIENCY_LEVELS,
} from "@/types/onboarding";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Camera, Plus, Trash2, Save, X, Pencil, Linkedin, Github, Globe, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// ─── Colors ───
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
const TagInput = ({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder: string }) => {
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
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="ml-1 hover:text-foreground"><X className="w-3 h-3" /></button>
        </Badge>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ""} className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground" />
    </div>
  );
};

// ─── Experience Form ───
const ExperienceForm = ({ exp, onSave, onCancel }: { exp: Experience; onSave: (e: Experience) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(exp);
  const u = (p: Partial<Experience>) => setForm((f) => ({ ...f, ...p }));
  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => u({ type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{EXPERIENCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => u({ title: e.target.value })} placeholder="Software Engineer" /></div>
        </div>
        <div className="space-y-2"><Label>Organisation</Label><Input value={form.organisation} onChange={(e) => u({ organisation: e.target.value })} placeholder="Company name" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Start date</Label><Input type="month" value={form.startDate} onChange={(e) => u({ startDate: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>End date</Label>
            <Input type="month" value={form.endDate} onChange={(e) => u({ endDate: e.target.value })} disabled={form.isCurrent} />
            <div className="flex items-center gap-2 mt-1"><Switch checked={form.isCurrent} onCheckedChange={(v) => u({ isCurrent: v, endDate: "" })} /><span className="text-xs text-muted-foreground">I currently do this</span></div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => u({ description: e.target.value.slice(0, 500) })} rows={3} maxLength={500} placeholder="What did you do?" />
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

// ─── Activity Modal ───
const ActivityFormDialog = ({ activity, open, onOpenChange, onSave }: {
  activity: ActivityEntry | null; open: boolean; onOpenChange: (o: boolean) => void; onSave: (a: ActivityEntry) => void;
}) => {
  const empty: ActivityEntry = { id: crypto.randomUUID(), title: "", type: "Event", activityDate: "", note: "" };
  const [form, setForm] = useState<ActivityEntry>(activity || empty);
  useEffect(() => { setForm(activity || { ...empty, id: crypto.randomUUID() }); }, [activity, open]);
  const u = (p: Partial<ActivityEntry>) => setForm((f) => ({ ...f, ...p }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{activity ? "Edit Activity" : "Log Activity"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => u({ title: e.target.value })} placeholder="e.g. Attended UCL AI Summit 2025" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => u({ type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ACTIVITY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="month" value={form.activityDate} onChange={(e) => u({ activityDate: e.target.value })} /></div>
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Input value={form.note} onChange={(e) => u({ note: e.target.value.slice(0, 200) })} maxLength={200} placeholder="e.g. Met 3 potential co-founders" />
            <p className="text-xs text-muted-foreground text-right">{form.note.length}/200</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => { if (!form.title.trim()) { toast.error("Title is required"); return; } onSave(form); onOpenChange(false); }}>{activity ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Skills Section ───
const SkillsSection = ({ skills, onChange }: { skills: Skill[]; onChange: (s: Skill[]) => void }) => {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProf, setNewProf] = useState<Proficiency>("intermediate");
  const [editingId, setEditingId] = useState<string | null>(null);

  const addSkill = () => {
    const name = newName.trim();
    if (!name) return;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) { toast.error("Skill already exists"); return; }
    onChange([...skills, { id: crypto.randomUUID(), name, proficiency: newProf }]);
    setNewName(""); setNewProf("intermediate"); setAdding(false);
    toast.success("Skill added");
  };

  const updateProficiency = (id: string, proficiency: Proficiency) => {
    onChange(skills.map((s) => s.id === id ? { ...s, proficiency } : s));
    setEditingId(null);
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
    toast.success("Skill removed");
  };

  const getProfLevel = (p: Proficiency) => PROFICIENCY_LEVELS.find((l) => l.value === p)!;

  return (
    <Card id="section-skills">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Skills</CardTitle>
        {!adding && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {adding && (
          <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Skill name" className="flex-1"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
            <Select value={newProf} onValueChange={(v) => setNewProf(v as Proficiency)}>
              <SelectTrigger className="w-full sm:w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>{PROFICIENCY_LEVELS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex gap-1.5">
              <Button size="sm" onClick={addSkill}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewName(""); }}>Cancel</Button>
            </div>
          </div>
        )}

        {skills.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((skill) => {
              const level = getProfLevel(skill.proficiency);
              return (
                <div key={skill.id} className="relative p-3 rounded-lg border border-border hover:shadow-sm transition-shadow group">
                  {/* Remove button */}
                  <button onClick={() => removeSkill(skill.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>

                  <p className="font-semibold text-foreground text-sm leading-tight pr-5">{skill.name}</p>

                  {/* Inline proficiency edit */}
                  {editingId === skill.id ? (
                    <Select value={skill.proficiency} onValueChange={(v) => updateProficiency(skill.id, v as Proficiency)}>
                      <SelectTrigger className="h-6 text-[11px] mt-1.5 w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>{PROFICIENCY_LEVELS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : (
                    <button onClick={() => setEditingId(skill.id)} className="text-xs text-muted-foreground mt-0.5 hover:text-foreground transition-colors">
                      {level.label}
                    </button>
                  )}

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${level.color}`} style={{ width: `${level.percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !adding && <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Certification Form Dialog ───
const CertificationFormDialog = ({ cert, open, onOpenChange, onSave }: {
  cert: CertificationEntry | null; open: boolean; onOpenChange: (o: boolean) => void; onSave: (c: CertificationEntry) => void;
}) => {
  const empty: CertificationEntry = { id: crypto.randomUUID(), name: "", issuer: "", issueDate: "", expiryDate: "", noExpiry: false, credentialId: "", credentialUrl: "" };
  const [form, setForm] = useState<CertificationEntry>(cert || empty);
  useEffect(() => { setForm(cert || { ...empty, id: crypto.randomUUID() }); }, [cert, open]);
  const u = (p: Partial<CertificationEntry>) => setForm((f) => ({ ...f, ...p }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{cert ? "Edit Certification" : "Add Certification"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2"><Label>Certification name</Label><Input value={form.name} onChange={(e) => u({ name: e.target.value })} placeholder="e.g. AWS Solutions Architect Associate" /></div>
          <div className="space-y-2"><Label>Issuing organisation</Label><Input value={form.issuer} onChange={(e) => u({ issuer: e.target.value })} placeholder="e.g. Amazon Web Services" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Issue date</Label><Input type="month" value={form.issueDate} onChange={(e) => u({ issueDate: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Expiry date</Label>
              <Input type="month" value={form.expiryDate} onChange={(e) => u({ expiryDate: e.target.value })} disabled={form.noExpiry} />
              <div className="flex items-center gap-2 mt-1"><Switch checked={form.noExpiry} onCheckedChange={(v) => u({ noExpiry: v, expiryDate: "" })} /><span className="text-xs text-muted-foreground">No expiry</span></div>
            </div>
          </div>
          <div className="space-y-2"><Label>Credential ID (optional)</Label><Input value={form.credentialId} onChange={(e) => u({ credentialId: e.target.value })} placeholder="e.g. AWS-SAA-2024-12345" /></div>
          <div className="space-y-2"><Label>Credential URL (optional)</Label><Input type="url" value={form.credentialUrl} onChange={(e) => u({ credentialUrl: e.target.value })} placeholder="https://..." /></div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => { if (!form.name.trim() || !form.issuer.trim()) { toast.error("Name and issuer are required"); return; } onSave(form); onOpenChange(false); }}>{cert ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Certifications Section ───
const CertificationsSection = ({ certifications, onChange }: { certifications: CertificationEntry[]; onChange: (c: CertificationEntry[]) => void }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationEntry | null>(null);

  const saveCert = (c: CertificationEntry) => {
    if (editingCert) {
      onChange(certifications.map((x) => x.id === editingCert.id ? c : x));
      toast.success("Certification updated");
    } else {
      onChange([c, ...certifications]);
      toast.success("Certification added");
    }
    setEditingCert(null);
  };

  const deleteCert = (id: string) => { onChange(certifications.filter((c) => c.id !== id)); toast.success("Certification removed"); };

  const fmtDate = (d: string) => {
    if (!d) return "";
    const [y, m] = d.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <>
      <Card id="section-certifications">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Certifications</CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setEditingCert(null); setDialogOpen(true); }}>
            <Plus className="w-3.5 h-3.5" /> Add Certification
          </Button>
        </CardHeader>
        <CardContent>
          {certifications.length > 0 ? (
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border group hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3 min-w-0">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-sm leading-tight">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Issued {fmtDate(cert.issueDate)}
                        {cert.noExpiry ? <span className="text-muted-foreground/60 ml-1">· No expiry</span> : cert.expiryDate ? ` — Expires ${fmtDate(cert.expiryDate)}` : ""}
                      </p>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                          <ExternalLink className="w-3 h-3" /> Verify
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingCert(cert); setDialogOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCert(cert.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No certifications added yet.</p>
          )}
        </CardContent>
      </Card>
      <CertificationFormDialog cert={editingCert} open={dialogOpen} onOpenChange={setDialogOpen} onSave={saveCert} />
    </>
  );
};

// ─── Main ───
const ProfileEditor = () => {
  const { data, update } = useProfile();
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [addingExp, setAddingExp] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityEntry | null>(null);
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

  const deleteExperience = (id: string) => { update({ experiences: data.experiences.filter((e) => e.id !== id) }); toast.success("Experience removed"); };

  const saveActivity = (a: ActivityEntry) => {
    if (editingActivity) {
      update({ activities: data.activities.map((act) => act.id === editingActivity.id ? a : act) });
      toast.success("Activity updated");
    } else {
      update({ activities: [a, ...data.activities] });
      toast.success("Activity logged");
    }
    setEditingActivity(null);
  };

  const deleteActivity = (id: string) => { update({ activities: data.activities.filter((a) => a.id !== id) }); toast.success("Activity removed"); };

  const sortedExperiences = [...data.experiences].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return b.startDate.localeCompare(a.startDate);
  });

  const sortedActivities = [...data.activities].sort((a, b) => b.activityDate.localeCompare(a.activityDate));

  const handleSave = () => { toast.success("Profile saved successfully"); };

  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-1">Edit your information and keep it up to date.</p>
        </div>
      </div>

      {/* Section 1: Header Area */}
      <Card id="section-basics">
        <CardContent className="pt-8 space-y-6">
          {/* Photo */}
          <div className="flex justify-center">
            <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
              <Avatar className="w-[120px] h-[120px] border-2 border-border">
                <AvatarImage src={data.profilePhotoPreview} />
                <AvatarFallback className="bg-muted text-muted-foreground text-3xl">{data.firstName?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-7 h-7 text-background" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </button>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First name</Label><Input value={data.firstName} onChange={(e) => update({ firstName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Last name</Label><Input value={data.lastName} onChange={(e) => update({ lastName: e.target.value })} /></div>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input value={data.headline} onChange={(e) => update({ headline: e.target.value.slice(0, 120) })} maxLength={120} />
            <p className="text-xs text-muted-foreground text-right">{data.headline.length}/120</p>
          </div>

          {/* University 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>University</Label><Input value={data.university} onChange={(e) => update({ university: e.target.value })} /></div>
            <div className="space-y-2"><Label>Course</Label><Input value={data.course} onChange={(e) => update({ course: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Year of study</Label>
              <Select value={data.yearOfStudy} onValueChange={(v) => update({ yearOfStudy: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{YEAR_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Expected graduation</Label><Input value={data.expectedGraduation} onChange={(e) => update({ expectedGraduation: e.target.value })} /></div>
          </div>

          {/* Location */}
          <div className="space-y-2"><Label>Location</Label><Input value={data.location} onChange={(e) => update({ location: e.target.value })} /></div>

          {/* Open To */}
          <div className="space-y-2">
            <Label>What are you open to?</Label>
            <Input value={data.openTo} onChange={(e) => update({ openTo: e.target.value.slice(0, 120) })} maxLength={120} placeholder="e.g. Product internships for Summer 2026" />
            <p className="text-xs text-muted-foreground text-right">{data.openTo.length}/120</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: About */}
      <Card id="section-about">
        <CardHeader><CardTitle className="text-lg">About</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={data.bio} onChange={(e) => update({ bio: e.target.value.slice(0, 300) })} rows={3} maxLength={300} />
            <p className="text-xs text-muted-foreground text-right">{data.bio.length}/300</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</Label>
              <Input value={data.linkedinUrl} onChange={(e) => update({ linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/…" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</Label>
              <Input value={data.githubUrl} onChange={(e) => update({ githubUrl: e.target.value })} placeholder="https://github.com/…" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</Label>
              <Input value={data.websiteUrl} onChange={(e) => update({ websiteUrl: e.target.value })} placeholder="https://…" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Experiences */}
      <Card id="section-experiences">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Experiences</CardTitle>
          {!addingExp && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setAddingExp(true); setEditingExpId(null); }}>
              <Plus className="w-3.5 h-3.5" /> Add Experience
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-0">
          {addingExp && (
            <div className="mb-6">
              <ExperienceForm exp={{ id: crypto.randomUUID(), type: "", title: "", organisation: "", startDate: "", endDate: "", isCurrent: false, description: "" }} onSave={saveExperience} onCancel={() => setAddingExp(false)} />
            </div>
          )}
          <div className="relative">
            {sortedExperiences.length > 0 && <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />}
            {sortedExperiences.map((exp) => (
              <div key={exp.id}>
                {editingExpId === exp.id ? (
                  <div className="mb-4 ml-10"><ExperienceForm exp={exp} onSave={saveExperience} onCancel={() => setEditingExpId(null)} /></div>
                ) : (
                  <div className="flex gap-4 pb-6 group">
                    <div className="relative flex-shrink-0 mt-1.5">
                      <div className={`w-[9px] h-[9px] rounded-full border-2 ${exp.isCurrent ? "border-primary bg-primary" : "border-muted-foreground bg-background"}`} style={{ marginLeft: "11px" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EXPERIENCE_TYPE_COLORS[exp.type] || EXPERIENCE_TYPE_COLORS.Other}`}>{exp.type || "Other"}</span>
                            <h4 className="font-semibold text-foreground text-sm">{exp.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{exp.organisation}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : formatDate(exp.endDate)}</p>
                          {exp.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingExpId(exp.id); setAddingExp(false); }}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteExperience(exp.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {sortedExperiences.length === 0 && !addingExp && <p className="text-sm text-muted-foreground italic py-4">No experiences added yet.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Activities */}
      <Card id="section-activities">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Activities</CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setEditingActivity(null); setActivityDialogOpen(true); }}>
            <Plus className="w-3.5 h-3.5" /> Log Activity
          </Button>
        </CardHeader>
        <CardContent>
          {sortedActivities.length > 0 ? (
            <div className="space-y-3">
              {sortedActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border group hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 ${ACTIVITY_TYPE_COLORS[act.type] || ACTIVITY_TYPE_COLORS.Other}`}>{act.type}</span>
                    <div className="min-w-0">
                      <h4 className="font-medium text-foreground text-sm leading-tight">{act.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {act.activityDate && <p className="text-xs text-muted-foreground">{formatDate(act.activityDate)}</p>}
                        {act.note && <p className="text-xs text-muted-foreground">· {act.note}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingActivity(act); setActivityDialogOpen(true); }}><Pencil className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteActivity(act.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No activities logged yet.</p>
          )}
        </CardContent>
      </Card>

      <ActivityFormDialog activity={editingActivity} open={activityDialogOpen} onOpenChange={setActivityDialogOpen} onSave={saveActivity} />

      <SkillsSection skills={data.skills} onChange={(skills) => update({ skills })} />

      {/* Section: Certifications */}
      <CertificationsSection certifications={data.certifications} onChange={(certifications) => update({ certifications })} />

      {/* Section 6: Interests */}
      <Card id="section-interests">
        <CardHeader><CardTitle className="text-lg">Interests</CardTitle></CardHeader>
        <CardContent>
          <TagInput tags={data.interests} onChange={(interests) => update({ interests })} placeholder="e.g. Fintech, Sustainability — press Enter to add" />
        </CardContent>
      </Card>

      {/* Section 7: Badges */}
      <Card id="section-badges">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Badges</CardTitle>
          <Link to="/dashboard/badges">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">Manage badges <ArrowRight className="w-3.5 h-3.5" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          {data.badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-medium text-foreground text-sm leading-tight">{badge.title}</h4>
                    <p className="text-xs text-muted-foreground">{badge.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No badges yet. <Link to="/dashboard/badges" className="text-primary underline">Add some →</Link></p>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Button onClick={handleSave} className="w-full sm:w-auto gap-2" size="lg">
        <Save className="w-4 h-4" /> Save Changes
      </Button>
    </div>
  );
};

export default ProfileEditor;
