import * as z from "zod"

export const taskSchema = z.object({
  taskName: z.string().min(1, "Task name is required").max(100, "Task name cannot exceed 100 characters"),
  priority: z.enum(["high", "medium", "low", "no-priority"]).describe("Please select a priority level"),
  date: z.date().describe("Please select a date"),
  time: z.string().min(1, "Please select a time"),
  reminder: z.enum(["on-time", "5-mins", "1-day", "1-week", "custom"]).describe("Please select a reminder option"),
  reminderTimeUnit: z.enum(["days", "weeks"]).optional(),
  reminderCustomDays: z.number().min(0).max(60).optional(),
  reminderCustomWeeks: z.number().min(0).max(12).optional(),
  reminderCustomTime: z.string().optional(),
  repeat: z.enum(["none", "daily", "weekly", "monthly", "yearly", "weekdays", "weekends", "custom"]).describe("Please select a repeat option"),
  repeatType: z.enum(["due-dates", "completion-dates", "specific-dates"]).optional(),
  repeatFrequency: z.enum(["day", "week", "month", "year"]).optional(),
  repeatCount: z.number().min(1).max(365).optional(),
  skipWeekends: z.boolean().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>