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
});
