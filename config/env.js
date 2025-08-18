import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development.local'}`});

export const {
    PORT, 
    NODE_ENV, 
    DOMAIN,
    DB_URI, 
    JWT_SECRET, 
    JWT_EXPIRES_IN,
    STRIPE_SECRET,
    STRIPE_WEBHOOK_SECRET
} = process.env;