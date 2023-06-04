import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { knex } from '../database/knex';
import { Passenger } from '../models/models';
import { options, generateToken, userSchema, loginSchema } from '../utility/utils';


// Register a new user(passenger)
export async function register(req: Request, res: Response) {
  try {
    const validationResult = userSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const duplicatePassenger = await knex('passengers').where('email', req.body.email).orWhere('phone', req.body.phone).first();

    if (duplicatePassenger) {
      return res.status(409).json({ msg: 'Enter a unique email or phonenumber' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const passenger = await knex('passengers').insert({
      // id: uuidv4(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      verified: false,
      wallet: 0,
      password: passwordHash,
    });

    if (passenger as unknown as Passenger) {
      return res.status(201).json({
        msg: `User account created successfully. Welcome ${req.body.firstname}!`,
      });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to create an account', route: '/users/register' });
  }
};


//Passenger Log In
export async function logIntoAccount(req: Request, res: Response) {
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const passenger = await knex('passengers').where('email', req.body.email).first() as Passenger;

    if (!passenger) { return res.status(404).json({ msg: 'User not found' }) };

    const isMatch = await bcrypt.compare(req.body.password, passenger.password);
    if (isMatch) {
      const id = passenger.id;
      const firstname = passenger.firstname;
      const lastname = passenger.lastname;
      const email = passenger.email;
      const phone = passenger.phone;
      const homeAddress = passenger.home_address;
      const workAddress = passenger.work_address;
      const wallet = passenger.wallet;
      const userInfo = { id, firstname, lastname, email, phone, homeAddress, workAddress, wallet };
      const token = generateToken({ id }) as string;
      const production = process.env.NODE_ENV === "production";

      return res.status(200).cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: production,
        sameSite: production ? "none" : "lax"
      }).json({
        msg: 'You have successfully logged in',
        userInfo
      });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to authenticate', route: '/users/login' });
  }
};

//Log Out
export async function logoutUser(req: Request, res: Response) {
  try {
    res.clearCookie('token');
    res.status(200).json({ msg: 'You have successfully logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'failed to logout', route: '/user/logout' });
  }
};
