import { Router } from "express";

const authRouter = Router();

authRouter.get('/sign-up', (req, res) => {
    res.send({message: 'sign up'})
})

authRouter.get('/sign-in', (req, res) => {
    res.send({message: 'sign in'})
})

authRouter.get('/sign-out', (req, res) => {
    res.send({message: 'sign out'})
})

export default authRouter;