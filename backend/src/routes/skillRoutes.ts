import express from 'express';
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate); // Protect all routes below

router.get('/', getSkills);
router.post('/', addSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;
