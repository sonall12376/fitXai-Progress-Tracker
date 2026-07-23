"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("../controllers/progress.controller");
const router = (0, express_1.Router)();
// Logging & Report generation
router.post('/log', progress_controller_1.ProgressController.createLog);
router.put('/log/:date', progress_controller_1.ProgressController.updateLog);
router.delete('/log/:date', progress_controller_1.ProgressController.deleteLog);
// Retrieval
router.get('/history', progress_controller_1.ProgressController.getHistory);
router.get('/report/:date', progress_controller_1.ProgressController.getReport);
// Settings
router.get('/settings', progress_controller_1.ProgressController.getSettings);
router.put('/settings', progress_controller_1.ProgressController.updateSettings);
// Not implemented yet:
// router.get('/analytics', ProgressController.getAnalytics);
// router.post('/report/:date/regenerate', ProgressController.regenerateReport);
// router.get('/report/:date/export', ProgressController.exportReport);
// router.post('/recommendations/:id/feedback', ProgressController.logFeedback);
exports.default = router;
