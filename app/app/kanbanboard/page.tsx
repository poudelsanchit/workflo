"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Column } from "./types";
import { useState } from "react";
import ColumnContainer from "./column-container";

export default function KanbanBoard() {
  const [columns, setColumn] = useState<Column[]>([]);
  console.log(columns);
  const handleAddColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumn([...columns, columnToAdd]);
  };
  function generateId() {
    return Math.floor(Math.random() * 1000);
  }
  return (
    <div className="flex gap-3 items-center w-fulloverflow-x-auto overflow-y-hidden p-5">
      <div className="flex  gap-3">
        {columns.map((col) => {
          return <ColumnContainer column={col}  key={col.id}/>;
        })}
        <Button className="font-semibold" onClick={handleAddColumn} style={{backgroundColor: 'black'}}>
          <Plus />
          Add Column
        </Button>
      </div>
    </div>
  );
}
