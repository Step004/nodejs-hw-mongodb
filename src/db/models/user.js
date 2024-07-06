import { model, Schema } from 'mongoose';
import { mongooseSaveError } from './hooks.js';
import { emailRegexp } from '../../constans/users-constants.js';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
        email: { type: String, match: emailRegexp, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.post("save", mongooseSaveError);

export const UsersCollection = model('users', usersSchema);
