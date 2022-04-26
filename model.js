/** @format */

import mongoosePackage from 'mongoose';
const { Schema, model } = mongoosePackage;

/**
 * Schema definitions.
 */

let OAuthAccessTokenModel = model(
  'OAuthAccessToken',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
      accessToken: { type: String },
      accessTokenExpiresAt: { type: Date },
      refreshToken: { type: String },
      refreshTokenExpiresAt: { type: Date },
      scope: { type: String },
    },
    {
      timestamps: true,
    }
  ),
  'oauth_access_tokens'
);

let OAuthClientModel = model(
  'OAuthClient',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      clientId: { type: String },
      clientSecret: { type: String },
      redirectUris: { type: Array },
      grants: { type: Array },
    },
    {
      timestamps: true,
    }
  ),
  'oauth_clients'
);

let UserModel = model(
  'User',
  new Schema(
    {
      email: { type: String, unique:true},
      firstname: { type: String },
      lastname: { type: String },
      password: { type: String },
      username: { type: String , unique:true},
      verificationCode: { type: String },
      verifiedAt: { type: Date },
    },
    {
      timestamps: true,
    }
  ),
  'user'
);

let OAuthCodeModel = model(
  'OAuthCode',
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
      authorizationCode: { type: String },
      expiresAt: { type: Date },
      scope: { type: String },
    },
    {
      timestamps: true,
    }
  ),
  'oauth_auth_codes'
);
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
