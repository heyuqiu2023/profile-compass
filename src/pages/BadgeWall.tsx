import { useState, useRef, useCallback, useMemo } from "react";
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
import { Plus, Pencil, Trash2, Download, Copy, Share2, GripVertical, X } from "lucide-react";
import { BadgeEntry, BADGE_CATEGORIES, BADGE_ICONS } from "@/types/onboarding";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CATEGORY_COLORS: Record<string, string> = {
  Certification: "bg-blue-50 text-blue-800 border-blue-200",
  Award: "bg-amber-50 text-amber-800 border-amber-200",
  Achievement: "bg-green-50 text-green-800 border-green-200",
  Competition: "bg-purple-50 text-purple-800 border-purple-200",
  Publication: "bg-muted text-muted-foreground border-border",
  Other: "bg-muted text-muted-foreground border-border",
};

const RARITY_STYLES: Record<string, string> = {
  normal: "",
  rare: "border-amber-200 shadow-sm",
  major: "border-amber-300 shadow-md",
};

const emptyBadge: Omit<BadgeEntry, "id"> = { title: "", issuer: "", dateReceived: "", category: "Achievement", icon: "🏆" };

const MAX_FEATURED = 3;

// ─── Draggable Badge (in wall) ───
const DraggableBadge = ({ badge, onEdit, onDelete, isFeatured }: {
  badge: BadgeEntry;
  onEdit: (b: BadgeEntry) => void;
  onDelete: (id: string) => void;
  isFeatured: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: badge.id,
    data: { type: "badge", badge },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 180ms ease-out",
    opacity: isDragging ? 0.4 : 1,
    scale: isDragging ? "0.98" : "1",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={`group relative border hover:shadow-md transition-all duration-180 ${isFeatured ? "ring-2 ring-primary/30" : "border-border"}`}>
        <CardContent className="pt-5 pb-4 text-center">
          <div {...listeners} className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-3xl">{badge.icon}</span>
          <h4 className="font-semibold text-foreground text-sm mt-2 leading-tight">{badge.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{badge.issuer}</p>
          {badge.dateReceived && <p className="text-[10px] text-muted-foreground mt-0.5">{badge.dateReceived}</p>}
          <Badge variant="outline" className={`text-[10px] mt-2 ${CATEGORY_COLORS[badge.category] || CATEGORY_COLORS.Other}`}>
            {badge.category}
          </Badge>
          {isFeatured && (
            <div className="absolute top-2 right-8 text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              Featured
            </div>
          )}
        </CardContent>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(badge)} className="p-1 rounded hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
          <button onClick={() => onDelete(badge.id)} className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
        </div>
      </Card>
    </div>
  );
};

// ─── Featured Badge Chip (sortable in card) ───
const FeaturedBadgeChip = ({ badge, onRemove, editMode }: {
  badge: BadgeEntry;
  onRemove: () => void;
  editMode: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `featured-${badge.id}`,
    data: { type: "featured", badge },
  });

  const isRare = badge.category === "Award" || badge.category === "Competition";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 180ms ease-out",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(editMode ? listeners : {})}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm bg-muted/80 text-foreground transition-all duration-180
        ${editMode ? "cursor-grab active:cursor-grabbing hover:bg-muted" : ""}
        ${isRare ? "border border-amber-200 shadow-sm" : "border border-transparent"}
      `}
    >
      <span className="text-base">{badge.icon}</span>
      <span className="font-medium">{badge.title}</span>
      {editMode && (
        <button onClick={onRemove} className="ml-0.5 p-0.5 rounded-full hover:bg-destructive/10 transition-colors">
          <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
        </button>
      )}
    </div>
  );
};

// ─── Featured Drop Zone ───
const FeaturedDropZone = ({ children, editMode, isEmpty }: {
  children: React.ReactNode;
  editMode: boolean;
  isEmpty: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: "featured-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-wrap gap-2.5 min-h-[44px] rounded-xl p-3 transition-all duration-180
        ${editMode
          ? `border-2 border-dashed ${isOver ? "border-primary/50 bg-primary/5" : "border-border/60 bg-muted/30"}`
          : ""
        }
      `}
    >
      {isEmpty && editMode ? (
        <p className="text-xs text-muted-foreground w-full text-center py-2">
          Drag badges here to feature them on your card
        </p>
      ) : (
        children
      )}
    </div>
  );
};

// ─── Main Component ───
const BadgeWall = () => {
  const { data, update } = useProfile();
  const [editing, setEditing] = useState<BadgeEntry | null>(null);
  const [form, setForm] = useState(emptyBadge);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [featuredIds, setFeaturedIds] = useState<string[]>(() => {
    // Initialize from first 3 badges as demo
    return data.badges.slice(0, 2).map(b => b.id);
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const websiteUrl = `${window.location.origin}/u/demotozero`;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const featuredBadges = useMemo(() =>
    featuredIds.map(id => data.badges.find(b => b.id === id)).filter(Boolean) as BadgeEntry[],
    [featuredIds, data.badges]
  );

  const activeBadge = useMemo(() => {
    if (!activeId) return null;
    const cleanId = activeId.replace("featured-", "");
    return data.badges.find(b => b.id === cleanId) || null;
  }, [activeId, data.badges]);

  // ── Badge CRUD ──
  const openAdd = () => { setEditing(null); setForm(emptyBadge); setDialogOpen(true); };
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
    setFeaturedIds(prev => prev.filter(fid => fid !== id));
    toast.success("Badge removed");
  };

  // ── Featured badge management ──
  const addFeatured = (badgeId: string) => {
    if (featuredIds.includes(badgeId)) return;
    if (featuredIds.length >= MAX_FEATURED) {
      toast("Up to 3 featured badges", { description: "Remove one first to add another." });
      return;
    }
    setFeaturedIds(prev => [...prev, badgeId]);
  };

  const removeFeatured = (badgeId: string) => {
    setFeaturedIds(prev => prev.filter(id => id !== badgeId));
  };

  // ── Mobile fallback: tap to toggle ──
  const toggleFeatured = (badgeId: string) => {
    if (!editMode) return;
    if (featuredIds.includes(badgeId)) {
      removeFeatured(badgeId);
    } else {
      addFeatured(badgeId);
    }
  };

  // ── DnD handlers ──
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Dragging a wall badge into the featured zone
    if (!activeIdStr.startsWith("featured-") && overIdStr === "featured-zone") {
      addFeatured(activeIdStr);
      return;
    }

    // Dragging a wall badge over a featured badge (insert next to it)
    if (!activeIdStr.startsWith("featured-") && overIdStr.startsWith("featured-")) {
      addFeatured(activeIdStr);
      return;
    }

    // Reordering featured badges
    if (activeIdStr.startsWith("featured-") && overIdStr.startsWith("featured-")) {
      const activeClean = activeIdStr.replace("featured-", "");
      const overClean = overIdStr.replace("featured-", "");
      const oldIndex = featuredIds.indexOf(activeClean);
      const newIndex = featuredIds.indexOf(overClean);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setFeaturedIds(arrayMove(featuredIds, oldIndex, newIndex));
      }
      return;
    }

    // Dragging a featured badge out (not over featured zone or another featured)
    if (activeIdStr.startsWith("featured-") && overIdStr !== "featured-zone" && !overIdStr.startsWith("featured-")) {
      const cleanId = activeIdStr.replace("featured-", "");
      removeFeatured(cleanId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Allow dragging wall badges over the featured zone
  };

  // ── Card actions ──
  const copyLink = () => { navigator.clipboard.writeText(websiteUrl); toast.success("Copied!"); };
  const share = async () => {
    if (navigator.share) await navigator.share({ title: `${data.firstName}'s Profile`, url: websiteUrl });
    else copyLink();
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
    } catch { toast.error("Failed to download card"); }
  }, [data.firstName]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="container max-w-5xl py-8 space-y-10 animate-fade-in-up">

        {/* ═══ Business Card 2.0 ═══ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Business Card</h2>
              <p className="text-sm text-muted-foreground mt-1">Feature up to 3 badges on your card.</p>
            </div>
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Done" : "Edit Card"}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div
              ref={cardRef}
              className="w-full max-w-[480px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-8"
            >
              {/* Section A: Identity */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-semibold text-gray-900 truncate">
                    {data.firstName} {data.lastName}
                  </h3>
                  <p className="text-base text-gray-500 mt-0.5 truncate">{data.headline}</p>
                  <p className="text-sm text-gray-400 mt-0.5 truncate">{data.university}</p>
                </div>
                <div className="flex-shrink-0 ml-4 rounded-lg bg-white p-1.5 shadow-sm border border-gray-100">
                  <QRCodeSVG value={websiteUrl} size={72} level="M" />
                </div>
              </div>

              {/* Section B: Featured Badges */}
              <div className="mt-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                  Featured Badges
                </p>
                <FeaturedDropZone editMode={editMode} isEmpty={featuredBadges.length === 0}>
                  <SortableContext
                    items={featuredIds.map(id => `featured-${id}`)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {featuredBadges.map((badge) => (
                      <FeaturedBadgeChip
                        key={badge.id}
                        badge={badge}
                        editMode={editMode}
                        onRemove={() => removeFeatured(badge.id)}
                      />
                    ))}
                  </SortableContext>
                </FeaturedDropZone>
              </div>

              {/* Bottom: links */}
              <div className="flex gap-3 mt-5 text-gray-400">
                {data.linkedinUrl && <span className="text-xs">LinkedIn</span>}
                {data.githubUrl && <span className="text-xs">GitHub</span>}
                {data.location && <span className="text-xs">{data.location}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={copyLink}><Copy className="w-4 h-4 mr-1" /> Copy Link</Button>
              <Button variant="outline" size="sm" onClick={downloadCard}><Download className="w-4 h-4 mr-1" /> Download</Button>
              <Button variant="outline" size="sm" onClick={share}><Share2 className="w-4 h-4 mr-1" /> Share</Button>
            </div>
          </div>
        </section>

        {/* ═══ Badge Wall ═══ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Badge Wall</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {editMode
                  ? "Drag badges to feature them on your card, or tap to toggle."
                  : "Showcase your achievements, certifications and awards."
                }
              </p>
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
            <SortableContext items={data.badges.map(b => b.id)} strategy={horizontalListSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.badges.map((badge) => (
                  <div key={badge.id} onClick={() => toggleFeatured(badge.id)}>
                    <DraggableBadge
                      badge={badge}
                      onEdit={openEdit}
                      onDelete={deleteBadge}
                      isFeatured={featuredIds.includes(badge.id)}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          )}
        </section>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeBadge && (
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm bg-white border border-border shadow-lg opacity-90 scale-[0.98]">
            <span className="text-base">{activeBadge.icon}</span>
            <span className="font-medium">{activeBadge.title}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default BadgeWall;
