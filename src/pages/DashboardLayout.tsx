import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { FloatingAIPanel } from "@/components/dashboard/FloatingAIPanel";
import { ProfileProvider } from "@/contexts/ProfileContext";
import LumoraLogo from "@/components/LumoraLogo";

const DashboardLayout = () => {
  return (
    <ProfileProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <div className="hidden md:block">
            <DashboardSidebar />
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40 px-4">
              <SidebarTrigger className="hidden md:flex" />
              <LumoraLogo height={22} className="md:hidden" />
            </header>

            <main className="flex-1 pb-16 md:pb-0">
              <Outlet />
            </main>
          </div>

          <DashboardBottomNav />
          <FloatingAIPanel />
        </div>
      </SidebarProvider>
    </ProfileProvider>
  );
};

export default DashboardLayout;
