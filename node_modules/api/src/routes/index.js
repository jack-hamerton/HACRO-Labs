import { Router } from 'express';
import healthCheck from './health-check.js';
import mpesaRouter from './mpesa.js';
import adminRouter from './admin.js';
import loanManagementRouter from './loan-management.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/mpesa', mpesaRouter);
    router.use('/admin', adminRouter);
    router.use('/admin', loanManagementRouter);

    return router;
};