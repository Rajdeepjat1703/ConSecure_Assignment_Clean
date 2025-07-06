import { Router } from 'express';
import { getAllThreats, getThreatById, getThreatStats, getAllCategories } from '../controllers/threat.controller';
const router = Router();

router.get('/', getAllThreats);
router.get('/stats', getThreatStats);
router.get('/categories', getAllCategories);
router.get('/:id', getThreatById);

export default router;
