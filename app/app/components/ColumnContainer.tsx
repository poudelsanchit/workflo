import { BiTrash } from "react-icons/bi";
import { Column, Id, Task } from "@/types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { BsPlus } from "react-icons/bs";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
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
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded flex flex-col opacity-40 border-2 border-rose-500"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" w-[300px] h-[500px] max-h-[500px] rounded flex flex-col"
    >
      {/* Column Title */}
      <div
        onClick={() => {
          setEditMode(true);
        }}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor  text-sm   cursor-grab flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-columnBackgroundColor py-1 text-sm rounded-full text-neutral-400">
            0
          </div>
          <div className="text-purple-600"> {!editMode && column.title}</div>
          <div>
            {editMode && (
              <input
                className="bg-black focus:border-rose-500 border rounded outline px-2"
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
          </div>
        </div>
        <button className="hidden"
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <BiTrash />
        </button>
      </div>
      {/* Column task conrtainer */}
      <div className="flex flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
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
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex justify-center items-center text-xs text-gray-500 hover:text-white transition-all duration-100 mr-auto pl-3"
      >
         Add Task <BsPlus  size={16}/>
      </button>
    </div>
  );
}
