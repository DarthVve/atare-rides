import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';

import { knex } from '../database/knex';
import { options, depositSchema, withdrawalSchema } from '../utility/utils';
import { getBanks, moneyConverter } from '../utility/paystack';
import { Passenger, Driver } from "../models/models";


// Deposit money into user's(passenger) wallet
export async function fundAccount(req: Request, res: Response) {
  try {
    const validationResult = depositSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    const { email, amount, bank } = req.body;

    const funding = await axios.post('https://api.paystack.co/charge', JSON.stringify({
      email: email,
      amount: amount,
      bank: {
        code: bank.code,
        account_number: bank.account_number
      }
    }), {
      headers: {
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-type": "application/json"
      }
    });

    if (!funding.data.status) {
      return res.status(400).json({ message: 'failed to initiate transaction due to failure from third party api(paystack)', data: funding.data });
    } else {
      const payment = await knex('payments').insert({
        type: 'wallet credit',
        amount: amount,
        beneficiary: req.user,
        status: 'pending',
        time: new Date().getTime(),
        date: new Date().getDate(),
        reference: funding.data.data.reference,
      });

      return res.status(201).json({ message: 'transaction initiated successfully', data: payment });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to initiate transaction', route: '/payments/deposit' });
  }
};

//User withdrawal to their bank accounts facilitated by Atare Rides.
export async function withdraw(req: Request, res: Response) {
  try {
    // const validationResult = withdrawalSchema.validate(req.body, options);
    // if (validationResult.error) {
    //   return res.status(400).json({ message: validationResult.error.details[0].message });
    // }

    /* You have to verify the user you are sending money to, only if successful before you proceed. Unfortunately this request does not work with test data you must supply a
      valid bank account number as well as the corresponding bank code for the bank which the account belongs to. bank codes can be gotten from the utility folder. */

    // const verifyAccountDetails = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${req.body.account_number}&bank_code=${req.body.code}`,
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    //     }
    //   }
    // );

    //if (!verifyAccountDetails.data.status) {


    // res.status(200).json({ message: 'account details verified', data: verifyAccountDetails.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to initiate transaction', route: '/payments/withdraw' });
  }
};
