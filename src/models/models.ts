export interface Passenger {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  home_address: string;
  work_address: string;
  verified: boolean;
  wallet: number;
  password: string;
};


export interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  home_address: string;
  verified: boolean;
  wallet: number;
  password: string;
};


export interface Trip {
  id: string;
  driver: string;
  passenger: string;
  location: JSON;
  destination: JSON;
  fair: JSON;
  distance: number;
};


export interface Payment {
  id: string;
  type: string;
  amount: number;
  beneficiary: string;
  status: string;
  time: string;
  date: string;
  reference: string;
};
