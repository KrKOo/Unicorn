import express from 'express'
import http from 'http'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import socketIO from 'socket.io'

//ROUTES
import indexRouter from './routes/index'
import usersRouter from './routes/users'

//MODULES
import sockets from './modules/sockets'

const app = express();
const server = http.createServer(app)
const io = sockets(socketIO(server));

const port = 8000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

server.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app;
