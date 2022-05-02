import { Router } from 'express';
import OauthServer from 'express-oauth-server';
import mongoose from 'mongoose';
import * as model from '../model';

const OauthRouter = Router();

export const oauth = new OauthServer({
    model,
    debug: true,
});

OauthRouter.post(
    '/api/oauth/v1/token',
    oauth.token({
        requireClientAuthentication: {
            refresh_token: false,
        },
    })
);

OauthRouter.get('/api/oauth/v1/authenticate', async (req, res) => {
    return res.render('authenticate');
});

OauthRouter.post(
    '/api/oauth/v1/authenticate',
    async (req, res, next) => {
        const UserModel = mongoose.model('User');
        req.body.user = await UserModel.findOne({
            username: req.body.username,
        });

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

export default OauthRouter;