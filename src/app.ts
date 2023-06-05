import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import DataBaseInitialization, { databaseCleanUp } from './database/knex';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import tripsRouter from './routes/trips';
import paymentsRouter from './routes/payments';

DataBaseInitialization().then(() => console.log('Database initialized successfully'));
// databaseCleanUp().then(() => console.log('Database cleaned up successfully'));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trips', tripsRouter);
app.use('/payments', paymentsRouter);


export default app;
