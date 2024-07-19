import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { hashValue } from '../utils/hash.js';
import jwt from 'jsonwebtoken';

import { SMTP, TEMPLATES_DIR } from '../constans/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';
import bcrypt from 'bcrypt';
import { createSession } from './session.js';
import { SessionsCollection } from '../db/models/session.js';
import { randomBytes } from 'node:crypto';
import { setupResponseSession } from '../controllers/auth.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const registerUser = async (payload) => {
  const { password } = payload;
  const hashPassword = await hashValue(password);
  return await UsersCollection.create({ ...payload, password: hashPassword });
};

export const requestResetToken = async (email) => {
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await findUser({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await hashValue(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const loginOrSignupWithGoogle = async (req, res) => {
  const loginTicket = await validateCode(req.body.code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await findUser({ email: payload.email });
  if (!user) {
    const signupData = {
      email: payload.email,
      password: randomBytes(10),
      name: getFullNameFromGoogleTokenPayload(payload),
    };
    user = await registerUser(signupData);
  }

  const session = await createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
