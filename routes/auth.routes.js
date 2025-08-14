import { Router } from "express";
<<<<<<< HEAD
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/sign-out', signOut);
=======
import { signIn, signOut, signUp } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get('/sign-up', signUp);

authRouter.get('/sign-in', signIn);

authRouter.get('/sign-out', signOut);
>>>>>>> 54d10d84ffa7a00acc283cfbdddedcddba9a1d3f

export default authRouter;