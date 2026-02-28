import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Copy, ExternalLink, GraduationCap, MapPin } from "lucide-react";

const WebsitePreview = () => {
  const { data } = useProfile();
  const websiteUrl = `${window.location.origin}/u/demotozero`;

  const copyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    toast.success("Copied!");
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

      {/* Preview Card */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Preview</h2>
        <Card className="overflow-hidden border border-border">
          <div className="bg-muted/30 p-8 flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 border-2 border-border shadow">
              <AvatarImage src={data.profilePhotoPreview} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {data.firstName?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-foreground mt-4">{data.firstName} {data.lastName}</h3>
            <p className="text-muted-foreground mt-1">{data.headline}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {data.university && (
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {data.university}</span>
              )}
              {data.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {data.location}</span>
              )}
            </div>
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
