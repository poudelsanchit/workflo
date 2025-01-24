"use client";

import { Plus } from "lucide-react";

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

export function NavMain({
  items,
  onAddNewItem,
}: {
  items: {
    title: string;
    url: string;
    isActive?: boolean;
    tooltip: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  onAddNewItem: (title: string) => void;
}) {
  return (
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
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the CollapsibleTrigger from being triggered
                            onAddNewItem(item.title);
                          }}
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
                    <SidebarMenuSubItem key={subItem.title}>
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
  );
}
