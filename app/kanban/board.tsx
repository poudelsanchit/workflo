import { motion } from "framer-motion";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import BurnBarrel from "./burnbarrel";
import Column from "./column";
const DEFAULT_CARDS = [
    // BACKLOG
    { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
    { title: "SOX compliance checklist", id: "2", column: "backlog" },
    { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
    { title: "Document Notifications service", id: "4", column: "backlog" },
    // TODO
    {
      title: "Research DB options for new microservice",
      id: "5",
      column: "todo",
    },
    { title: "Postmortem for outage", id: "6", column: "todo" },
    { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },
  
    // DOING
    {
      title: "Refactor context providers to use Zustand",
      id: "8",
      column: "progress",
    },
    { title: "Add logging to daily CRON", id: "9", column: "doing" },
    // DONE
    {
      title: "Set up DD dashboards for Lambda listener",
      id: "10",
      column: "complete",
    },
  ];
  const COLUMNS = [
    {
      title: "Backlog",
      column: "backlog",
      color: "text-neutral-500",
      columnId: "01",
    },
    {
      title: "TODO",
      column: "todo",
      color: "text-red-500",
      columnId: "02",
    },
    {
      title: "IN Progress",
      column: "progress",
      color: "text-blue-500",
      columnId: "03",
    },
    {
      title: "Complete",
      column: "complete",
      color: "text-green-500",
      columnId: "04",
    },
  ];
export default function Board () {
    const [cards, setCards] = useState(DEFAULT_CARDS);
    const [columns, setColumns] = useState(COLUMNS);
  
    const [isAdding, setIsAdding] = useState(false);
    const [text, setText] = useState("");
  
    const handleSubmit = (e: any) => {
      e.preventDefault();
  
      if (!text.trim().length) return;
  
      const newColumn = {
        title: text.trim(),
        column: text.toLowerCase().trim(),
        color: "text-purple-700",
        columnId: generateColumnId(),
      };
  
      console.log(newColumn);
      setColumns((col) => [...col, newColumn]);
      setIsAdding(false);
    };
  
    const generateColumnId = () => {
      return `col-${Math.floor(Math.random() * 100000)}`;
    };
  
    return (
      <div className="flex h-full w-full gap-3 overflow-scroll p-12">
        {columns.map((c) => {
          return (
            <Column
              key={c.columnId}
              title={c.title}
              column={c.column}
              headingColor={c.color}
              cards={cards}
              setCards={setCards}
            />
          );
        })}
  
        {/* Add column functionality */}
        {!isAdding && (
          <button
            className="flex h-max min-w-max items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50 "
            onClick={() => {
              setIsAdding(true);
            }}
          >
            <span>Add Column</span>
            <FiPlus />
          </button>
        )}
        {isAdding && (
          <motion.form layout onClick={handleSubmit}>
            <textarea
              onChange={(e) => setText(e.target.value)}
              autoFocus
              placeholder="Add new Column..."
              className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
            />
            <div className="mt-1.5 flex items-center justify-end gap-1.5">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
              >
                <span>Add</span>
                <FiPlus />
              </button>
            </div>
          </motion.form>
        )}
  
        <BurnBarrel setCards={setCards} />
      </div>
    );
  };