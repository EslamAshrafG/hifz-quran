import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const api = "https://api.alquran.cloud/v1/surah";

function useSurahsQuery() {
  return useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const response = await fetch(api);
      if (!response.ok) {
        toast("فشل في تحميل أسماء االسور");
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export default useSurahsQuery;
