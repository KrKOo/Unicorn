import express from 'express'
import http from 'http'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import socketIO from 'socket.io'
//import dotenv from 'dotenv'

require('dotenv').config({ path: ".env" });

//ROUTES
import indexRouter from './routes/index'
import usersRouter from './routes/users'
import authRouter from './routes/auth'
import mapRouter from './routes/map'
//MODULES
import sockets from './modules/sockets'

import SocketManager from './modules/SocketManager';

//dotenv.config();

const app = express();
const server = http.createServer(app)

const socket = new SocketManager(socketIO(server));

const port = 9000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/map', mapRouter);


server.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app;
