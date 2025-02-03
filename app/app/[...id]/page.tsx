import KanbanBoard from "../components/KanbanBoard";

export default function DynamicPrivatePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <KanbanBoard/>
  );
}
