import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';

const router = Router();

// Logging & Report generation
router.post('/log', ProgressController.createLog);
router.put('/log/:date', ProgressController.updateLog);
router.delete('/log/:date', ProgressController.deleteLog);

// Retrieval
router.get('/history', ProgressController.getHistory);
router.get('/report/:date', ProgressController.getReport);

// Settings
router.get('/settings', ProgressController.getSettings);
router.put('/settings', ProgressController.updateSettings);

// Not implemented yet:
// router.get('/analytics', ProgressController.getAnalytics);
// router.post('/report/:date/regenerate', ProgressController.regenerateReport);
// router.get('/report/:date/export', ProgressController.exportReport);
// router.post('/recommendations/:id/feedback', ProgressController.logFeedback);

export default router;
