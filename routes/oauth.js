import express from 'express'
import OauthServer from 'express-oauth-server'
import mongoose from 'mongoose'
import * as model from '../model.js'

const router = express.Router()

const oauth = new OauthServer({
    model,
    debug: true,
})

router.post(
    '/api/oauth/v1/token',
    oauth.token({
        requireClientAuthentication: {
            refresh_token: false,
        },
    })
)

router.get('/api/oauth/v1/authenticate', async (req, res) => {
    return res.render('authenticate')
})

router.post(
    '/api/oauth/v1/authenticate',
    async (req, res, next) => {
        const UserModel = mongoose.model('User')
        req.body.user = await UserModel.findOne({ username: req.body.username })

        return next()
    },
    oauth.authorize({
        authenticateHandler: {
            handle: (req) => {
                return req.body.user
            },
        },
    })
)

export default router
