import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


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
        id: uuidv4(),
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
    const { amount, recipient_code } = req.body;

    const payment = await axios.post('https://api.paystack.co/transfer', JSON.stringify({
      source: "balance",
      amount: amount,
      reference: uuidv4(),
      recipient: recipient_code,
      reason: "Atare Rides withdrawal"
    }
    ), {
      headers: {
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-type": "application/json"
      }
    });

    if (!payment.data.status) {
      return res.status(400).json({ message: 'failed to initiate transaction due to failure from third party api(paystack)', data: payment.data });
    } else {
      const withdrawal = await knex('payments').insert({
        type: 'wallet debit',
        amount: amount,
        beneficiary: req.user,
        status: 'pending',
        time: new Date().getTime(),
        date: new Date().getDate(),
        reference: payment.data.data.reference,
      });

      return res.status(201).json({ message: 'transaction initiated successfully', data: withdrawal });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to initiate transaction', route: '/payments/withdraw' });
  }
};
