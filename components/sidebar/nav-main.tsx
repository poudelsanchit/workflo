import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { UserData, UserPages } from "./app-sidebar";
import { ChevronRight, MoreHorizontal, Plus, User } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
interface NavMainProps {
  pages?: UserPages;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}
export function NavMain({ pages, setUserData }: NavMainProps) {
  const router = useRouter(); // Initialize router
  const { data: session } = useSession(); // Get session data
  const userId = session?.userId; // Extract userId from session
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>("");

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/private`, {
        title: pageTitle,
        userId: userId,
      });
      const data = response.data;
      if (response.status) {
        setUserData(data.user);
      }
      console.log(data);
      setIsDialogOpen(false);
      setPageTitle("");
      router.push(`/app/${data.newPage._id}`);
      toast("New space created succesfully");
    } catch (error) {
      toast("Error creating the page");
      console.error(error);
    }
  };

  const handleDeleteSpace = async () => {
    toast("Space deleted succesfully");
  };
  return (
    <>
      <SidebarGroup>
        <SidebarMenu className="text-xs font-[450] ">
          <Collapsible asChild defaultOpen={true} className="group/collapsible">
            {/* Private Section */}
            <SidebarMenuItem>
              <CollapsibleTrigger asChild className="group/sidebar-item">
                <SidebarMenuButton
                  tooltip={"Private Page"}
                  className="dark:text-sidebar-foreground/70"
                >
                  <User />
                  <span>Spaces</span>
                  <div className="flex ml-auto justify-center items-center gap-2  ">
                    <div
                      className="ml-auto p-1 rounded-sm hover:bg-gray-300/20 opacity-0 transition-opacity duration-200 group-hover/sidebar-item:opacity-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus size={16} />
                    </div>

                    <ChevronRight
                      size={18}
                      className=" transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className=" w-11/12">
                  {pages?.private.map((page) => (
                    <SidebarMenuSubItem
                      key={page.title}
                      className="flex justify-between items-center hover:bg-sidebar-accent rounded-sm  group/sidebar-space-item"
                    >
                      <SidebarMenuSubButton asChild>
                        <Link href={`/app/${page.pageId}`}>
                          <span>{page.title}</span>
                        </Link>
                      </SidebarMenuSubButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger className=" focus:outline-none">
                          <div className="pr-2 cursor-pointer opacity-0 transition-opacity duration-200 group-hover/sidebar-space-item:opacity-100 text-[#6a6a6a] hover:text-white">
                            <MoreHorizontal size={16} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="bottom"
                          align="start"
                          sideOffset={1}
                        >
                          <DropdownMenuItem onClick={handleDeleteSpace}>
                            <div>Delete</div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Teamspace Section
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
          </Collapsible> */}
        </SidebarMenu>
      </SidebarGroup>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#121212]">
          <DialogHeader>
            <DialogTitle>Create a new space</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePage}>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label>Space Title</Label>
                <Input
                  id="sppace-title"
                  type="text"
                  placeholder="Provide the page title"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  required
                />
              </div>
              <p>
                Are you sure you want to create a new space under{" "}
                <strong>private</strong>?
              </p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full  text-white bg-black"
                  onClick={(e) => {
                    e.preventDefault();

                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full dark:bg-purple-700 text-white bg-black"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
