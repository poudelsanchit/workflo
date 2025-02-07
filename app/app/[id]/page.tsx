"use client";

import axios from "axios";
import { use, useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import { Column } from "@/types/types";
interface Data {
  id: string;
  title: string;
  column: Column[];
}
export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Data | null>(null);

  const handleGetData = async () => {
    const response = await axios.get(`/api/private/${id}`);
    setData(response.data.data);
  };
  useEffect(() => {
    handleGetData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <KanbanBoard column={data.column} />
    </div>
  );
}
