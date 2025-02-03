import { motion } from "framer-motion";
import DropIndicator from "./dropindicator";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal } from "lucide-react";

export default function Card ({ title, id, column, handleDragStart }: any)  {
    return (
      <>
        <DropIndicator beforeId={id} column={column} />
        <motion.div
          layout
          layoutId={id}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, { title, id, column })}
          className="relative cursor-grab rounded-md    bg-[#171717] p-3 pt-4 pb-2 active:cursor-grabbing flex flex-col gap-2"
        >
          <p className="text-sm text-neutral-100 pb-2">{title}</p>
          <Separator className="bg-neutral-400/10 h-[0.1px]"/>
          <p className="text-xs text-neutral-600">1st Jan, 2025</p>
          <MoreHorizontal className="absolute top-3 right-3 text-neutral-600 cursor-pointer" size={20}/>

        </motion.div>
      </>
    );
  };
  