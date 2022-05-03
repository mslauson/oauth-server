import crypto from 'crypto';
import UserModel from '../dao/UserModel';
import OAuthClientModel from '../dao/OAuthClientModel';

import { defaults, errorMessages, validationMessages } from '../constants/oauth-constants';
import { GenericBadRequestException, GenericInternalErrorException } from '@mslauson/express-error-handler';

const createUser = async (requestBody) => {
    const newVerificationCode = crypto.randomBytes(28).toString('hex');
    const newUser = new UserModel();

    newUser.firstName = requestBody.firstName;
    newUser.lastName = requestBody.lastName;
    newUser.username = requestBody.username;
    newUser.email = requestBody.email;
    newUser.verificationCode = newVerificationCode;
    newUser.password = requestBody.password;
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    try {

        return newUser.create();
    } catch (e) {
        console.error(e);
        throw new GenericInternalErrorException(errorMessages.MONGO_ISSUE);
    }
};

const createClient = async (user) => {
    const newClient = new OAuthClientModel();
    newClient.grants = defaults.GRANTS;
    newClient.user = user.id;
    newClient.clientId = crypto.randomBytes(25).toString('hex');
    newClient.clientSecret = crypto.randomBytes(50).toString('hex');
    newClient.createdAt = new Date();
    newClient.updatedAt = new Date();
    try {
        return await newClient.create();
    } catch (error) {
        console.error(error);
        throw new GenericInternalErrorException(errorMessages.MONGO_ISSUE);
    }
};

export const signUp = async (requestBody) => {
    const existingUser = await UserModel.findOne({ email: requestBody.email });

    if (existingUser) {
        throw new GenericBadRequestException(validationMessages.USER_EXISTS);
    }

    const user = createUser(requestBody);
    if (user) {
        const newClient = createClient(user);
        if (newClient) {
            return { success: true };
        }
    }
    return { success: false };
};
