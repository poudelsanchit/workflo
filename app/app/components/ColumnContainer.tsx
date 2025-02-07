import { Column, Id, Task } from "@/types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { BsPlus } from "react-icons/bs";
import TaskCard from "./TaskCard";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id, newTask: string) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}
export default function ColumnContainer(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState("");
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
            className="text-black text-base"
            onClick={() => {
              setEditMode(true);
            }}
          >
            {!editMode && column.title}
          </div>
          <div className="flex justify-center items-center py-1 text-sm rounded-full text-neutral-400">
            {3}
          </div>
          <div>
            {editMode && (
              <input
                autoFocus
                className=" text-black focus:outline-none text-base border rounded "
                value={column.title}
                onChange={(e) => updateColumn(column.id, e.target.value)}
                onBlur={() => {
                  setEditMode(false);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
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
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>
      {isAddingTask && (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            placeholder="Add new task..."
            className="w-full text-black rounded border border-purple-600 bg-violet-400/20 p-3 text-sm  placeholder-purple-600 focus:outline-0"
            value={newTask}
            onChange={(e) => {
              setNewTask(e.target.value);
            }}
          />
          <div className="flex ml-auto  gap-2">
            <Button
              variant={"outline"}
              className="text-black h-8"
              onClick={() => {
                setIsAddingTask(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="h-8"
              onClick={() => {
                createTask(column.id, newTask);
                setIsAddingTask(false);
                setNewTask("");
              }}
            >
              Create
            </Button>
          </div>
        </div>
      )}

      {!isAddingTask && (
        <button
          onClick={() => {
            setIsAddingTask(true);
          }}
          className="flex justify-center items-center text-sm text-neutral-600 hover:text-neutral-300 transition-all duration-100 mr-auto pl-1 "
        >
          Add Task <BsPlus size={16} />
        </button>
      )}

      {/* <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex justify-center items-center text-sm text-neutral-600 hover:text-neutral-300 transition-all duration-100 mr-auto pl-1 "
      >
        Add Task <BsPlus size={16} />
      </button> */}
    </div>
  );
}
