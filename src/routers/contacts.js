import { Router } from 'express';
import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts-schemas.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactsByIdController),
);
router.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
router.put(
  '/contacts/:contactId',
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);
router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
