import KanbanBoard from "../components/KanbanBoard";

export default function DynamicPrivatePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="h-screen w-full  bg-[#0f0e0e] text-neutral-50 font-semibold">
      <KanbanBoard />
    </div>
  );
}
