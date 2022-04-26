/** @format */

import bodyParser from 'body-parser';
import express from 'express';
import OauthServer from 'express-oauth-server';
import mongoose from 'mongoose';
import * as model from './model.js';

const { MONGO_USER, MONGO_PWORD, MONGO_HOST } = process.env;

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

app.oauth = new OAuth2Server({
  model: model
});

app.all('/oauth/token', obtainToken);

app.get('/', authenticateRequest, function (req, res) {
  res.send('Congratulations, you are in a secret area!');
});

app.listen(3000);

function obtainToken(req, res) {
  var request = new Request(req);
  var response = new Response(res);

  return app.oauth
    .token(request, response)
    .then(function (token) {
      res.json(token);
    })
    .catch(function (err) {
      res.status(err.code || 500).json(err);
    });
}

function authenticateRequest(req, res, next) {
  var request = new Request(req);
  var response = new Response(res);

  return app.oauth
    .authenticate(request, response)
    .then(function (token) {
      next();
    })
    .catch(function (err) {
      res.status(err.code || 500).json(err);
    });
}