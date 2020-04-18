import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import * as path from 'path';
import apolloServer from './config/graphql/graphql';
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    console.log(dotenvResult.error);
}

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// any normal apis should come here

// serving static files in express
app.use(express.static('public'));

// applying middleware
apolloServer.applyMiddleware({
    app,
    cors: true,
    path: '/graphql'
});

export default app;
