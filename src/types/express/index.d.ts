import { JwtPayload } from "jsonwebtoken";

import { Passenger, Driver } from "../../models/models";

declare global {
  namespace Express {
    export interface Request {
      user?: string | JwtPayload;
    }
  }
}
