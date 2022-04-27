import OAuthAccessTokenModel from './dao/oauth-token.js'
import OAuthCodeModel from './dao/oauth-auth-code.js'
import OAuthClientModel from './dao/oauth-client.js'
import UserModel from './dao/user.js'

export const getAccessToken = async (accessToken) => {
    let token = await OAuthAccessTokenModel.findOne({
        accessToken,
    })
        .populate('user')
        .populate('client')

    if (!token) {
        return false
    }

    token = token.toObject()

    if (!token.user) {
        token.user = {}
    }
    return token
}

export const refreshTokenModel = (refreshToken) => {
    return OAuthAccessTokenModel.findOne({ refreshToken })
        .populate('user')
        .populate('client')
}

export const getAuthorizationCode = (code) => {
    return OAuthCodeModel.findOne({ authorizationCode: code })
        .populate('user')
        .populate('client')
}

export const getClient = (clientId, clientSecret) => {
    const params = { clientId }
    if (clientSecret) {
        params.clientSecret = clientSecret
    }
    return OAuthClientModel.findOne(params)
}

export const getUser = async (username, password) => {
    const user = await UserModel.findOne({ username })
    if (user.validatePassword(password)) {
        return user
    }
    return false
}

export const getUserFromClient = (client) => {
    return UserModel.findById(client.user)
}

export const saveToken = async (token, client, user) => {
    const accessToken = (
        await OAuthAccessTokenModel.create({
            user: user.id || null,
            client: client.id,
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
        })
    ).toObject()

    if (!accessToken.user) {
        accessToken.user = {}
    }

    return accessToken
}

export const saveAuthorizationCode = (code, client, user) => {
    const authCode = new OAuthCodeModel({
        user: user.id,
        client: client.id,
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        scope: code.scope,
    })
    return authCode.save()
}

export const revokeToken = async (accessToken) => {
    const result = await OAuthAccessTokenModel.deleteOne({
        accessToken,
    })
    return result.deletedCount > 0
}

export const revokeAuthorizationCode = async (code) => {
    const result = await OAuthCodeModel.deleteOne({
        authorizationCode: code.authorizationCode,
    })
    return result.deletedCount > 0
}
