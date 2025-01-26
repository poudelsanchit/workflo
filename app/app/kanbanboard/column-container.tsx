import { Button } from "@/components/ui/button";
import { Column, Id } from "./types";
import { Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id:Id,title: string)=>void;
}
export default function ColumnContainer(props: Props) {
  const { column, deleteColumn,updateColumn } = props;
  const [editMode, setEditMode] = useState(false);
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
      className=" bg-[#f8f6f5]   rounded-2xl w-[350px] h-[500px] max-h-[500px] flex  flex-col font-semibold "
      ref={setNodeRef}
      style={style}
    ></div>
    );
  }
  return (
    <div
      className=" bg-[#f8f6f5]  p-4  rounded-2xl w-[350px] h-[500px] max-h-[500px] flex  flex-col font-semibold "
      ref={setNodeRef}
      style={style}
    >
      {/* Column task title */}
      <div
        className="  flex justify-between "
        {...attributes}
        {...listeners}
      >
        <div
          onClick={() => {
            setEditMode(true);
          }}
          className="flex gap-2 text-sm font-semibold"
        >
          {!editMode && column.title}
          {editMode && (
            <input
            className=" bg-[#eae6e6] focus:border-none focus:outline-none"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
          <div className="text-gray-500/80">10</div>
           
        </div>
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
      <div className="flex flex-grow"></div>
      {/* Column footer */}
      <Button className="p-2" variant={"outlineBorderLess"}>
        Add task
      </Button>
    </div>
  );
}
