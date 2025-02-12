import { Button } from "@/components/ui/button";
import { Column, Id } from "@/types/types";
import { Calendar, Flag, Tag, User } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTasksProps {
  createTask: (columnId: Id, newTask: string) => void;
  column: Column;
  setIsAddingTask: React.Dispatch<React.SetStateAction<true | false>>;
}
export default function AddTask({
  column,
  createTask,
  setIsAddingTask,
}: AddTasksProps) {
  const [newTask, setNewTask] = useState("");

  return (
    <div className="flex flex-col gap-2">
    <textarea
      autoFocus
      placeholder="Add new task..."
      className="w-full text-black dark:text-white rounded border border-neutral-950 dark:border-[#252528] bg-violet-400/20 dark:bg-neutral-950 p-3 text-sm  placeholder-neutral-900 placeholder:font-semibold dark:placeholder:text-white focus:outline-0"
      value={newTask}
      onChange={(e) => {
        setNewTask(e.target.value);
      }}
    />
    <div className="flex ml-auto  gap-2">
      <Button
        variant={"outline"}
        className="text-black h-8 dark:text-white dark:hover:bg-neutral-950/80 rounded-sm"
        onClick={() => {
          setIsAddingTask(false);
        }}
      >
        Cancel
      </Button>
      <Button
        className="h-8 rounded-sm"
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
  );
}
