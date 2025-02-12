import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import axios from "axios";
import { Edit, Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Page, UserData } from "../app-sidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { redirect } from "next/navigation";
interface Props {
  userId: string | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  page: Page;
}

export default function NavMainItem({ userId, setUserData, page }: Props) {
  const { isMobile } = useSidebar();

  const [editMode, setEditMode] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>(page.title);
  const handleNavigateToPage = () => {
    redirect(`/app/${page.pageId}`);
  };
  const handleEditSpace = async () => {
    if (pageTitle === page.title) return;
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
      <Link href={`/app/${page.pageId}`}>
        <SidebarMenuSubItem
          key={page.pageId}
          className="flex justify-between items-center hover:bg-sidebar-accent rounded-sm  group/sidebar-space-item"
        >
          <SidebarMenuSubButton asChild>
            <span className="text-neutral-400/90">{page.title}</span>
          </SidebarMenuSubButton>

          <DropdownMenu>
            <DropdownMenuTrigger className=" focus:outline-none">
              <div className="pr-2 cursor-pointer opacity-0 transition-opacity duration-200 group-hover/sidebar-space-item:opacity-100 text-[#6a6a6a] hover:text-white">
                <MoreHorizontal size={16} />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-48 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem onClick={handleNavigateToPage}>
                <Folder className="text-muted-foreground" />
                <span>View Project</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <Edit className="text-muted-foreground" />
                <span>Rename Project</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleDeleteSpace({ pageId: page.pageId });
                }}
              >
                <Trash2 className="text-muted-foreground" />
                <span>Delete Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuSubItem>
      </Link>
    </>
  );
}
