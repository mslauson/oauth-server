import { EncryptionUtility } from '@mslauson/node-encryption-util';

const encryptionUtility = new EncryptionUtility();

export const encryptUserModel = (model) => {
    return {
        firstName: encryptionUtility.encrypt(model.firstName),
        lastName: encryptionUtility.encrypt(model.lastName),
        username: encryptionUtility.encrypt(model.username),
        email: encryptionUtility.encrypt(model.email),
        verificationCode: encryptionUtility.encrypt(model.verificationCode),
        password: encryptionUtility.encrypt(model.password),
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
    };
};

export const decryptUserModel = (model) => {
    return {
        firstName: encryptionUtility.decrypt(model.firstName),
        lastName: encryptionUtility.decrypt(model.lastName),
        username: encryptionUtility.decrypt(model.username),
        email: encryptionUtility.decrypt(model.email),
        verificationCode: encryptionUtility.decrypt(model.verificationCode),
        password: model.password,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
    };
};
