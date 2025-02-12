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
import { useAtom } from "jotai"; // Import useAtom
import { userAtom } from "@/atoms/userAtom"; // Import the atom

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname().split("/")[2]; // Get the second part of the pathname
  const { open } = useSidebar(); // Get sidebar state
  const [userData] = useAtom(userAtom); // Accessing userData (no setter needed here)

  // Find the page that matches the pathname with the pageId from userData.pages.private
  const pageTitle =
    userData?.pages.private.find((page) => page.pageId === pathname)?.title ||
    "Default Title"; // Fallback to 'Default Title' if no match

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center px-4 w-full justify-between">
            <div className="flex gap-2 items-center font-semibold">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold">{pageTitle}</BreadcrumbPage>
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
          }`}
        >
          {children}
        </div>
      </SidebarInset>
    </>
  );
}
