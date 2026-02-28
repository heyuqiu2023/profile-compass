import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Copy, ExternalLink, GraduationCap, MapPin, Check } from "lucide-react";
import { THEMES, themeIds, ThemeId } from "@/lib/themes";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const WebsitePreview = () => {
  const { data, update } = useProfile();
  const websiteUrl = `${window.location.origin}/u/demotozero`;
  const [saving, setSaving] = useState(false);

  const currentTheme: ThemeId = data.theme || "navy";

  const copyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    toast.success("Copied!");
  };

  const selectTheme = async (themeId: ThemeId) => {
    update({ theme: themeId });
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ theme: themeId } as any).eq("id", user.id);
      }
      toast.success(`Theme changed to ${THEMES[themeId].label}`);
    } catch {
      toast.error("Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8 space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Your Personal Website</h1>
        <p className="text-sm text-muted-foreground mt-1">Share your profile with anyone using the link below.</p>
      </div>

      {/* URL Box */}
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="flex-1 bg-muted rounded-md px-4 py-2.5 text-sm text-foreground font-mono truncate">
            {websiteUrl}
          </div>
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-1" /> Copy Link
          </Button>
          <Button size="sm" onClick={() => window.open(websiteUrl, "_blank")}>
            <ExternalLink className="w-4 h-4 mr-1" /> View Website
          </Button>
        </CardContent>
      </Card>

      {/* Theme Picker */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Choose Theme</h2>
        <p className="text-sm text-muted-foreground mb-4">Pick the colour scheme for your public website.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {themeIds.map((id) => {
            const theme = THEMES[id];
            const selected = currentTheme === id;
            return (
              <button
                key={id}
                onClick={() => selectTheme(id)}
                disabled={saving}
                className={`relative rounded-xl border-2 p-3 transition-all text-left ${
                  selected
                    ? "border-primary shadow-md ring-1 ring-primary/20"
                    : "border-border hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                {/* Color swatches */}
                <div className="flex gap-1.5 mb-2.5">
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: theme.colors.bg }}
                  />
                </div>
                {/* Mini preview bar */}
                <div
                  className="h-8 rounded-md mb-2 flex items-center px-2 gap-1"
                  style={{ backgroundColor: theme.colors.bg, border: `1px solid ${theme.colors.isDark ? theme.colors.secondary + '40' : '#e5e7eb'}` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                  <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                </div>
                <p className="text-xs font-semibold text-foreground">{theme.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Card */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Preview</h2>
        <Card className="overflow-hidden border border-border">
          <div
            className="p-8 flex flex-col items-center text-center"
            style={{ backgroundColor: THEMES[currentTheme].colors.bg }}
          >
            <Avatar className="w-20 h-20 border-2 shadow" style={{ borderColor: THEMES[currentTheme].colors.accent }}>
              <AvatarImage src={data.profilePhotoPreview} />
              <AvatarFallback
                className="text-2xl font-bold text-white"
                style={{ backgroundColor: THEMES[currentTheme].colors.accent }}
              >
                {data.firstName?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <h3
              className="text-xl font-bold mt-4"
              style={{ color: THEMES[currentTheme].colors.text }}
            >
              {data.firstName} {data.lastName}
            </h3>
            <p style={{ color: THEMES[currentTheme].colors.muted }} className="mt-1">
              {data.headline}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: THEMES[currentTheme].colors.muted }}>
              {data.university && (
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {data.university}</span>
              )}
              {data.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {data.location}</span>
              )}
            </div>
            {/* Sample skill pills */}
            {data.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                {data.skills.slice(0, 4).map((s) => (
                  <span
                    key={s.id}
                    className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: THEMES[currentTheme].colors.accent + "18",
                      color: THEMES[currentTheme].colors.accent,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground line-clamp-3">{data.bio}</p>
            <Button variant="link" size="sm" className="mt-2" onClick={() => window.open(websiteUrl, "_blank")}>
              View full website →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsitePreview;
