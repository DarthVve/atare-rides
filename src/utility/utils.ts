import Joi from 'joi';
import jwt from 'jsonwebtoken';

/* VALIDATION */
//Joi validation options
export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};


//Passenger registration schema
export const userSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().trim().lowercase().required(),
  phone: Joi.string().regex(/^[0-9]{11}$/).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  confirm_password: Joi.ref('password')
}).with('password', 'confirm_password')

//Login schema
export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});


//Token Generator function for login sessions
export const generateToken = (user: { [key: string]: unknown }, time: string = '7d'): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: time });
};
