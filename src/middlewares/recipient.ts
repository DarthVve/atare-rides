import { Request, Response, NextFunction } from "express";
import axios from 'axios';

import { options, withdrawalSchema } from '../utility/utils';

const secret = process.env.JWT_SECRET as string;

/* This middleware does not work in the paystack api when using test data*/
//Create recipient for withdrawal
export async function createRecipient(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = withdrawalSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    const { name, bank_code, account_number, currency } = req.body;

    const recipient = await axios.post('https://api.paystack.co/transferrecipient', JSON.stringify({
      type: "nuban",
      name: name,
      account_number: account_number,
      bank_code: bank_code,
      currency: currency
    }
    ), {
      headers: {
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-type": "application/json"
      }
    });

    if (!recipient.data.status) {
      return res.status(400).json({ message: 'failed to create recipient due to failure from third party api(paystack)', data: recipient.data });
    } else {
      req.body.recipient_code = recipient.data.data.recipient_code;
      next();
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unexpected middleware execution error", route: "/payments/withdraw" });
  }
};
