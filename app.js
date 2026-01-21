import express from 'express';
import {PORT} from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import subscriptionPlanRouter from './routes/subscriptionPlan.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({
        verify(req, res, buf, encoding) {
            if (req.path.includes('webhook')){
                req.rawBody = buf.toString();
            }
        }
    }));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/plan', subscriptionPlanRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send("Welcome to the subscription tracker API");
})

app.listen(PORT, async () => {
    console.log(`Subscripton Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase();
})

export default app