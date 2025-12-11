import useAppContext from "@/AppContext";

function PagesTab() {
  const { state, dispatch } = useAppContext();
  const pageRange = state.pageRange;
  const { startPage, endPage, isOn } = pageRange;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "SET_PAGE_RANGE",
      payload: {
        ...pageRange,
        [name]: Number(value),
      },
    });
  };
  return (
    <section className="text-center" dir="rtl">
      <h2 className="text-center my-4 font-cairo w-full block text-xl font-semibold text-gray-800 dark:text-gray-200">
        اختر نطاق الصفحات
      </h2>
      <div dir="rtl">
        <label className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-4">
          <input
            type="checkbox"
            checked={isOn}
            onChange={() =>
              dispatch({
                type: "SET_PAGE_RANGE",
                payload: {
                  ...pageRange,
                  isOn: !isOn,
                },
              })
            }
            className="form-checkbox h-5 w-5 text-primary"
          />
          <span className="font-cairo text-gray-700 dark:text-gray-300 mx-2">
            تفعيل نطاق الصفحات
          </span>
        </label>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="startPage"
            className="font-cairo text-gray-700 dark:text-gray-300"
          >
            صفحة البداية:
          </label>
          <input
            type="number"
            id="startPage"
            name="startPage"
            value={startPage}
            onChange={handleInputChange}
            min="1"
            max={endPage}
            className="w-30 text-center text-xl p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
            placeholder="1"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="endPage" className="font-cairo text-gray-700 ">
            صفحة النهاية:
          </label>
          <input
            type="number"
            id="endPage"
            name="endPage"
            value={endPage}
            min={startPage}
            max="604"
            onChange={handleInputChange}
            className="w-30 text-center text-xl p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
            placeholder="604"
          />
        </div>
      </div>
    </section>
  );
}

export default PagesTab;
