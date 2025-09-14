import { Request, Response } from "express"
import { prisma } from "../lib/prisma"
// We'll use the extended Request type directly since we added the user property globally

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const task = await prisma.task.create({
      data: {
        ...req.body,
        userId,
      },
    })

    res.status(201).json(task)
  } catch (error) {
    console.error("Error creating task:", error)
    res.status(500).json({ error: "Failed to create task" })
  }
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "asc",
      },
    })

    res.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    res.status(500).json({ error: "Failed to fetch tasks" })
  }
}

export const getTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { id } = req.params
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    res.status(500).json({ error: "Failed to fetch task" })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { id } = req.params
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" })
    }

    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data: req.body,
    })

    res.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    res.status(500).json({ error: "Failed to update task" })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { id } = req.params
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" })
    }

    await prisma.task.delete({
      where: {
        id,
      },
    })

    res.status(204).send()
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(500).json({ error: "Failed to delete task" })
  }
}

// Additional utility functions

export const toggleTaskCompletion = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { id } = req.params
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        completed: !task.completed,
      },
    })

    res.json(updatedTask)
  } catch (error) {
    console.error("Error toggling task completion:", error)
    res.status(500).json({ error: "Failed to update task" })
  }
}

export const getTasksByDate = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { date } = req.query
    const startDate = new Date(date as string)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    res.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks by date:", error)
    res.status(500).json({ error: "Failed to fetch tasks" })
  }
}