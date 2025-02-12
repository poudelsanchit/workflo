"use client";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import {
  Settings,
  Trash,
  MessageCircleQuestion,
  Home,
  Inbox,
} from "lucide-react";
import Link from "next/link";

export function NavHeader() {
  const [projects] = React.useState([
    {
      name: "Home",
      url: "/app",
      icon: Home,
    },
    {
      name: "Inbox",
      url: "/app/inbox",
      icon: Inbox,
    },
    {
      name: "Settings",
      url: "/app/settings",
      icon: Settings,
    },
    {
      name: "Trash",
      url: "/app/trash",
      icon: Trash,
    },
  ]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]">
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span className="font-semibold">{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
