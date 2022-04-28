import { request } from 'express';
import { validationMessages } from './constants/oauth-constants';

export const validateSignUp = (requestBody) => {
    if (
        !requestBody.firstName ||
        !requestBody.lastName ||
        !requestBody.username ||
        !requestBody.email ||
        !request.password
    ) {
        const error = new Error(validationMessages.SIGN_UP_VALIDATE);
        error.status = 400;
        throw error;
    }
};
