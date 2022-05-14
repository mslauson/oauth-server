import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import OauthRouter from './router/oauth-router';

import { register } from './controller/oauth-controller';

const { MONGO_USER, MONGO_PWORD, MONGO_HOST, PORT } = process.env;

mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PWORD}@${MONGO_HOST}/security?retryWrites=true&w=majority`
);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(OauthRouter);

app.post('/api/oauth/v1/register', register);
app.get('/api/oauth', () => {
    return 'healthy';
}));
app.get('/', () => {
    return 'healthy';
}));

app.listen(PORT || 8080);
