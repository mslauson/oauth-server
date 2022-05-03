import { genericHandler } from '@mslauson/express-error-handler';
import { validateSignUp } from '../validations';
import { signUp } from '../service/user-management';

export const register = genericHandler(async (req) => {
    const request = req.body;
    await validateSignUp(request);
    return signUp(request);
});
