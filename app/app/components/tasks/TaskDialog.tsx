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
import { Input } from "@/components/ui/input";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
export default function TaskDialog() {
  const [date, setDate] = useState<Date>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-max font-semibold">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your tasks here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              TasK title
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>

          {/* Deadline starts here */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Deadline
            </Label>

            {/* Calendar Button */}

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
              <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                  className="pointer-events-auto"
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {/* Calendar Button end */}
          </div>
          {/* Deadline ends here */}

          {/* Issue Type starts here */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="issue" className="text-right">
              Label
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a label" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="big">Bug</SelectItem>
                  <SelectItem value="docs">Documentation</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="help">Help</SelectItem>
                  <SelectItem value="refactor">Refactor</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Issue Type ends here */}
          {/* Priority Type starts here */}
          <div className="grid grid-cols-4 items-center gap-4">
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
          </div>
          {/* Priority Type ends here */}
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
