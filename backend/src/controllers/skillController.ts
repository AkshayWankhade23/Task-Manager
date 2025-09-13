import { Request, Response } from 'express';
import prisma from '../lib/prisma'; // Adjust path based on your project structure

// 🟢 GET /api/skills - Get all skills for logged-in user
export const getSkills = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
};

// 🟢 POST /api/skills - Add new skill
export const addSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, level } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Make sure level is a number
    const levelValue = parseInt(level);
    if (isNaN(levelValue)) {
      return res.status(400).json({ message: 'Level must be a valid number' });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        level: levelValue,
        userId,
      },
    });

    res.status(201).json(skill);
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).json({ message: 'Failed to add skill' });
  }
};

// 🟢 PUT /api/skills/:id - Update a skill
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, level } = req.body;

    const skill = await prisma.skill.findUnique({ where: { id } });

    if (!skill || skill.userId !== userId) {
      return res.status(404).json({ message: 'Skill not found or unauthorized' });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: { name, level },
    });

    res.json(updatedSkill);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update skill' });
  }
};

// 🟢 DELETE /api/skills/:id - Delete a skill
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const skill = await prisma.skill.findUnique({ where: { id } });

    if (!skill || skill.userId !== userId) {
      return res.status(404).json({ message: 'Skill not found or unauthorized' });
    }

    await prisma.skill.delete({ where: { id } });

    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete skill' });
  }
};
