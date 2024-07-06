import { model, Schema } from 'mongoose';
import { mongooseSaveError } from './hooks.js';

const sessionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId,required: true, ref: 'user' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

sessionsSchema.post('save', mongooseSaveError);

export const SessionsCollection = model('sessions', sessionsSchema);