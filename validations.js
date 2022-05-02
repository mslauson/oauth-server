import { GenericBadRequestException } from '@mslauson/express-error-handler';
import { request } from 'express';
import { validationMessages } from './constants/oauth-constants.js';

export const validateSignUp = (requestBody, next) => {
    const bool =
        requestBody.firstName &&
        requestBody.lastName &&
        requestBody.username &&
        requestBody.email &&
        request.password;

    if (bool) {
        const error = new GenericBadRequestException(
            validationMessages.SIGN_UP_VALIDATE
        );
        next(error);
    }
};
