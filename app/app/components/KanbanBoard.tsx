"use client";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "@/types/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function KanbanBoard({
  column,
  pageId,
}: {
  column: Column[];
  pageId: string;
}) {
  const [isAddingColumn, setisAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [columns, setColumns] = useState<Column[]>(column);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  //Add new column to the column model
  const createNewColumn = async () => {
    try {
      const columnToAdd: Column = {
        id: columns.length,
        title: newColumnTitle,
        color: "#8338ec",
      };
      const response = await axios.post(
        `/api/private/${pageId}/column`,
        columnToAdd
      );
      const newColumn = response.data.newColumn;
      setColumns([...columns, newColumn]);
      setisAddingColumn(false);
      setNewColumnTitle("");

      console.log(response.data);
    } catch (error) {
      toast("Error creating a new column");
    }
  };

  //Update column title
  const updateColumn = async (id: Id, title: string): Promise<void> => {
    try {
      const response = await axios.patch(`/api/private/${pageId}/column`, {
        title: title,
        columnId: id,
      });
      // Check if the response is successful
      if (response.status === 200) {
        // Update local state with the new column title
        const newColumns = columns.map((col) => {
          if (col.id !== id) return col; // Keep other columns unchanged
          return { ...col, title }; // Update the title of the column that matches id
        });

        setColumns(newColumns); // Update the columns state with the new data
      }
    } catch (error) {
      toast.error("Error updating column title.");
    }
  };

  return (
    <div className="flex h-full w-full gap-3  relative">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
      >
        <div className="flex gap-2 ">
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                column={column}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === column.id)}
              />
            ))}
          </SortableContext>
          {isAddingColumn && (
            <div className="flex flex-col gap-2">
              <textarea
                autoFocus
                placeholder="Add new Column..."
                className="w-full text-black dark:text-white rounded border border-black bg-black/10 p-3 text-sm  placeholder-black focus:outline-0"
                value={newColumnTitle}
                onChange={(e) => {
                  setNewColumnTitle(e.target.value);
                }}
              />
              <div className="flex ml-auto  gap-2">
                <Button
                  variant={"outline"}
                  className="text-black h-8"
                  onClick={() => {
                    setisAddingColumn(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="h-8 bg-black hover:bg-black/80"
                  onClick={createNewColumn}
                >
                  Create
                </Button>
              </div>
            </div>
          )}
        </div>
        {!isAddingColumn && (
          <Button
            onClick={() => {
              setisAddingColumn(true);
            }}
            variant={"outlineBorderLess"}
            className="  flex justify-center items-center gap-1 text-sm  text-neutral-50 cursor-pointer mb-auto 
             min-w-max  border border-[#252528] bg-black dark:bg-neutral-950 rounded-md dark:text-white
              shadow-md dark:hover:bg-black/80  px-10 "
          >
            Add a Column <Plus size={18} />
          </Button>
        )}

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function generateId() {
    return Math.floor(Math.random() * 10000);
  }
  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function createTask(columnId: Id, task: string) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: task,
    };
    setTasks([...tasks, newTask]);
  }
  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }
  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;
    //Im dropping a task over another task

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    //Im dropping a task over another column
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}
