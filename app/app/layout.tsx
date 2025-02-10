"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar, // Add this import
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ThemeToggler } from "./components/theme/ThemeToggler";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname().split("/")[2];
  const { open } = useSidebar(); // Get sidebar state

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center px-4 w-full justify-between">
            <div className="flex gap-2 items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pathname}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggler />
          </div>
        </header>
        <div
          className={`flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto h-[calc(100vh-4rem)] ${
            open ? "w-[calc(100vw-16rem)]" : "w-[calc(100vw-4.2rem)]"
          } `}
        >
          {children}
        </div>
      </SidebarInset>
    </>
  );
}
