"use client";

import * as React from "react";
import { Settings, Trash, MessageCircleQuestion } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-utilities";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // State to manage the navMain data
  const [navMainData, setNavMainData] = React.useState([
    {
      title: "Personal",
      url: "#",
      isActive: true,
      tooltip: "Add a personal page",
      items: [
        {
          title: "Untitled",
          url: "#",
        },
      ],
    },
    {
      title: "Teamspace",
      url: "#",
      isActive: false,
      tooltip: "Add a teamspace page",
      items: [
        {
          title: "Untitled",
          url: "#",
        },
      ],
    },
  ]);

  const [projects] = React.useState([
    {
      name: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      name: "Trash",
      url: "#",
      icon: Trash,
    },
    {
      name: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ]);

  const user = {
    name: "poudelsanchit",
    email: "snchtpdl12@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  };

  // Handler to add a new item
  const handleAddNewItem = (title: string) => {
    setNavMainData((prev) =>
      prev.map((section) =>
        section.title === title
          ? {
              ...section,
              items: [
                ...section.items,
                { title: "Untitled", url: "#" }, // Add new "Untitled" item
              ],
            }
          : section
      )
    );
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* Pass data and handler to NavMain */}
        <NavMain items={navMainData} onAddNewItem={handleAddNewItem} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
