import mongoosePackage from 'mongoose'

const { Schema, model } = mongoosePackage

const OAuthAccessTokenModel = model(
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
)

export default OAuthAccessTokenModel
