import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Page, UserData } from "../app-sidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
interface Props {
  userId: string | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  page: Page;
}

export default function NavMainItem({ userId, setUserData, page }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>(page.title);
  const handleEditSpace = async () => {
    try {
      const response = await axios.put(`/api/private/${page.pageId}`, {
        userId: userId,
        title: pageTitle,
      });
      if (response.data) {
        setUserData(response.data.user);
        toast("Space updated sucessfully");
      }
    } catch (error) {
      console.log("Error updating the space details");
    }
  };
  const handleDeleteSpace = async ({ pageId }: { pageId: string }) => {
    try {
      const response = await axios.delete(`/api/private/${pageId}`, {
        data: { userId: userId },
      });
      if (response.data) {
        // handleDeletePage(pageId);
        setUserData(response.data.user);

        console.log(response.data.user);
      }
    } catch (error) {
      console.log(error);
      toast("Error deleting space");
    }
  };
  if (editMode) {
    return (
      <SidebarMenuSubItem
        key={page.pageId}
        className="flex justify-between items-center hover:bg-sidebar-accent rounded-sm  group/sidebar-space-item h-7 pl-2 text-sm"
      >
        <Input
          autoFocus
          value={pageTitle}
          onChange={(e) => {
            setPageTitle(e.target.value);
          }}
          className="h-max p-0 border-0"
          onBlur={() => {
            handleEditSpace();
            setEditMode(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEditSpace();
              setEditMode(false);
            }
          }}
        />
      </SidebarMenuSubItem>
    );
  }
  return (
    <>
      <SidebarMenuSubItem
        key={page.pageId}
        className="flex justify-between items-center hover:bg-sidebar-accent rounded-sm  group/sidebar-space-item"
      >
        <SidebarMenuSubButton asChild>
          <Link href={`/app/${page.pageId}`}>
            <span>{page.title}</span>
          </Link>
        </SidebarMenuSubButton>

        <DropdownMenu>
          <DropdownMenuTrigger className=" focus:outline-none">
            <div className="pr-2 cursor-pointer opacity-0 transition-opacity duration-200 group-hover/sidebar-space-item:opacity-100 text-[#6a6a6a] hover:text-white">
              <MoreHorizontal size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" sideOffset={1}>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteSpace({ pageId: page.pageId });
              }}
            >
              <div>Delete</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditMode(true);
                toast("Rename functionality");
              }}
            >
              Rename
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuSubItem>
    </>
  );
}
