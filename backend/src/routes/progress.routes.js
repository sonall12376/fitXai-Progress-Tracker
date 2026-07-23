"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("../controllers/progress.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
// Logging & Report generation
router.post('/log', (0, validation_middleware_1.validateRequest)(validation_middleware_1.logSchema), progress_controller_1.ProgressController.createLog);
router.put('/log/:date', (0, validation_middleware_1.validateRequest)(validation_middleware_1.logSchema), progress_controller_1.ProgressController.updateLog);
router.delete('/log/:date', progress_controller_1.ProgressController.deleteLog);
// Retrieval
router.get('/history', progress_controller_1.ProgressController.getHistory);
router.get('/report/:date', progress_controller_1.ProgressController.getReport);
// Settings
router.get('/settings', progress_controller_1.ProgressController.getSettings);
router.put('/settings', progress_controller_1.ProgressController.updateSettings);
// Advanced Endpoints
router.get('/analytics', progress_controller_1.ProgressController.getAnalytics);
router.post('/report/:date/regenerate', progress_controller_1.ProgressController.regenerateReport);
router.get('/report/:date/export', progress_controller_1.ProgressController.exportReport);
router.post('/recommendations/:id/feedback', progress_controller_1.ProgressController.submitFeedback);
exports.default = router;
