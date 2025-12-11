import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

function FetchLoader() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner className={"size-10"} />
        </EmptyMedia>
        <EmptyTitle>جاري تحميل البيانات من الخادم</EmptyTitle>
        <EmptyDescription>الرجاء الانتظار بضع لحظات...</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
export default FetchLoader;
