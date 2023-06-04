import e, { Request, Response } from 'express';
import axios from 'axios';

export const cachedBAnks: any[] = [];

// Get list of banks from paystack's api
export async function getBanks(req: Request, res: Response) {
  try {
    const { data } = await axios.get("https://api.paystack.co/bank?country=nigeria", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    if (data.status) {
      cachedBAnks.push(data.data);
      return res.status(200).json({ message: "List of banks fetched successfully", data: data.data });
    } else {
      return res.status(400).json({ message: "Failed to fetch list of banks from paystacks's api", data: data });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch list of banks from paystacks's api" })
  }
};

//Money converter function
export const moneyConverter = (num: number): string => String(num * 100);
