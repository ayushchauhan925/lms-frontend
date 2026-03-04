import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  CreditCard,
  Star,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Compass,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  {
    label: "STUDENT PANEL",
    items: [
      { icon: LayoutDashboard, title: "Dashboard",       href: "/student/dashboard" },
      { icon: BookOpen,        title: "My Courses",      href: "/student/courses" },
      { icon: Compass,         title: "Explore Courses", href: "/student/explore" },
      { icon: Award,           title: "Certificates",    href: "/student/certificates" },
      { icon: CreditCard,      title: "Payments",        href: "/student/payments" },
      { icon: Star,            title: "Reviews",         href: "/student/reviews" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { icon: User,     title: "Profile",  href: "/student/profile" },
      { icon: Settings, title: "Settings", href: "/student/settings" },
    ],
  },
];

export function StudentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header – Logo */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <span className="font-bold text-base text-sidebar-foreground">
                  Learnify
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content – Nav Groups */}
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-widest text-sidebar-foreground/50 px-3 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(({ icon: Icon, title, href }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild tooltip={title}>
                    <NavLink
                      to={href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <Icon size={17} />
                      <span>{title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer – User */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          {/* User info */}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.name || "Student"}
                </span>
                <span className="text-xs text-sidebar-foreground/50 truncate">
                  {user?.email || "student@learnify.com"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}