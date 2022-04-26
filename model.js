/** @format */

import mongoosePackage from 'mongoose';
const { Schema, model } = mongoosePackage;

/**
 * Schema definitions.
 */

let OAuthAccessTokenModel = mongoose.model(
  'OAuthAccessToken',
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' },
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

let OAuthClientModel = mongoose.model(
  'OAuthClient',
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

let UserModel = mongoose.model(
  'User',
  new mongoose.Schema(
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

let OAuthCodeModel = mongoose.model(
  'OAuthCode',
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      client: { type: mongoose.Schema.Types.ObjectId, ref: 'OAuthClient' },
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
/**
 * Get access token.
 */

export function getAccessToken(bearerToken) {
  // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
  return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
}

/**
 * Get client.
 */

export function getClient(clientId, clientSecret) {
  return OAuthClientsModel.findOne({
    clientId: clientId,
    clientSecret: clientSecret,
  }).lean();
}

/**
 * Get refresh token.
 */

export function getRefreshToken(refreshToken) {
  return OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
}

/**
 * Get user.
 */

export function getUser(username, password) {
  return OAuthUsersModel.findOne({
    username: username,
    password: password,
  }).lean();
}

/**
 * Save token.
 */

export function saveToken(token, client, user) {
  var accessToken = new OAuthTokensModel({
    accessToken: token.accessToken,
    accessTokenExpiresOn: token.accessTokenExpiresOn,
    client: client,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresOn: token.refreshTokenExpiresOn,
    user: user,
    userId: user._id,
  });
  // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
  return new Promise(function (resolve, reject) {
    accessToken.save(function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  }).then(function (saveResult) {
    // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
    saveResult =
      saveResult && typeof saveResult == 'object'
        ? saveResult.toJSON()
        : saveResult;

    // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
    var data = new Object();
    for (var prop in saveResult) data[prop] = saveResult[prop];

    // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
    data.client = data.clientId;
    data.user = data.userId;

    return data;
  });
}
