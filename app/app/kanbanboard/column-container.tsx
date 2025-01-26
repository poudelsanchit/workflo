import { Button } from "@/components/ui/button";
import { Column } from "./types";

interface Props {
  column: Column;
}
export default function ColumnContainer(props: Props) {
  const { column } = props;
  return (
    <div className="border  rounded-md w-[300px] h-[500px] max-h-[500px] flex  flex-col font-semibold ">
      {/* Column task title */}
      <div className="p-2 border-b"> {column.title}</div>
      {/* Column task container */}
      <div className="flex flex-grow"></div>
      {/* Column footer */}
      <Button className="p-2" variant={"darkBorderLess"} >Add task</Button>
    </div>
  );
}
