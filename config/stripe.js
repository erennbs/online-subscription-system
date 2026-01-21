import {createRequire} from 'module';
import { STRIPE_SECRET } from './env.js';
const require = createRequire(import.meta.url);
const stripe = require('stripe')(STRIPE_SECRET);

export {stripe};