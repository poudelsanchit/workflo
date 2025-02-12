import { Column, Id, Task } from "@/types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "../tasks/TaskCard";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTaskDialog from "../tasks/AddTaskDialog";

interface Props {
  column: Column;
  pageId: string;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (newTask: Task) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (
    id: Id,
    content: string,
    columnId: string,
    label: string,
    uniqueId: string
  ) => void;
}
export default function ColumnContainer(props: Props) {
  const {
    column,
    pageId,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
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
    disabled: editMode,
  });
  const [newTitle, setNewTitle] = useState(column.title); // Store the column title in state\

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" w-[300px] h-[500px] max-h-[500px] rounded flex flex-col opacity-40 border-2  "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" w-[300px] h-[500px] max-h-[500px]  flex flex-col gap-2    p-3 pt-0   "
    >
      {/* Column Title */}
      <div
        {...attributes}
        {...listeners}
        className="  text-sm   cursor-grab flex items-center justify-between border-b-[3px]"
        style={{ borderColor: column.color }}
      >
        <div className="flex items-center  gap-2 w-full  pb-1 ">
          <div
            className="text-black dark:text-white text-base font-semibold"
            onClick={() => {
              setEditMode(true);
            }}
          >
            {!editMode && column.title}
          </div>
          <div className="flex justify-center items-center py-1 text-sm rounded-full text-neutral-400">
            {3}
          </div>
          <div className="w-full ">
            {editMode && (
              <input
                autoFocus
                className="text-black dark:text-white font-semibold focus:outline-none text-base border rounded w-full border-neutral-400/20 pl-2"
                value={newTitle} // Bind to newTitle state
                onChange={(e) => {
                  setNewTitle(e.target.value); // Update state on input change
                }}
                onBlur={() => {
                  setEditMode(false); // Close edit mode on blur
                  updateColumn(column.id, newTitle); // Update column title on blur
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateColumn(column.id, newTitle); // Update column title on Enter key
                    setEditMode(false); // Exit edit mode
                  }
                }}
              />
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer text-neutral-500">
              <MoreHorizontal size={18} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <div
                onClick={() => {
                  deleteColumn(column.id);
                }}
              >
                Delete
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditMode(true)}>
              Rename
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Column task conrtainer */}
      <div className="flex flex-col gap-2  pt-2 ">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                pageId={pageId}
                columnId={column.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>

      <AddTaskDialog column={column} createTask={createTask} pageId={pageId} />
    </div>
  );
}
