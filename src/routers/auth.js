import { Router } from "express";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userSignInSchema, userSignUpSchema } from "../validation/user-schemas.js";
import { loginController, logoutController, refreshController, userSignUpController } from "../controllers/auth.js";

const authRouter = Router();

authRouter.post('/auth/register', validateBody(userSignUpSchema), ctrlWrapper(userSignUpController));
authRouter.post(
  '/auth/login',
  validateBody(userSignInSchema),
  ctrlWrapper(loginController),
);

authRouter.post("/auth/refresh", ctrlWrapper(refreshController));

authRouter.post('/auth/logout', ctrlWrapper(logoutController));


export default authRouter;