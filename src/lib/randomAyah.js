function randomAyah(
  isJuzMemorizationOn,
  isSurahMemorizationOn,
  memorizedSurahs,
  memorizedJuz,
  pageRange
) {
  const hasSurahs = isSurahMemorizationOn && memorizedSurahs?.length > 0;
  const hasJuz = isJuzMemorizationOn && memorizedJuz?.length > 0;
  const hasPageRange = pageRange?.isOn;

  // 1. Determine available modes
  const availableModes = [
    { type: "surah", available: hasSurahs },
    { type: "juz", available: hasJuz },
    { type: "pages", available: hasPageRange },
  ];

  // 2. Filter out the ones that are false
  const validModes = availableModes.filter((m) => m.available);

  if (validModes.length === 0) {
    return null;
  }

  // 3. Pick a random one from the valid list
  const mode = validModes[Math.floor(Math.random() * validModes.length)].type;

  if (mode === "surah") {
    const randomSurahIndex = Math.floor(Math.random() * memorizedSurahs.length);
    const surah = memorizedSurahs[randomSurahIndex];
    const ayahCount = surah.numberOfAyahs;
    const randomAyahNumber = Math.floor(Math.random() * ayahCount) + 1;

    return {
      type: "specific", // نوع محدد
      surahName: surah.name,
      surahNumber: surah.number,
      ayahNumber: randomAyahNumber,
      numberOfAyahs: ayahCount,
    };
  }

  if (mode === "pages") {
    const { startPage, endPage } = pageRange;
    const randomPage =
      startPage !== endPage
        ? Math.floor(Math.random() * (endPage - startPage + 1)) + startPage
        : startPage;

    return {
      type: "page", // نوع صفحة
      pageNumber: randomPage,
    };
  }

  if (mode === "juz") {
    const randomJuzIndex = Math.floor(Math.random() * memorizedJuz.length);
    const juzNumber = memorizedJuz[randomJuzIndex];

    // حساب الصفحة العشوائية داخل الجزء (تقريبي لمصحف المدينة)
    // الجزء 1 يبدأ صفحة 1، الجزء 2 يبدأ 22.. كل جزء حوالي 20 صفحة
    // المعادلة: بداية الجزء = (الجزء - 1) * 20 + 2
    const startPage = (juzNumber - 1) * 20 + 2;
    // نختار صفحة عشوائية من الـ 18 صفحة الأولى في الجزء لضمان عدم الخروج
    const randomPage = Math.floor(Math.random() * 18) + startPage;

    return {
      type: "page", // نوع صفحة
      juzNumber: juzNumber,
      pageNumber: randomPage,
    };
  }
}

export default randomAyah;
