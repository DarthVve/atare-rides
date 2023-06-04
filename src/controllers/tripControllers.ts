import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { knex } from '../database/knex';
import { Trip } from '../models/models';
import { options, tripSchema } from '../utility/utils';


//Create a new trip
export async function createTrip(req: Request, res: Response) {
  try {
    const validationResult = tripSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const trip = await knex('trips').insert({
      driver: req.body.driver,
      passenger: req.body.passenger,
      location: req.body.pickup_location,
      destination: req.body.destination,
      fair: req.body.fair,
    });

    if (trip as unknown as Trip) {
      return res.status(201).json({
        msg: `Trip created successfully.`,
      });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to create trip', route: '/trips/create' });
  };
};

//Fetch all trips
export async function getAllTrips(req: Request, res: Response) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;

    const trips = await knex('trips').select('*').limit(limit).offset(offset) as Trip[];
    const count = await knex('trips').count();

    if (trips && count) {
      return res.status(200).json({ trips, count });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to fetch trips', route: '/trips' });
  }
};

//Fetch a single trip
export async function getTrip(req: Request, res: Response) {
  try {
    const trip = await knex('trips').where('id', req.params.id).first() as Trip;

    if (trip) {
      return res.status(200).json(trip);
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to fetch trip', route: '/trips/:id' });
  }
};

//Update a trip confirming it has been completed
export async function updateTrip(req: Request, res: Response) {
  try {
    const trip = await knex('trips').where('id', req.params.id).update({ distance: req.body.distance }) as Trip;

    if (trip) {
      return res.status(200).json({ msg: `Trip completed successfully. A distance of ${req.body.distance}km was travelled` });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to update trip', route: '/trips/update/:id' });
  }
};
