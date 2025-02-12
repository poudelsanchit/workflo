import { Id, Task } from "@/types/types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarRange, Trash } from "lucide-react";
import TaskDialog from "./TaskDialog";
import { toast } from "sonner";
import axios from "axios";

interface Props {
  task: Task;
  pageId: string;
  columnId: any;
  deleteTask: (id: Id) => void;
  updateTask: (
    id: Id,
    content: string,
    columnId: string,
    label: string,
    uniqueId: string
  ) => void;
}

export default function TaskCard({
  task,
  deleteTask,
  updateTask,
  pageId,
  columnId,
}: Props) {
  const [editMode, setEditMode] = useState(false);

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
  };
  const handleDeleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from reaching the parent div
    try {
      const response = await axios.delete(
        `/api/private/${pageId}/column/${columnId}/task`,
        {
          data: { taskId: task.id }, // ✅ Include columnId inside data
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        deleteTask(task.id);
      }
    } catch (error) {
      console.log(error);
      toast("Error deleting the task");
    }
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

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        className="task dark:bg-neutral-950 dark:text-white bg-black text-white relative  font-semibold  shadow-sm  text-sm p-2.5 h-18 min-h-max flex flex-col pt-4 pb-2 rounded-md text-left cursor-grab"
      >
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-sm pb-1">
          {task.content}
        </p>

        <div
          className=" absolute right-2 bottom-2 cursor-pointer text-red-500 h-7 w-7  flex justify-end items-end pr-1 pb-1"
          onClick={handleDeleteTask}
        >
          <Trash size={16} />
        </div>
        <div className="flex gap-4 items-center text-xs text-[#6a6a6a] py-2">
          <div className="flex gap-1">
            <CalendarRange size={14} />
            Jan 8, 2025
          </div>
        </div>
        <div className="flex  items-center gap-3  p-1">
          <div className=" bg-purple-500 text-xs w-max rounded-full px-2 text-black">
            {task.label}
          </div>
          <div className="text-xs text-[#6a6a6a]">{`#${task.uniqueId}`}</div>
        </div>
      </div>
      <TaskDialog
        task={task}
        content={task.content}
        columnId={columnId}
        pageId={pageId}
        taskId={task.id}
        editMode={editMode}
        onChange={setEditMode}
        toggleEditMode={toggleEditMode}
        updateTask={updateTask}
      />
    </>
  );
}
