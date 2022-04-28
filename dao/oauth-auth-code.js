import mongoosePackage from 'mongoose';

const { Schema, model } = mongoosePackage;

const OAuthCodeModel = model(
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

export default OAuthCodeModel;
