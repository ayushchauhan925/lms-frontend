import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "../components/student/StudentSidebar";
import StudentNavbar from "../components/student/StudentNavbar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        {/* Sidebar */}
        <StudentSidebar />

        {/* Main area */}
        <SidebarInset className="flex flex-col flex-1 min-w-0">

          {/* Navbar — pass SidebarTrigger inside via prop or just use it here */}
          <StudentNavbar trigger={<SidebarTrigger className="-ml-1" />} />

          {/* Page content */}
          <main className="flex-1 bg-slate-50 p-6">
            <Outlet />
          </main>

          <Footer />
        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}