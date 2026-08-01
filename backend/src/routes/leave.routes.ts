import { Router } from 'express';
import { createLeaveRequest, getMyLeaveRequests } from '../controllers/leave.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createLeaveSchema } from '../validations/leave.validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createLeaveSchema), createLeaveRequest);
router.get('/my', getMyLeaveRequests);

export default router;
