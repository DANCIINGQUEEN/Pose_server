import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

export const setupSecurity = (app) => {
    app.use(helmet());
    app.use(cors())
    const limiter=rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 100,
    })
    app.use(limiter);
    app.use(hpp());
}