"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { NavMain } from "@/components/sidebar/navmain/nav-main";
import { NavProjects } from "@/components/sidebar/nav-utilities";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

// Add type definitions
export interface Page {
  pageId: string;
  title: string;
  _id?: string;
}

export interface UserPages {
  private: Page[];
  teamspace: Page[];
}

export interface UserData {
  pages: UserPages;
  _id: string;
  name: string;
  email: string;
  image: string;
  googleId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState<UserData | null>(null); // Properly typed state
  const { data: session, status } = useSession();

  const handleFetchData = async (userId: string) => {
    try {
      const response = await axios.get<{ message: string; user: UserData }>(
        `/api/user?userId=${userId}`
      );
      setUserData(response.data.user);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.userId) {
      handleFetchData(session.userId);
    }
  }, [status, session]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="dark:bg-neutral-950 rounded-t-lg">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="dark:bg-neutral-950 ">
        <NavMain pages={userData?.pages} setUserData={setUserData} />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter className="dark:bg-neutral-950 rounded-b-lg">
        <NavUser
          user={{
            name: userData?.name,
            email: userData?.email,
            image: userData?.image,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
