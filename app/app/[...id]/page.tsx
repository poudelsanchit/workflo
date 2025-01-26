export default function DynamicPrivatePage({
  params,
}: {
  params: { id: string };
}) {
  return <div>{params.id}</div>;
}
