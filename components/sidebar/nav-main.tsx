import { Plus, User, Users } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useUserStore from "@/app/store/userStore";
import { Input } from "../ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function NavMain() {
  const [shouldFetchUserData, setShouldFetchUserData] = useState(false);
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItemTitle, setCurrentItemTitle] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("");
  const userId = useUserStore((state) => state.user?._id);
  const privatePages = useUserStore((state) => state.user?.pages.private);
  const teamspacePages = useUserStore((state) => state.user?.pages.teamspace);
  const items = [
    {
      title: "Private",
      tooltip: "Add a private page",
      icon: User,
      isActive: true,
      items: privatePages?.map((page) => ({
        title: page.title,
        url: `/app/${page.pageId}`,
      })),
    },
    {
      title: "Teamspace ",
      tooltip: "Add a teamspace page",
      icon: Users,
      isActive: true,
      items: teamspacePages?.map((page) => ({
        title: page.title,
        url: `/teamspace/${page.pageId}`,
      })),
    },
  ];

  const handleCreateNewPage = (
    e: React.MouseEvent<HTMLDivElement>,
    itemTitle: string
  ) => {
    e.stopPropagation();
    setCurrentItemTitle(itemTitle.toLowerCase());
    setIsDialogOpen(true);
  };

  const handleConfirmCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pageTitle || !userId || !currentItemTitle) {
      toast("Missing required information!");
      return;
    }

    try {
      const response = await axios.post(`/api/${currentItemTitle}`, {
        title: pageTitle,
        userId: userId,
      });

      const newPage = response.data;

      // Update the store with the new page
      useUserStore.getState().addPage(currentItemTitle, {
        pageId: newPage._id, // Assuming the API returns the new page's ID
        title: newPage.title,
      });
      toast(`New page "${pageTitle}" created successfully!`);
      setIsDialogOpen(false);
      setPageTitle(""); // Reset the input field

      // Trigger re-fetch of user data
      setShouldFetchUserData(true); // Set state to trigger the useEffect
    } catch (error) {
      toast("Error creating the page");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.userId) {
        try {
          const response = await axios.get(
            `/api/user?userId=${session.userId}`
          );
          setUser(response.data.user);
          setShouldFetchUserData(false); // Set state to trigger the useEffect
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session, setUser, shouldFetchUserData]);

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="group/sidebar-item">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span className="text-gray-500 text-xs font-semibold">
                      {item.title}
                    </span>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger
                          className="ml-auto p-1 rounded-sm hover:bg-gray-300/40 opacity-0 transition-opacity duration-200 group-hover/sidebar-item:opacity-100"
                          asChild
                        >
                          <div
                            onClick={(e) => handleCreateNewPage(e, item.title)}
                          >
                            <Plus size={14} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="font-semibold text-black">
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.url}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span className="text-black">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
              
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CREATE A NEW PAGE</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmCreate}>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Input
                  id="page-title"
                  type="text"
                  placeholder="Provide the page title"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  required
                />
              </div>
              <p>
                Are you sure you want to create a new page under{" "}
                <strong>{currentItemTitle}</strong>?
              </p>
              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "black" }}
              >
                Confirm
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
