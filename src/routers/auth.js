import { Router } from "express";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  userSignInSchema,
  userSignUpSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/user-schemas.js';
import {
  loginController,
  logoutController,
  refreshController,
  userSignUpController,
  requestResetEmailController,
  resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/auth/register', validateBody(userSignUpSchema), ctrlWrapper(userSignUpController));
authRouter.post(
  '/auth/login',
  validateBody(userSignInSchema),
  ctrlWrapper(loginController),
);

authRouter.post("/auth/refresh", ctrlWrapper(refreshController));

authRouter.post('/auth/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/auth/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
authRouter.post(
  '/auth/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.get('/auth/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

authRouter.post(
  '/auth/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);
export default authRouter;