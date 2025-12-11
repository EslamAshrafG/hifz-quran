import useSurahsQuery from "@/lib/useSurahsQuery";
import FetchLoader from "./ui/FetchLoader";
import { toast } from "sonner";
import { Card } from "./ui/card";
import useAppContext from "@/AppContext";
import StateCheck from "./ui/StateCheck";

function Surahs() {
  const { data, isLoading, isError } = useSurahsQuery();
  const { state } = useAppContext();
  const isOn = state.isSurahMemorizationOn;

  if (isLoading) {
    return <FetchLoader />;
  }
  if (isError) {
    toast("حدث خطأ أثناء جلب السور");
    return;
  }

  return (
    <div className="space-y-2" dir="rtl">
      <StateCheck
        isOn={isOn}
        type="TOGGLE_SURAH_MEMORIZATION_MODE"
        label="تفعيل مراجعة السور المحفوظة"
      />
      {data.map((surah) => (
        <SurahCard key={surah.number} surah={surah} />
      ))}
    </div>
  );
}

function SurahCard({ surah }) {
  const { state, dispatch } = useAppContext();
  const surahsFromState = state.memorizedSurahs.filter(
    (s) => s.number === surah.number
  );
  const isChecked = surahsFromState.length > 0;

  const checkedStyle = isChecked
    ? "bg-gray-100 shadow-sm -translate-x-0.5"
    : "";

  const memorizedSurah = {
    number: surah.number,
    name: surah.name,
    numberOfAyahs: surah.numberOfAyahs,
  };

  const handleChecked = () => {
    dispatch({
      type: "TOGGLE_SURAH_MEMORIZATION",
      payload: memorizedSurah,
    });
  };
  return (
    <Card
      onClick={handleChecked}
      key={surah.number}
      className={`p-4 border-b border-gray-200 hover:bg-gray-100 transition-all hover:shadow-sm cursor-pointer hover:-translate-x-0.5 ${checkedStyle}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="w-fit font-bold text-2xl font-quran">{surah.name}</h3>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={null}
          className="border-black/60 inline cursor-pointer p-4 size-4"
        />
      </div>
    </Card>
  );
}

export default Surahs;
