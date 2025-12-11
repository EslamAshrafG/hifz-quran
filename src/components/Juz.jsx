import { useState } from "react";
import { Card } from "./ui/card";

import useAppContext from "@/AppContext";
import StateCheck from "./ui/StateCheck";

function Juz() {
  const { state } = useAppContext();
  const isOn = state.isJuzMemorizationOn;
  return (
    <div className="space-y-2">
      <StateCheck
        isOn={isOn}
        type="TOGGLE_JUZ_MEMORIZATION_MODE"
        label="تفعيل مراجعة الاجزاء المحفوظة"
      />
      {Array.from({ length: 30 }, (_, i) => (
        <JuzCard key={i + 1} juzNumber={i + 1} />
      ))}
    </div>
  );
}

function JuzCard({ juzNumber }) {
  const { state, dispatch } = useAppContext();
  const juzsFromState = state.memorizedJuzs.filter((j) => j === juzNumber);
  const [isChecked, setIsChecked] = useState(juzsFromState.length > 0);
  const handleChecked = () => {
    dispatch({ type: "TOGGLE_JUZ_MEMORIZATION", payload: juzNumber });
    setIsChecked(!isChecked);
  };
  const checkedStyle = isChecked
    ? "bg-gray-100 shadow-sm -translate-x-0.5"
    : "";

  return (
    <Card
      onClick={handleChecked}
      className={`p-4 border-b border-gray-200 hover:bg-gray-100 transition-all hover:shadow-sm cursor-pointer hover:-translate-x-0.5 ${checkedStyle}`}
    >
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={null}
          className="border-black/60 inline cursor-pointer p-4 size-4"
        />
        <h3 className="font-bold text-xl"> جزء {juzNumber}</h3>
      </div>
    </Card>
  );
}
export default Juz;
