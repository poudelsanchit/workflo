import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
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
import { Column, Id, Task } from "@/types/types";
import { BsPlus } from "react-icons/bs";
import axios from "axios";

interface Props {
  createTask: (newTask: Task) => void;
  column: Column;
  pageId: string;
}

const formSchema = z.object({
  content: z
    .string()
    .min(5, { message: "Title must be atleast 5 characters long" })
    .max(100),
  label: z.string().min(1, { message: "Please select the label " }),
});
export default function AddTaskDialog({ column, createTask, pageId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      label: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsRequesting(true);
      const response = await axios.post(
        `/api/private/${pageId}/column/${column.id}/task`,
        { content: values.content, label: values.label }
      );
      const newTask = response.data.newTask;
      if (response.data) {
        createTask(newTask);
        form.reset(); // Reset form fields
        setIsRequesting(false);
        setIsOpen(false);
        toast("New Task added succesfully");
      }
    } catch (error) {
      setIsRequesting(false);

      toast("Internal server error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex mr-auto pl-1 justify-center items-center text-sm text-neutral-600 dark:text-gray-400 font-semibold  transition-all duration-100">
        Add Task <BsPlus size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl font-semibold dark:bg-black border-[#252528] border-[0.11px]">
        <DialogHeader>
          <DialogTitle>Add new Task</DialogTitle>
          <DialogDescription>
            Create a new task by filling the fields and Click save when you're
            done.
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
                  <div className="flex flex-col">
                    <FormItem className="grid grid-cols-4 items-center gap-4 w-full">
                      <FormLabel className="text-right font-semibold ">
                        Task Title
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          autoFocus
                          placeholder="Title..."
                          {...field}
                          className=" w-96 border-[#252528]"
                        />
                      </FormControl>
                    </FormItem>
                    <FormMessage className="ml-auto font-semibold" />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <div className="flex flex-col">
                    <FormItem className="grid grid-cols-4 items-center gap-4 w-full">
                      <FormLabel className="text-right font-semibold ">
                        Label
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ? field.value : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px] border-[#252528]">
                            <SelectValue placeholder="Select a label" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#252528]">
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="docs">Documentation</SelectItem>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="help">Help</SelectItem>
                          <SelectItem value="refactor">Refactor</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                    <FormMessage className=" font-semibold ml-auto" />
                  </div>
                )}
              />
              <Button
                type="submit"
                className="bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-950/90 w-max ml-auto"
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
