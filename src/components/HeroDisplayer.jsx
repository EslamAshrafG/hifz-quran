import useAppContext from "@/AppContext";
import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";

function HeroDisplayer({ setTestStarted }) {
  const { state, _ } = useAppContext();
  const validStart =
    (state.isSurahMemorizationOn && state.memorizedSurahs.length > 0) ||
    (state.isJuzMemorizationOn && state.memorizedJuzs.length > 0) ||
    state.pageRange.isOn;
  return (
    <div className="text-center space-y-8 max-w-2xl">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-4">
          مراجعة القرآن الكريم
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          راجع حفظك للقرآن الكريم من خلال اختيار السور أو الأجزاء او الصفحات
          التي تريد المراجعة عليها
        </p>
      </div>
      {!validStart && (
        <div className=" bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
          يرجى اختيار سور أو أجزاء أو نطاق صفحات للمراجعة قبل البدأ
        </div>
      )}
      {/* <div className="flex items-center justify-center">
        <VoiceToText />
      </div> */}
      <Button
        onClick={() => setTestStarted(true)}
        disabled={!validStart}
        size="lg"
        className="text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all font-semibold"
      >
        ابدأ الاختبار
      </Button>
    </div>
  );
}

export default HeroDisplayer;
