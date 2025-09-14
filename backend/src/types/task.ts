import { Task, Priority, ReminderType, RepeatType } from ".prisma/client"

export type TaskInput = {
  taskName: string
  priority: Priority
  date: Date
  time: string
  reminder: ReminderType
  reminderTimeUnit?: string | null
  reminderCustomDays?: number | null
  reminderCustomWeeks?: number | null
  reminderCustomTime?: string | null
  repeat: RepeatType
  repeatType?: string | null
  repeatFrequency?: string | null
  repeatCount?: number | null
  skipWeekends?: boolean
  completed?: boolean
}

export type UpdateTaskInput = Partial<TaskInput>