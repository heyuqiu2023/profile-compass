import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
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
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<div className="p-8 text-muted-foreground">Profile editor coming soon…</div>} />
            <Route path="cv" element={<div className="p-8 text-muted-foreground">CV Builder coming soon…</div>} />
            <Route path="website" element={<div className="p-8 text-muted-foreground">Website preview coming soon…</div>} />
            <Route path="badges" element={<div className="p-8 text-muted-foreground">Badge Wall coming soon…</div>} />
            <Route path="assistant" element={<div className="p-8 text-muted-foreground">AI Assistant coming soon…</div>} />
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
