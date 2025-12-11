import useAppContext from "@/AppContext";
import { Info } from "lucide-react";

const StateCheck = ({ isOn, type, label }) => {
  const { dispatch } = useAppContext();
  const handleChange = () => {
    dispatch({
      type: type,
    });
  };
  return (
    <div dir="rtl" className="my-3">
      <label className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-4">
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-primary"
        />
        <span className="font-cairo flex items-center gap-2 text-sm text-gray-400 dark:text-gray-300 mx-2">
          <Info className="w-4 h-4" /> {label}
        </span>
      </label>
    </div>
  );
};

export default StateCheck;
