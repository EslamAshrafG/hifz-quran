import React from "react";
import { Button } from "./button";
import { Eye, EyeOff, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";

const AyahControls = ({
  showFull,
  setShowFull,
  onPrevious,
  onNext,
  onRandom,
  data,
}) => {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={() => setShowFull(!showFull)}
          variant="secondary"
          size="lg"
          className="min-w-[140px] shadow-sm hover:bg-secondary/80 transition-all"
        >
          {showFull ? (
            <EyeOff className="w-5 h-5 mr-2" />
          ) : (
            <Eye className="w-5 h-5 mr-2" />
          )}
          {showFull ? "إخفاء" : "إظهار"}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={onPrevious}
            disabled={!data || data.numberInSurah <= 1}
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <Button
            onClick={onNext}
            disabled={!data || data.numberInSurah >= data.surah.numberOfAyahs}
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        <Button
          onClick={onRandom}
          className="min-w-[140px] shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          size="lg"
        >
          <Shuffle className="w-5 h-5 mr-2" />
          عشوائي
        </Button>
      </div>
    </div>
  );
};

export default AyahControls;
