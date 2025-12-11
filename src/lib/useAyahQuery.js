import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function useAyahQuery(params) {
  // params could be { type: 'specific', surahNumber, ayahNumber }
  // OR { type: 'page', pageNumber }

  const queryKey =
    params?.type === "page"
      ? ["ayahs", "page", params.pageNumber]
      : ["ayahs", "specific", params?.surahNumber, params?.ayahNumber];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      let url = "";

      if (params.type === "page") {
        // جلب صفحة كاملة
        url = `https://api.alquran.cloud/v1/page/${params.pageNumber}/ar.alafasy`;
      } else {
        // جلب آية محددة
        url = `https://api.alquran.cloud/v1/ayah/${params.surahNumber}:${params.ayahNumber}/ar.alafasy`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const json = await response.json();

      if (params.type === "page") {
        // إذا كنا نجلب صفحة، نختار آية واحدة عشوائية منها ونرجعها
        const ayahsInPage = json.data.ayahs;
        const randomIdx = Math.floor(Math.random() * ayahsInPage.length);
        return ayahsInPage[randomIdx];
      }

      // إذا كانت آية محددة
      return json.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!params, // لا يعمل إلا إذا وُجدت المدخلات
    onError: () => {
      toast.error("حدث خطأ أثناء جلب الآيات");
    },
  });
}

export default useAyahQuery;
