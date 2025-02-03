import { BiTrash } from "react-icons/bi";
import {  Id, Task } from "@/types/types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}
export default function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
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
    setMouseIsOver(false);
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 task relative bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex rounded-xl text-left border-2 border-rose-700  cursor-grab"
      />
    );
  }
  if (editMode)
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex rounded-xl text-left hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  return (
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
      className=" task relative bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex rounded-xl text-left hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className=" absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
        >
          <BiTrash size={25} />
        </button>
      )}
    </div>
  );
}
