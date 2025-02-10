"use client";

import axios from "axios";
import { use, useEffect, useState } from "react";
import KanbanBoard from "../components/board/KanbanBoard";
import { Column } from "@/types/types";

interface Data {
  id: string;
  title: string;
  column: Column[];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Data | null>(null);

  const handleGetData = async () => {
    try {
      const response = await axios.get(`/api/private/${id}`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const formattedTasks =
    data?.column.flatMap(
      (col) =>
        col.tasks?.map((task) => ({
          id: task.id,
          columnId: task.columnId,
          content: task.content,
        })) || [] // Fallback to an empty array if tasks is undefined
    ) || [];
  console.log(formattedTasks);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <KanbanBoard column={data.column} task={formattedTasks} pageId={id} />
    </div>
  );
}
