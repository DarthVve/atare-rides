import express from 'express';

import { auth } from '../middleware/auth';
import { fundAccount, withdraw } from '../controllers/paymentControllers';

const router = express.Router();

/* Fund Routes */
router.post('/deposit', auth, fundAccount);
router.post('/withdraw', /*auth,*/ withdraw);

export default router;
