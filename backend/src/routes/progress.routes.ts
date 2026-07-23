import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { validateRequest, logSchema } from '../middleware/validation.middleware';

const router = Router();

// Logging & Report generation
router.post('/log', validateRequest(logSchema), ProgressController.createLog);
router.put('/log/:date', validateRequest(logSchema), ProgressController.updateLog);
router.delete('/log/:date', ProgressController.deleteLog);

// Retrieval
router.get('/history', ProgressController.getHistory);
router.get('/report/:date', ProgressController.getReport);

// Settings
router.get('/settings', ProgressController.getSettings);
router.put('/settings', ProgressController.updateSettings);

// Advanced Endpoints
router.get('/analytics', ProgressController.getAnalytics);
router.post('/report/:date/regenerate', ProgressController.regenerateReport);
router.get('/report/:date/export', ProgressController.exportReport);
router.post('/recommendations/:id/feedback', ProgressController.submitFeedback);

export default router;
