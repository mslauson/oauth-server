export default OAuthClientModel = model(
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