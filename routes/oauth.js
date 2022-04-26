/** @format */

import express from 'express';
import OauthServer from 'express-oauth-server';
import mongoose from 'mongoose';
import * as model from '../model.js';

const router = express.Router();


let oauth = new OauthServer({
  model: model,
  debug: true,
});

router.post(
  '/api/v1/oauth/token',
  oauth.token({
    requireClientAuthentication: {
      authorization_code: false,
      refresh_token: false,
    },
  })
);

router.get('/api/v1/oauth/authenticate', async (req, res, next) => {
  return res.render('authenticate');
});

router.post(
  '/api/v1/oauth/authenticate',
  async (req, res, next) => {
    let UserModel = mongoose.model('User');
    req.body.user = await UserModel.findOne({ username: req.body.username });

    return next();
  },
  oauth.authorize({
    authenticateHandler: {
      handle: (req) => {
        return req.body.user;
      },
    },
  })
);

export default router;
