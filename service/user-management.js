import UserModel from '../dao/user';
import OAuthClientModel from '../dao/oauth-client';
import crypto from 'crypto';

import { defaults } from '../constants/oauth-constants';

const createUser = async (requestBody) => {
  const newVerificationCode = crypto.randomBytes(28).toString('hex');
  const newUser = UserModel();

  newUser.firstName = requestBody.firstName;
  newUser.lastName = requestBody.lastName;
  newUser.username = requestBody.username;
  newUser.email = requestBody.email;
  newUser.verificationCode = newVerificationCode;
  newUser.password = requestBody.password;
  newUser.createdAt = new Date();
  newUser.updatedAt = new Date();

  const user = await newUser.save();
};

const createClient = async (requestBody, client) => {
  const newClient = OAuthClientModel();
  newClient.grants = defaults.grants;
  newClient.user = client._id;
  newClient.clientId = crypto.randomBytes(25).toString('hex');
  newClient.clientSecret = crypto.randomBytes(50).toString('hex');
  newClient.createdAt = new Date();
  newClient.updatedAt = new Date();
};

export const signUp = async (requestBody) => {
  const user = createUser(requestBody);
  const newClient = createClient(requestBody, client);
  return { success: true };
};
