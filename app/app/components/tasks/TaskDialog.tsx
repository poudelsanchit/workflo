import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { Id, Task } from "@/types/types";

interface Props {
  task: Task;
  content: string;
  editMode: boolean;
  onChange: any;
  pageId: string;
  toggleEditMode: () => void;
  columnId: string;
  taskId: string | number;
  updateTask: (
    id: Id,
    content: string,
    columnId: string,
    label: string
  ) => void;
}

const formSchema = z.object({
  content: z.string().min(2).max(50),
  label: z.string({
    required_error: "Please select an label.",
  }),
});
export default function TaskDialog({
  task,
  content,
  editMode,
  onChange,
  toggleEditMode,
  pageId,
  columnId,
  taskId,
  updateTask,
}: Props) {
  const [isRequesting, setIsRequesting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: task.content,
      label: task.label,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsRequesting(true);
      const response = await axios.put(
        `/api/private/${pageId}/column/${columnId}/task`,
        {
          content: values.content,
          taskId,
          label: values.label,
        }
      );
      console.log(response);
      if (response.status === 200) {
        const { content, id, columnId, label } = response.data.updatedTask;
        updateTask(id, content, columnId, label);
        // updateTask(response.data.updatedTask);
        toast("Updated Succesfully");
      }
      setIsRequesting(false);
      toggleEditMode();
    } catch (error) {
      setIsRequesting(false);

      toast("Internal server error");
    }
  };
  const [date, setDate] = useState<Date>();

  return (
    <Dialog open={editMode} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-xl font-semibold">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your tasks here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" flex flex-col space-y-2   "
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 w-full">
                    <FormLabel className="text-right font-semibold ">
                      Task Title
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Title..."
                        {...field}
                        className=" w-96"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Deadline
                </Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="top"
                  >
                    <Calendar
                      className="pointer-events-auto"
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div> */}

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 w-full">
                    <FormLabel className="text-right font-semibold ">
                      Label
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ? field.value : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a label" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="docs">Documentation</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="help">Help</SelectItem>
                        <SelectItem value="refactor">Refactor</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issue" className="text-right">
                  Priority
                </Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="optional">optional</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div> */}
              <Button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-950/90 w-max ml-auto"
              >
                {isRequesting && (
                  <div className="w-[20px] h-[20px] border-[3px] border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                )}
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
