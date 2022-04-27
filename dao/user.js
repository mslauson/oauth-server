import mongoosePackage from 'mongoose'

const { Schema, model } = mongoosePackage

const UserModel = model(
    'User',
    new Schema(
        {
            email: { type: String, unique: true },
            firstname: { type: String },
            lastname: { type: String },
            password: { type: String },
            username: { type: String, unique: true },
            verificationCode: { type: String },
            verifiedAt: { type: Date },
        },
        {
            timestamps: true,
        }
    ),
    'user'
)

export default UserModel
