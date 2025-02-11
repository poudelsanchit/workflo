import { Id, Task } from "@/types/types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarRange, Trash } from "lucide-react";
import TaskDialog from "./TaskDialog";

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
    uniqueId:string
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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 task relative bg-[#e2d9d9] dark:bg-neutral-700/80 text-sm p-2.5 h-20 min-h-max flex flex-col pt-4 pb-2 rounded text-left cursor-grab"
      />
    );
  }

  // if (editMode) {
  //   return (
  //     <div
  //       ref={setNodeRef}
  //       style={style}
  //       {...attributes}
  //       {...listeners}
  //       className="task bg-white relative border-2 border-[#e8e8e8] shadow-sm text-black text-sm p-2.5 h-18 min-h-max flex flex-col pt-4 pb-2 rounded-md text-left cursor-grab"
  //     >
  //       <textarea
  //         autoFocus
  //         className="h-[90%] w-full resize-none border-none rounded bg-transparent text-black focus:outline-none"
  //         value={task.content}
  //         placeholder="Task content here"
  //         onBlur={toggleEditMode}
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter" && !e.shiftKey) toggleEditMode();
  //         }}
  //         onChange={(e) => updateTask(task.id, e.target.value)}
  //       />
  //     </div>
  //   );
  // }

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
          className=" absolute right-3 bottom-3 cursor-pointer text-red-500"
          onClick={() => {
            deleteTask(task.id);
          }}
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
