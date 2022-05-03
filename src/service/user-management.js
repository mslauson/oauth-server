import crypto from 'crypto';
import {
    GenericBadRequestException,
    GenericInternalErrorException,
} from '@mslauson/express-error-handler';
import UserModel from '../dao/UserModel';
import OAuthClientModel from '../dao/OAuthClientModel';

import {
    defaults,
    errorMessages,
    validationMessages,
} from '../constants/oauth-constants';

const createUser = async (requestBody) => {
    const newVerificationCode = crypto.randomBytes(28).toString('hex');

    try {
        return UserModel.create({
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            username: requestBody.username,
            email: requestBody.email,
            verificationCode: newVerificationCode,
            password: requestBody.password,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    } catch (e) {
        console.error(e);
        throw new GenericInternalErrorException(errorMessages.MONGO_ISSUE);
    }
};

const createClient = async (user) => {
    try {
        return OAuthClientModel.create({
            grants: defaults.GRANTS,
            user: user.id,
            clientId: crypto.randomBytes(25).toString('hex'),
            clientSecret: crypto.randomBytes(50).toString('hex'),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
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

    const user = (await createUser(requestBody)).toObject();
    if (user) {
        const newClient = (await createClient(user)).toObject();
        if (newClient) {
            return {
                success: true,
                user: { ...user },
                client: { ...newClient },
            };
        }
    }
    return { success: false };
};
