import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import businessRoutes from './modules/businesses/business.routes';
import profileRoutes from './modules/profiles/profile.routes';
import messagingRoutes from './modules/messaging/messaging.routes';
import chatRoutes from './modules/chat/chat.routes';
import preferencesRoutes from './modules/preferences/preferences.routes';
import integrationRoutes from './modules/integrations/integration.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/businesses', businessRoutes);
router.use('/profiles', profileRoutes);
router.use('/messaging', messagingRoutes);
router.use('/chat', chatRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/integrations', integrationRoutes);

export default router;
