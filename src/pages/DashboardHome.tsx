import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Award, Plus, ExternalLink, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";
import ProfileCompletenessRing from "@/components/dashboard/ProfileCompletenessRing";

const DashboardHome = () => {
  const { data } = useProfile();

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-8 animate-fade-in-up">
      {/* Welcome + Completeness */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back. Your Lumora is live.
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile, build CVs, and share your portfolio.
          </p>
        </div>
        <ProfileCompletenessRing data={data} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* CVs */}
        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-3 pb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">Your CVs</CardTitle>
              <p className="text-sm text-muted-foreground">0 saved CVs</p>
            </div>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link to="/dashboard/cv">
              <Button size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Create CV
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Website */}
        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-3 pb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">Your Website</CardTitle>
              <p className="text-sm text-muted-foreground">Your public portfolio page</p>
            </div>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link to="/dashboard/website">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> View
              </Button>
            </Link>
            <Button size="sm" variant="ghost" className="gap-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </Button>
          </CardContent>
        </Card>

        {/* Badge Wall */}
        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-3 pb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">Badge Wall</CardTitle>
              <p className="text-sm text-muted-foreground">Showcase your achievements</p>
            </div>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link to="/dashboard/badges">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> View
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
