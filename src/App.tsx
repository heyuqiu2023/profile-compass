import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ProfileEditor from "./pages/ProfileEditor";
import PublicProfile from "./pages/PublicProfile";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AIAssistant from "./pages/AIAssistant";
import CVBuilder from "./pages/CVBuilder";
import BadgeWall from "./pages/BadgeWall";
import WebsitePreview from "./pages/WebsitePreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/demo" element={<PublicProfile />} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="cv" element={<CVBuilder />} />
            <Route path="website" element={<WebsitePreview />} />
            <Route path="badges" element={<BadgeWall />} />
            <Route path="assistant" element={<AIAssistant />} />
            <Route path="settings" element={<div className="p-8 text-muted-foreground">Settings coming soon…</div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
