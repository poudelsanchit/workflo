"use client";
import Board from "./board";

export default function Kanban() {
  return (
    <div className="h-screen w-full bg-[#111111] text-neutral-50 font-semibold">
      <Board />
    </div>
  );
}
