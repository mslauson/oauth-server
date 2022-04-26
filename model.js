/** @format */

import mongoosePackage from 'mongoose';
import OAuthAccessTokenModel from './dao/oauth-token.js';
import OAuthCodeModel from './dao/oauth-auth-code.js'; 
import OAuthClientModel from './dao/oauth-client.js';
const { Schema, model } = mongoosePackage;

export const getAccessToken = async (accessToken) => {

    let _accessToken = await OAuthAccessTokenModel.findOne({ accessToken: accessToken })
        .populate('user')
        .populate('client');

    if (!_accessToken) {
        return false;
    }

    _accessToken = _accessToken.toObject();

    if (!_accessToken.user) {
        _accessToken.user = {};
    }
    return _accessToken;
};

export const refreshTokenModel = (refreshToken) => {
    return OAuthAccessTokenModel.findOne({ refreshToken: refreshToken })
        .populate('user')
        .populate('client');
};

export const getAuthorizationCode = (code) => {
    return OAuthCodeModel.findOne({ authorizationCode: code })
        .populate('user')
        .populate('client');
};

export const getClient = (clientId, clientSecret) => {
    let params = { clientId: clientId };
    if (clientSecret) {
        params.clientSecret = clientSecret;
    }
    return OAuthClientModel.findOne(params);
};

export const getUser = async (username, password) => {
    let UserModel = model('User');
    let user = await UserModel.findOne({ username: username });
    if (user.validatePassword(password)) {
        return user;
    }
    return false;
};

export const getUserFromClient = (client) => {
    // let UserModel = model('User');
    // return UserModel.findById(client.user);
    return {};
};

export const saveToken = async (token, client, user) => {
    let accessToken = (await OAuthAccessTokenModel.create({
        user: user.id || null,
        client: client.id,
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
    })).toObject();

    if (!accessToken.user) {
        accessToken.user = {};
    }

    return accessToken;
};

export const saveAuthorizationCode = (code, client, user) => {
    let authCode = new OAuthCodeModel({
        user: user.id,
        client: client.id,
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        scope: code.scope
    });
    return authCode.save();
};

export const revokeToken = async (accessToken) => {
    let result = await OAuthAccessTokenModel.deleteOne({
        accessToken: accessToken
    });
    return result.deletedCount > 0;
};

export const revokeAuthorizationCode = async (code) => {
    let result = await OAuthCodeModel.deleteOne({
        authorizationCode: code.authorizationCode
    });
    return result.deletedCount > 0;
};
