import { model, Schema } from 'mongoose';
import { mongooseSaveError } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      optional: false,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', mongooseSaveError);

export const ContactsCollection = model('contacts', contactSchema);
