import Body from "./Body";
import AppSidebar from "./components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

function Layout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "25rem",
        "--sidebar-width-mobile": "22rem",
      }}
    >
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className={`mr-6 mt-6`} />
        <Body />
      </main>
    </SidebarProvider>
  );
}

export default Layout;
