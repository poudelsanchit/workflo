import { MoreHorizontal } from "lucide-react";
import { Id, Task } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useState, useRef, useEffect } from "react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function TaskContainer({ task, deleteTask, updateTask }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [tempContent, setTempContent] = useState(task.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically adjust height and focus cursor when edit mode is enabled
  useEffect(() => {
    if (editMode && textareaRef.current) {
      const length = tempContent.length;
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height dynamically
      textareaRef.current.setSelectionRange(length, length); // Move cursor to the end
    }
  }, [editMode, tempContent]);

  const handleBlur = () => {
    updateTask(task.id, tempContent);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height dynamically
    }
  };

  return (
    <div
      className="flex flex-col gap-3 bg-white text-sm px-4 pt-4 pb-3 rounded-xl shadow-sm cursor-pointer select-none w-full"
      key={task.id}
    >
      <div className="flex justify-between gap-2">
        <div className="w-full" onClick={() => setEditMode(true)}>
          {!editMode && (
            <div className="break-words whitespace-pre-wrap ">
              {task.content}
            </div>
          )}
          {editMode && (
            <textarea
              ref={textareaRef}
              className="rounded focus:border-none focus:outline-none resize-none text-sm w-full  pb-0"
              value={tempContent}
              onChange={handleChange}
              autoFocus
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleBlur();
                }
              }}
            />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal
              strokeWidth={2}
              size={18}
              className="text-gray-600/90 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-xs text-gray-600 h-4/12 border-t-gray-400/70">
        {task.deadline.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
