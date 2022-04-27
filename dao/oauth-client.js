import mongoosePackage from 'mongoose'

const { Schema, model } = mongoosePackage

const OAuthClientModel = model(
    'OAuthClient',
    new Schema(
        {
            id: { type: Schema.Types.ObjectId },
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
)

export default OAuthClientModel
