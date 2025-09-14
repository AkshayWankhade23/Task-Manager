"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { toast } from "sonner"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { taskSchema } from "@/lib/validations/task"

const CreateTask = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskName: "",
      priority: "no-priority",
      date: undefined,
      time: "",
      reminder: "on-time",
      reminderTimeUnit: "days",
      repeat: "none",
      skipWeekends: false,
    },
  })

  async function onSubmit(data: z.infer<typeof taskSchema>) {
    try {
      // TODO: Add API call to create task
      console.log("Task data:", data)
      
      toast.success("Task created successfully")
      router.push("/user/daily-tasks")
    } catch (error) {
      toast.error("Failed to create task. Please try again.")
      console.error("Error creating task:", error)
    }
  }

  const watchReminder = form.watch("reminder")
  const watchRepeat = form.watch("repeat")

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-card rounded-lg shadow-sm border">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create New Task</h1>
        <p className="text-sm text-muted-foreground">Fill in the details to create your task</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Details Section */}
          <div className="space-y-4">
            {/* Task Name */}
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Task Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter task name" 
                      className="w-full" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="no-priority">No Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date and Time Section */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="time" 
                        className="w-full pl-10" 
                        {...field} 
                      />
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Reminder Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Reminder</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select reminder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="on-time">On the day (at selected time)</SelectItem>
                      <SelectItem value="5-mins">5 minutes early</SelectItem>
                      <SelectItem value="1-day">1 day early</SelectItem>
                      <SelectItem value="1-week">1 week early</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Reminder Fields */}
            {watchReminder === "custom" && (
              <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <h4 className="font-semibold text-base">Custom Reminder Settings</h4>
                <FormField
                  control={form.control}
                  name="reminderTimeUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select time unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("reminderTimeUnit") === "days" && (
                  <FormField
                    control={form.control}
                    name="reminderCustomDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days Early (0-60)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="60"
                            placeholder="0"
                            className="w-full"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("reminderTimeUnit") === "weeks" && (
                  <FormField
                    control={form.control}
                    name="reminderCustomWeeks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weeks Early (0-12)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="12"
                            placeholder="0"
                            className="w-full"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="reminderCustomTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Time</FormLabel>
                      <FormControl>
                        <Input type="time" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Repeat Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="repeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Repeat</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select repeat option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="weekdays">Every Weekday (Mon-Fri)</SelectItem>
                      <SelectItem value="weekends">Every Weekend (Sat-Sun)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Repeat Fields */}
            {watchRepeat === "custom" && (
              <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <h4 className="font-semibold text-base">Custom Repeat Settings</h4>

                <FormField
                  control={form.control}
                  name="repeatType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select repeat type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          <SelectItem value="due-dates">By Due Dates</SelectItem>
                          <SelectItem value="completion-dates">By Completion Dates</SelectItem>
                          <SelectItem value="specific-dates">By Specific Dates</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="repeatFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repeatCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Count (1-365)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="365"
                            placeholder="1"
                            className="w-full"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="skipWeekends"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 bg-gray-300">
                      <div className="space-y-0.5 ">
                        <FormLabel className="text-base">Skip Weekends</FormLabel>
                        <div className="text-sm text-muted-foreground">Skip Saturday and Sunday when repeating</div>
                      </div>
                      <FormControl className="bg-green-500">
                        <Switch checked={field.value} onCheckedChange={field.onChange} className="bg-green-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-w-[100px]"
            >
              Create Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateTask