import { UsersCollection } from '../db/models/user.js';
import { hashValue } from '../utils/hash.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const registerUser = async (payload) => {
    const { password } = payload;
    const hashPassword = await hashValue(password);
  return await UsersCollection.create({...payload, password: hashPassword});
};
