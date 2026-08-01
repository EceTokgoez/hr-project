import { Router } from 'express';
import { approveRequest, getRequests, rejectRequest } from '../controllers/manager.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, requireRole('MANAGER'));

router.get('/requests', getRequests);
router.put('/approve/:id', approveRequest);
router.put('/reject/:id', rejectRequest);

export default router;
