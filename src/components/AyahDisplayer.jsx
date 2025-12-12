import useAppContext from "@/AppContext";
import randomAyah from "@/lib/randomAyah";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import useAyahQuery from "@/lib/useAyahQuery";
import FetchLoader from "./ui/FetchLoader";
import { toast } from "sonner";
import AyahControls from "./ui/AyahControls";
import QuranRecitation from "./ui/QuranRecitation";

function AyahDisplayer() {
  const { state } = useAppContext();

  const [queryParams, setQueryParams] = useState(() =>
    randomAyah(
      state?.isJuzMemorizationOn,
      state?.isSurahMemorizationOn,
      state?.memorizedSurahs,
      state?.memorizedJuzs,
      state?.pageRange
    )
  );

  const [showFull, setShowFull] = useState(false);
  const { data, isLoading, isError, refetch } = useAyahQuery(queryParams);

  const getPartialVerse = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    const oneThird = Math.ceil(words.length / 3);
    return words.slice(0, oneThird).join(" ") + " ...";
  };

  const onRandom = () => {
    const newRand = randomAyah(
      state?.isJuzMemorizationOn,
      state?.isSurahMemorizationOn,
      state?.memorizedSurahs,
      state?.memorizedJuzs,
      state?.pageRange
    );
    if (!newRand) {
      toast.error("يرجى اختيار سور أو أجزاء للحفظ أولاً");
      return;
    }
    setQueryParams(newRand);
    setShowFull(false);
  };

  const onNext = () => {
    if (data) {
      setQueryParams({
        type: "specific",
        surahNumber: data.surah.number,
        ayahNumber: data.numberInSurah + 1,
      });
      setShowFull(false);
    }
  };

  const onPrevious = () => {
    if (data && data.numberInSurah > 1) {
      setQueryParams({
        type: "specific",
        surahNumber: data.surah.number,
        ayahNumber: data.numberInSurah - 1,
      });
      setShowFull(false);
    }
  };

  // 1. التحقق من وجود الإعدادات (يبقى كما هو)
  if (!queryParams) {
    return (
      <div className="text-center p-10 text-muted-foreground border-2 border-dashed rounded-xl">
        يرجى اختيار الأجزاء أو السور المحفوظة من القائمة الجانبية.
      </div>
    );
  }

  // 2. التحقق من الخطأ (يبقى كما هو)
  if (isError) {
    return (
      <div className="text-center space-y-4 py-10">
        <p className="text-red-500 font-medium">حدث خطأ في الاتصال</p>
        <Button onClick={() => refetch()} variant="outline">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  // ملحوظة: شلنا الـ if (isLoading) return ... من هنا
  // عشان الصفحة تفضل مبنية ومكون التسجيل ميمشيش

  return (
    <div className="w-full md:max-w-2xl mx-auto space-y-8">
      <Card className="relative overflow-hidden border-none shadow-2xl bg-[#fdfcf5] dark:bg-card">
        <div className="absolute inset-2 border-4 border-double border-primary/20 rounded-xl pointer-events-none z-10" />

        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/30 rounded-tl-3xl m-4 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/30 rounded-br-3xl m-4 pointer-events-none" />

        <CardContent className="relative flex flex-col items-center justify-center p-6 md:p-10 text-center z-20">
          {/* منطقة النص القرآني (هنا بنتحكم في اللودينج) */}
          <div className="min-h-[250px] w-full flex flex-col items-center justify-center transition-all duration-300">
            {isLoading ? (
              // اللودر يظهر هنا فقط مكان النص
              <div className="py-10">
                <FetchLoader />
              </div>
            ) : data ? (
              <>
                {/* النص */}
                <div className="flex w-full mb-6">
                  <p
                    className="text-2xl md:text-4xl leading-[2.3] font-bold font-quran text-justify justify-start w-full animate-in fade-in slide-in-from-bottom-2 duration-500"
                    dir="rtl"
                  >
                    {showFull ? data.text : getPartialVerse(data.text)}
                  </p>
                </div>

                {/* معلومات الآية */}
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 shadow-sm mb-4 animate-in zoom-in duration-300">
                  <span className="font-quran">{data.surah.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span>الآية {data.numberInSurah}</span>
                </div>
              </>
            ) : null}
          </div>

          {/* الفاصل */}
          <div className="w-1/2 h-px bg-border my-6" />

          {/* مكون التسميع الصوتي */}
          {/* هذا المكون الآن خارج شرط الـ Loading وبالتالي لن يتم إعادة بنائه أبداً */}
          <QuranRecitation surah={data?.surah?.name} />
        </CardContent>
      </Card>

      {/* أزرار التحكم */}
      <AyahControls
        showFull={showFull}
        setShowFull={setShowFull}
        onPrevious={onPrevious}
        onNext={onNext}
        onRandom={onRandom}
        data={data}
        disabled={isLoading} // تعطيل الأزرار أثناء التحميل لمنع التداخل
      />
    </div>
  );
}

export default AyahDisplayer;
