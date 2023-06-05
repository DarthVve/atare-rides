import express from 'express';

import { auth } from '../middlewares/auth';
import { createRecipient } from '../middlewares/recipient';
import { fundAccount, withdraw } from '../controllers/paymentControllers';

const router = express.Router();

/* Fund Routes */
router.post('/deposit', auth, fundAccount);
router.post('/withdraw', auth, createRecipient, withdraw);

export default router;
