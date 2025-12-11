import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import HifzSelectionTabs from "./HifzSelectionTabs";
import { BookOpen, Trash2 } from "lucide-react"; // أضفت أيقونة Bookmark للتزيين
import { Button } from "./ui/button";
import useAppContext from "@/AppContext";
import { cn } from "@/lib/utils";

function AppSidebar() {
  const { state, dispatch } = useAppContext();

  const isSelected =
    state.memorizedSurahs.length > 0 || state.memorizedJuzs.length > 0;

  const onClear = () => dispatch({ type: "CLEAR_MEMORIZATION" });

  return (
    <Sidebar side="right" variant="sidebar" className="font-cairo border ">
      <div className="flex flex-col h-full w-full bg-card overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/30 blur-[50px] rounded-full pointer-events-none" />

        <SidebarHeader className="relative z-10 p-6 pb-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary transition-transform hover:scale-105 duration-300 shadow-sm border border-primary/20">
                  <BookOpen className="w-6 h-6" />
                  {/* نقطة تزيينية باللون البرتقالي (Sidebar Primary) */}
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-sidebar-primary rounded-full animate-pulse" />
                </div>

                <div className="flex flex-col">
                  <span className="font-bold text-xl text-card-foreground tracking-wide">
                    الحفظ
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    لوحة التحكم
                  </span>
                </div>
              </div>

              {/* زر المسح */}
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  isSelected
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 pointer-events-none"
                )}
              >
                <Button
                  onClick={onClear}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors"
                  title="مسح التحديد"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* فاصل جمالي */}
            <div className="h-0.5 w-full bg-linear-to-l from-border via-border/50 to-transparent mt-2" />
          </div>
        </SidebarHeader>

        <SidebarContent className="pb-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
          <SidebarGroup>
            <SidebarGroupContent>
              <HifzSelectionTabs />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* تذييل بلون متدرج لإخفاء نهاية القائمة بنعومة */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card to-transparent pointer-events-none" />
      </div>
    </Sidebar>
  );
}

export default AppSidebar;
