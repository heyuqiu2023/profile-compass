import { NavLink } from "@/components/NavLink";
import { navItems } from "@/components/dashboard/DashboardSidebar";

export function DashboardBottomNav() {
  // Show first 5 items on mobile bottom nav
  const mobileItems = navItems.slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-14">
        {mobileItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
