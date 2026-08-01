import { Router } from 'express';
import authRoutes from './auth.routes';
import leaveRoutes from './leave.routes';
import managerRoutes from './manager.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leave', leaveRoutes);
router.use('/manager', managerRoutes);

export default router;
