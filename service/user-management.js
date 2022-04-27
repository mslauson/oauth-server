import crypto from 'crypto'
import UserModel from '../dao/user.js'
import OAuthClientModel from '../dao/oauth-client.js'

import { defaults } from '../constants/oauth-constants.js'

const createUser = async (requestBody) => {
    const newVerificationCode = crypto.randomBytes(28).toString('hex')
    const newUser = UserModel()

    newUser.firstName = requestBody.firstName
    newUser.lastName = requestBody.lastName
    newUser.username = requestBody.username
    newUser.email = requestBody.email
    newUser.verificationCode = newVerificationCode
    newUser.password = requestBody.password
    newUser.createdAt = new Date()
    newUser.updatedAt = new Date()

    const user = (await newUser.create()).toObject()
    return user
}

const createClient = async (user) => {
    const newClient = OAuthClientModel()
    newClient.grants = defaults.grants
    newClient.user = user.id
    newClient.clientId = crypto.randomBytes(25).toString('hex')
    newClient.clientSecret = crypto.randomBytes(50).toString('hex')
    newClient.createdAt = new Date()
    newClient.updatedAt = new Date()
    let client
    try {
        client = (await newClient.create()).toObject()
    } catch (error) {
        console.error(error)
    }
    return client
}

export const signUp = async (requestBody) => {
    const user = createUser(requestBody)
    const newClient = createClient(user)
    if (newClient) {
        return { success: true }
    }

    return { success: false }
}
