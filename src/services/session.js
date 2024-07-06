import { randomBytes } from 'crypto';

import { FIFTEEN_MINUTES, THIRTY_DAY } from '../constans/index.js';
import { SessionsCollection } from '../db/models/Session.js';

export const findSession = (filter) => SessionsCollection.findOne(filter);

export const createSession = async (userId) => {
  await SessionsCollection.deleteOne({ userId });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAY);

  return SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const deleteSession = filter => SessionsCollection.deleteOne(filter);
