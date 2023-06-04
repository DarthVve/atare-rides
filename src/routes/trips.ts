import express from 'express';

import { createTrip, getAllTrips, getTrip, updateTrip } from '../controllers/tripControllers';
import { auth } from '../middleware/auth';

const router = express.Router();

/* Trip Routes */
router.post('/create', createTrip);
router.get('/', getAllTrips);
router.get('/:id', getTrip);
router.put('/update/:id', auth, updateTrip);

export default router;
