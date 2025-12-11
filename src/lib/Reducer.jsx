/* eslint-disable no-case-declarations */
const initialState = {
  isSurahMemorizationOn: false,
  isJuzMemorizationOn: false,
  memorizedSurahs: [],
  memorizedJuzs: [],
  pageRange: {
    isOn: false,
    startPage: 2,
    endPage: 3,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_SURAH_MEMORIZATION":
      const surahNumber = action.payload.number;
      const isMemorized = state.memorizedSurahs.some(
        (surah) => surah.number === surahNumber
      );
      return {
        ...state,
        memorizedSurahs: isMemorized
          ? state.memorizedSurahs.filter(
              (surah) => surah.number !== surahNumber
            )
          : [...state.memorizedSurahs, action.payload],
      };
    case "TOGGLE_JUZ_MEMORIZATION":
      const juzNumber = action.payload;
      const isJuzMemorized = state.memorizedJuzs.includes(juzNumber);
      console.log(state);
      return {
        ...state,
        memorizedJuzs: isJuzMemorized
          ? state.memorizedJuzs.filter((juz) => juz !== juzNumber)
          : [...state.memorizedJuzs, juzNumber],
      };
    case "SET_PAGE_RANGE":
      return {
        ...state,
        pageRange: action.payload,
      };
    case "TOGGLE_SURAH_MEMORIZATION_MODE":
      return {
        ...state,
        isSurahMemorizationOn: !state.isSurahMemorizationOn, // Toggle target
        isJuzMemorizationOn: false, // Turn off others
        pageRange: {
          ...state.pageRange,
          isOn: false, // Turn off others
        },
      };

    case "TOGGLE_JUZ_MEMORIZATION_MODE":
      return {
        ...state,
        isJuzMemorizationOn: !state.isJuzMemorizationOn, // Toggle target
        isSurahMemorizationOn: false, // Turn off others
        pageRange: {
          ...state.pageRange,
          isOn: false, // Turn off others
        },
      };

    case "TOGGLE_PAGE_RANGE_MODE":
      return {
        ...state,
        pageRange: {
          ...state.pageRange,
          isOn: !state.pageRange.isOn, // Toggle target
        },
        isSurahMemorizationOn: false, // Turn off others
        isJuzMemorizationOn: false, // Turn off others
      };

    case "CLEAR_MEMORIZATION":
      return {
        ...state,
        memorizedSurahs: [],
        memorizedJuzs: [],
        pageRange: {},
      };

    default:
      return state;
  }
}

export { initialState, reducer };
