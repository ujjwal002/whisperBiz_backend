import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './utils/errorHandler';
import { rateLimiterMiddleware } from './middlewares/rateLimit.middleware';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

// global rate limiter
app.use(rateLimiterMiddleware);

// register routes
app.use('/api', routes);

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

export default app;
