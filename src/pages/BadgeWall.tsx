import { useState, useRef, useCallback } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Download, Copy, Share2 } from "lucide-react";
import { BadgeEntry, BADGE_CATEGORIES, BADGE_ICONS } from "@/types/onboarding";

const CATEGORY_COLORS: Record<string, string> = {
  Certification: "bg-blue-100 text-blue-800 border-blue-200",
  Award: "bg-amber-100 text-amber-800 border-amber-200",
  Achievement: "bg-green-100 text-green-800 border-green-200",
  Competition: "bg-purple-100 text-purple-800 border-purple-200",
  Publication: "bg-gray-100 text-gray-700 border-gray-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

const emptyBadge: Omit<BadgeEntry, "id"> = { title: "", issuer: "", dateReceived: "", category: "Achievement", icon: "🏆" };

const BadgeWall = () => {
  const { data, update } = useProfile();
  const [editing, setEditing] = useState<BadgeEntry | null>(null);
  const [form, setForm] = useState(emptyBadge);
  const [dialogOpen, setDialogOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const websiteUrl = `${window.location.origin}/u/demotozero`;

  const openAdd = () => {
    setEditing(null);
    setForm(emptyBadge);
    setDialogOpen(true);
  };

  const openEdit = (b: BadgeEntry) => {
    setEditing(b);
    setForm({ title: b.title, issuer: b.issuer, dateReceived: b.dateReceived, category: b.category, icon: b.icon });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (editing) {
      update({ badges: data.badges.map((b) => b.id === editing.id ? { ...b, ...form } : b) });
      toast.success("Badge updated");
    } else {
      update({ badges: [...data.badges, { ...form, id: crypto.randomUUID() }] });
      toast.success("Badge added");
    }
    setDialogOpen(false);
  };

  const deleteBadge = (id: string) => {
    update({ badges: data.badges.filter((b) => b.id !== id) });
    toast.success("Badge removed");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    toast.success("Copied!");
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: `${data.firstName}'s Profile`, url: websiteUrl });
    } else {
      copyLink();
    }
  };

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `${data.firstName || "Business"}_Card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Card downloaded!");
    } catch {
      toast.error("Failed to download card");
    }
  }, [data.firstName]);

  return (
    <div className="container max-w-5xl py-8 space-y-10 animate-fade-in-up">
      {/* Badge Wall Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Badge Wall</h1>
            <p className="text-sm text-muted-foreground mt-1">Showcase your achievements, certifications and awards.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} size="sm"><Plus className="w-4 h-4 mr-1" /> Add Badge</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Badge" : "Add Badge"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. AWS Certified" />
                </div>
                <div>
                  <Label>Issuer</Label>
                  <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="e.g. Amazon Web Services" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="month" value={form.dateReceived} onChange={(e) => setForm({ ...form, dateReceived: e.target.value })} />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BADGE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Icon</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {BADGE_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        className={`text-xl p-1.5 rounded-md border transition-all ${form.icon === icon ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={save}>{editing ? "Update" : "Add"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {data.badges.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No badges yet. Add your first achievement!</CardContent></Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.badges.map((badge) => (
              <Card key={badge.id} className="group relative border border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4 text-center">
                  <span className="text-3xl">{badge.icon}</span>
                  <h4 className="font-semibold text-foreground text-sm mt-2 leading-tight">{badge.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{badge.issuer}</p>
                  {badge.dateReceived && <p className="text-[10px] text-muted-foreground mt-0.5">{badge.dateReceived}</p>}
                  <Badge variant="outline" className={`text-[10px] mt-2 ${CATEGORY_COLORS[badge.category] || CATEGORY_COLORS.Other}`}>
                    {badge.category}
                  </Badge>
                </CardContent>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(badge)} className="p-1 rounded hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => deleteBadge(badge.id)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Digital Business Card Section */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-1">Your Business Card</h2>
        <p className="text-sm text-muted-foreground mb-6">Download or share your digital business card.</p>

        <div className="flex flex-col items-center gap-6">
          {/* Card */}
          <div
            ref={cardRef}
            className="w-full max-w-[420px] bg-white rounded-xl border border-border shadow-lg overflow-hidden"
            style={{ aspectRatio: "3.5 / 2" }}
          >
            <div className="h-2 bg-primary w-full" />
            <div className="p-5 flex justify-between items-start h-[calc(100%-8px)]">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{data.firstName} {data.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{data.headline}</p>
                  <p className="text-xs text-muted-foreground mt-1">{data.university}</p>
                </div>
                <div className="flex gap-3 mt-auto text-muted-foreground">
                  {data.linkedinUrl && <span className="text-xs">LinkedIn</span>}
                  {data.githubUrl && <span className="text-xs">GitHub</span>}
                  {data.location && <span className="text-xs">{data.location}</span>}
                </div>
              </div>
              <div className="flex-shrink-0">
                <QRCodeSVG value={websiteUrl} size={80} level="M" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={copyLink}><Copy className="w-4 h-4 mr-1" /> Copy Link</Button>
            <Button variant="outline" size="sm" onClick={downloadCard}><Download className="w-4 h-4 mr-1" /> Download Card</Button>
            <Button variant="outline" size="sm" onClick={share}><Share2 className="w-4 h-4 mr-1" /> Share</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BadgeWall;
