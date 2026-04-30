import { Router } from 'express';
import healthCheck from './health-check.js';
import mpesaRouter from './mpesa.js';
import adminRouter from './admin.js';
import membersRouter from './members.js';
import staffRouter from './staff.js';
import loanManagementRouter from './loan-management.js';

const router = Router();

export default () => {
    router.get('/', (req, res) => {
        console.log('Root route called');
        res.json({
            message: 'HACRO Labs API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                mpesa: '/mpesa/*',
                admin: '/admin/*',
                members: '/members/*',
                staff: '/staff'
            }
        });
    });
    router.get('/health', healthCheck);
    router.use('/mpesa', mpesaRouter);
    router.use('/admin', adminRouter);
    router.use('/members', membersRouter);
    router.use('/staff', staffRouter);
    router.use('/admin', loanManagementRouter);

    return router;
};
