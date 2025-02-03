export default function DropIndicator ({ beforeId, column }: any)  {
    return (
      <div
        data-before={beforeId || "-1"}
        data-column={column}
        className="my-0.5 h-0.5 w-full bg-purple-500 opacity-0"
      />
    );
  };