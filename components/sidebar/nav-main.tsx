"use client";

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useUserStore from "@/app/store/userStore";

export function NavMain() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItemTitle, setCurrentItemTitle] = useState<string | null>(null);

  // Fetch the `private` and `teamspace` data from the store
  const privatePages = useUserStore((state) => state.user?.pages.private);
  const teamspacePages = useUserStore((state) => state.user?.pages.teamspace);

  const handleCreateNewPage = (
    e: React.MouseEvent<HTMLDivElement>,
    itemTitle: string
  ) => {
    e.stopPropagation();
    setCurrentItemTitle(itemTitle);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    console.log(`Create a new page under "${currentItemTitle}"`);
    setIsDialogOpen(false);
  };

  const items = [
    {
      title: "Private Pages",
      tooltip: "Your private pages",
      isActive: true,
      items: privatePages?.map((page) => ({
        title: page.title,
        url: `/private/${page.pageId}`,
      })),
    },
    {
      title: "Teamspace Pages",
      tooltip: "Teamspace shared pages",
      isActive: false,
      items: teamspacePages?.map((page) => ({
        title: page.title,
        url: `/teamspace/${page.pageId}`,
      })),
    },
  ];

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
                    <span className="text-gray-500 text-xs">{item.title}</span>
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
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.url}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
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
            <DialogTitle>Create a new board</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to create a new page under{" "}
            <strong>{currentItemTitle}</strong>?
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
