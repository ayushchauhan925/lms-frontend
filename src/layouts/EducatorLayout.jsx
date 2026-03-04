import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { EducatorSidebar } from "../components/educator/EducatorSidebar";
import EducatorNavbar from "../components/educator/EducatorNavbar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

export default function EducatorLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <EducatorSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <EducatorNavbar trigger={<SidebarTrigger className="-ml-1" />} />
          <main className="flex-1 bg-slate-50 p-6">
            <Outlet />
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}