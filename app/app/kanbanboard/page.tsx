"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Column, Id } from "./types";
import { useMemo, useState } from "react";
import ColumnContainer from "./column-container";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
export default function KanbanBoard() {
  const [columns, setColumn] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const sensors = useSensors(useSensor(PointerSensor,{
    activationConstraint: {
      distance: 3,
    }
  }))
  const handleAddColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumn([...columns, columnToAdd]);
  };
  const handleDeleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumn(filteredColumns);
  };
  function generateId() {
    return Math.floor(Math.random() * 1000);
  }
  function onDragStart(event: DragStartEvent) {
    console.log("DRAG START", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    console.log("DRAG START", event);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;
    setColumn((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arrayMove(columns,activeColumnIndex,overColumnIndex);
    });
  }
  return (
    <div className="flex gap-3 items-center w-fulloverflow-x-auto overflow-y-hidden p-5">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex  gap-3">
          <SortableContext items={columnsId}>
            {columns.map((col) => {
              return (
                <ColumnContainer
                  column={col}
                  deleteColumn={handleDeleteColumn}
                  key={col.id}
                />
              );
            })}
          </SortableContext>
          <Button
            className="font-semibold"
            onClick={handleAddColumn}
            style={{ backgroundColor: "black" }}
          >
            <Plus />
            Add Column
          </Button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={handleDeleteColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
