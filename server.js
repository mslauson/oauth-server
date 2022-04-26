/** @format */

import bodyParser from 'body-parser';
import express from 'express';
import OAuthServer from 'express-oauth-server';
import mongoose from 'mongoose';

const { MONGO_USER, MONGO_PASS, MONGO_HOST } = process.env;

mongoose.connect(`mongodb+srv://` +
          MONGO_USER +
          `:` +
          MONGO_PASS +
          `@` +
          configService.get<string>('MONGO_HOST') +
    `/security?retryWrites=true&w=majority`)
          
var app = express();

app.oauth = new OAuthServer({
  model: {}, // See https://github.com/oauthjs/node-oauth2-server for specification
});
