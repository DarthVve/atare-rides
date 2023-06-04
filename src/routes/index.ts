import { NextFunction, Response } from "express";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.json({ app: 'Atare Rides API' });
});

export default router;
