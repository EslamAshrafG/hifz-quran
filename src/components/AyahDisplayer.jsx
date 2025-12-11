import useAppContext from "@/AppContext";
import randomAyah from "@/lib/randomAyah";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import useAyahQuery from "@/lib/useAyahQuery";
import FetchLoader from "./ui/FetchLoader";
import { toast } from "sonner";
import AyahControls from "./ui/AyahControls";

function AyahDisplayer() {
  const { state } = useAppContext();

  // 1. الحالة المبدئية
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

  // 2. استخدام الهوك
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

  if (isLoading) return <FetchLoader />;
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

  if (!queryParams) {
    return (
      <div className="text-center p-10 text-muted-foreground border-2 border-dashed rounded-xl">
        يرجى اختيار الأجزاء أو السور المحفوظة من القائمة الجانبية.
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-2xl mx-auto space-y-8">
      <Card className="relative overflow-hidden border-none shadow-2xl bg-[#fdfcf5] dark:bg-card">
        <div className="absolute inset-2 border-4 border-double border-primary/20 rounded-xl pointer-events-none z-10" />

        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/30 rounded-tl-3xl m-4 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/30 rounded-br-3xl m-4 pointer-events-none" />

        <CardContent className="relative flex flex-col items-center justify-center p-10 min-h-[400px] text-center z-20">
          {/* النص القرآني */}
          <div className="flex w-full">
            <p
              className="text-2xl md:text-4xl leading-[2.3] font-bold font-quran text-justify justify-start"
              dir="rtl"
            >
              {data && (showFull ? data.text : getPartialVerse(data.text))}
            </p>
          </div>

          {/* فاصل جمالي */}
          <div className="w-1/3 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent my-6" />

          {/* معلومات الآية - تصميم كبسولة */}
          {data && (
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 shadow-sm">
              <span className="font-quran">{data.surah.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span>الآية {data.numberInSurah}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* أزرار التحكم */}
      <AyahControls
        showFull={showFull}
        setShowFull={setShowFull}
        onPrevious={onPrevious}
        onNext={onNext}
        onRandom={onRandom}
      />
    </div>
  );
}

export default AyahDisplayer;
