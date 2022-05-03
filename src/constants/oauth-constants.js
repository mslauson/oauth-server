export const defaults = Object.freeze({
    GRANTS: [
        'authorization_code',
        'client_credentials',
        'refresh_token',
        'password',
    ],
});

export const validationMessages = Object.freeze({
    SIGN_UP_VALIDATE:
        'Required parameters are firstName, lastName, username, email, and password',
    USER_EXISTS: 'The given email and or username is already taken',
});

export const errorMessages = Object.freeze({
    MONGO_ISSUE: 'There were issues with connecting to the mongo database',
});
