/** @format */

import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import oauthRoutes from './routes/oauth.js'

const { MONGO_USER, MONGO_PWORD, MONGO_HOST, PORT } = process.env;

mongoose.connect(`mongodb+srv://` +
          MONGO_USER +
          `:` +
          MONGO_PWORD +
          `@` +
          MONGO_HOST +
    `/security?retryWrites=true&w=majority`)
          
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(oauthRoutes);

app.listen(PORT || 8080);
