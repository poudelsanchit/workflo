import Board from "@/app/kanban/board";

export default function DynamicPrivatePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="h-screen w-full bg-[#111111] text-neutral-50 font-semibold">
      <Board />
    </div>
  );
}
