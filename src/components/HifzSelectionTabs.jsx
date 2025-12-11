import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookMarkedIcon,
  BookOpen,
  LucideChartBarIncreasing,
} from "lucide-react";
import Surahs from "./Surahs";
import Juz from "./Juz";
import PagesTab from "./PagesTab";

function HifzSelectionTabs() {
  return (
    <div className="flex w-full flex-col gap-6 bg-transparent border-none px-2">
      <Tabs defaultValue="surah">
        <TabsList className={`w-full`}>
          <TabsTrigger value="surah">
            <BookOpen />
            السور
          </TabsTrigger>
          <TabsTrigger value="juz">
            <LucideChartBarIncreasing />
            الأجزاء
          </TabsTrigger>
          <TabsTrigger value="pages">
            <BookMarkedIcon />
            الصفحات
          </TabsTrigger>
        </TabsList>
        <TabsContent value="surah">
          <Surahs />
        </TabsContent>
        <TabsContent value="juz">
          <Juz />
        </TabsContent>
        <TabsContent value="pages">
          <PagesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default HifzSelectionTabs;
