import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { UserPages } from "./app-sidebar";

import { ChevronRight, Plus, User } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
interface NavMainProps {
  pages?: UserPages;
}
export function NavMain({ pages }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarMenu className="text-sm font-semibold">
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          {/* Private Section */}
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={"Private Page"}
                className="dark:text-gray-400"
              >
                <User />
                <span>Private</span>
                <div className="flex ml-auto justify-center items-center gap-2  ">
                  <Plus size={16}    className="opacity-0 group-hover/collapsible:opacity-100 transition-opacity duration-200 hover:bg-neutral-500 rounded-sm h-4 w-4"
                  />
                  <ChevronRight size={18} className=" transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {pages?.private.map((page) => (
                  <SidebarMenuSubItem key={page.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/app/${page.pageId}`}>
                        <span>{page.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        {/* Teamspace Section */}
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={"Teamspace"}
                className="dark:text-gray-400"
              >
                <User />
                <span>Teamspace</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {pages?.teamspace.map((page) => (
                  <SidebarMenuSubItem key={page.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/app/${page.pageId}`}>
                        <span>{page.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
