import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { knex } from '../database/knex';
import { Driver } from '../models/models';
import { options, generateToken, userSchema, loginSchema } from '../utility/utils';


// Register a new user(driver))
export async function createAccount(req: Request, res: Response) {
  try {
    const validationResult = userSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const duplicateDriver = await knex('drivers').where('email', req.body.email).orWhere('phone', req.body.phone).first();

    if (duplicateDriver) {
      return res.status(409).json({ msg: 'Enter a unique email or phonenumber' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);
    const driver = await knex('drivers').insert({
      id: uuidv4(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      verified: false,
      wallet: 0,
      password: passwordHash,
    });

    if (driver as unknown as Driver) {
      return res.status(201).json({
        msg: `User account created successfully. Welcome ${req.body.firstname}!`,
      });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'failed to create an account', route: '/users/create-account' });
  }
};

//Driver Log In
export async function driverlogin(req: Request, res: Response) {
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ msg: validationResult.error.details[0].message });
    }

    const driver = await knex('drivers').where('email', req.body.email).first() as Driver;

    if (!driver) { return res.status(404).json({ msg: 'User not found' }) };

    const isMatch = await bcrypt.compare(req.body.password, driver.password);
    if (isMatch) {
      const id = driver.id;
      const fullname = driver.firstname;
      const username = driver.lastname;
      const email = driver.email;
      const phone = driver.phone;
      const homeAddress = driver.home_address;
      const wallet = driver.wallet;
      const userInfo = { id, fullname, username, email, phone, homeAddress, wallet };
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
    res.status(500).json({ msg: 'failed to authenticate', route: '/users/driver/login' });
  }
};

