import { Button } from "@/components/ui/button";
import { Column, Id } from "./types";
import { Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}
export default function ColumnContainer(props: Props) {
  const { column, deleteColumn } = props;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        className="border  rounded-md w-[300px] h-[500px] max-h-[500px] flex  flex-col font-semibold "
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }
  return (
    <div
      className="border  rounded-md w-[300px] h-[500px] max-h-[500px] flex  flex-col font-semibold "
      ref={setNodeRef}
      style={style}
    >
      {/* Column task title */}
      <div
        className="p-2 border-b flex justify-between bg-[#eae6e6]"
        {...attributes}
        {...listeners}
      >
        <div> {column.title}</div>
        <div
          className=" p-1 rounded cursor-pointer hover:scale-[1.1] transition-all duration-500 "
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <Trash color="black" size={20} />
        </div>
      </div>
      {/* Column task container */}
      <div className="flex flex-grow bg-white"></div>
      {/* Column footer */}
      <Button className="p-2" variant={"darkBorderLess"}>
        Add task
      </Button>
    </div>
  );
}
