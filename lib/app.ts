import Express from 'express';
import { initilalizeTaxRoutes } from './module/routes/routes';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './utils/globalErrorHandler';

export function intializeApplication() {
        const expressApplication = Express();
        const appRoutes = initilalizeTaxRoutes();
        expressApplication.use(Express.json());
        expressApplication.use(helmet());
        expressApplication.use(cors({ allowedHeaders: '*' }));
        expressApplication.use(
                rateLimit({
                        windowMs: 15 * 60 * 1000,
                        max: 100
                })
        );
        expressApplication.use('/api/v1/tax', appRoutes);

        expressApplication.use(globalErrorHandler);
        return expressApplication;
}
