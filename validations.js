import { GenericBadRequestException } from '@mslauson/express-error-handler';
import { validationMessages } from './constants/oauth-constants.js';

export const validateSignUp = async (requestBody) => {
    if (
        !requestBody.firstName ||
        !requestBody.lastName ||
        !requestBody.username ||
        !requestBody.email ||
        !requestBody.password
    ) {
        throw new GenericBadRequestException(
            validationMessages.SIGN_UP_VALIDATE
        );
    }
};
