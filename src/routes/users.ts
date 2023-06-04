import express from 'express';

import { register, logIntoAccount, logoutUser } from '../controllers/passengerControllers';
import { createAccount, driverlogin } from '../controllers/driverControllers';

const router = express.Router();

/* User Routes */
router.get('/logout', logoutUser)

/* Passenger Routes */
router.post('/register', register);
router.post('/login', logIntoAccount);

/* Driver Routes */
router.post('/create-account', createAccount);
router.post('/driver/login', driverlogin);

export default router;
