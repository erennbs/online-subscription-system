import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

userRouter.post('/', (req, res) => {})

userRouter.put('/:id', (req, res) => {})

userRouter.delete('/:id', (req, res) => {})

export default userRouter;