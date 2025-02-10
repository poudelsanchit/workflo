import { Id, Task } from "@/types/types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarRange, Trash } from "lucide-react";
import TaskDialog from "./TaskDialog";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false); // New state for controlling Popover visibility

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const handlePopoverToggle = () => {
    setPopoverOpen((prev) => !prev); // Toggle popover visibility
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 task relative bg-[#e2d9d9] dark:bg-neutral-700/80 text-sm p-2.5 h-20 min-h-max flex flex-col pt-4 pb-2 rounded text-left cursor-grab"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task bg-white relative border-2 border-[#e8e8e8] shadow-sm text-black text-sm p-2.5 h-18 min-h-max flex flex-col pt-4 pb-2 rounded-md text-left cursor-grab"
      >
        <textarea
          autoFocus
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-black focus:outline-none"
          value={task.content}
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
        className="task dark:bg-white dark:text-black bg-black text-white relative  font-semibold  shadow-sm  text-sm p-2.5 h-18 min-h-max flex flex-col pt-4 pb-2 rounded-md text-left cursor-grab"
      >
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-sm pb-1">
          {task.content}
        </p>

        <div
          className=" absolute right-3 bottom-3 cursor-pointer text-red-500"
          onClick={() => {
            deleteTask(task.id);
            setPopoverOpen(false); // Close popover after deletion
          }}
        >
          <Trash size={16} />
        </div>
        <div className="flex gap-1 items-center text-xs text-[#6a6a6a] py-2">
          <CalendarRange size={14} />
          Jan 8, 2025
        </div>
      </div>
      <TaskDialog />
    </>
  );
}
