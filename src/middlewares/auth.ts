import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';

import { knex } from '../database/knex';

const secret = process.env.JWT_SECRET as string;

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization && !req.cookies.token) {
      return res.status(401).json({ msg: "Authentication required. Please login" });
    }

    const token = authorization?.slice(7) || req.cookies.token as string;
    const verified = verify(token, secret);
    if (!verified) {
      return res.status(401).json({ msg: "Token expired/invalid. Please login" });
    }

    const { id } = verified as { [key: string]: string };
    const passenger = await knex('passengers').where('id', id).first()
    const driver = await knex('drivers').where('id', id).first();

    if (!passenger || !driver) {
      return res.status(401).json({ msg: "User could not be identified" });
    }

    req.user = id;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unexpected Auth error" });
  }
};
