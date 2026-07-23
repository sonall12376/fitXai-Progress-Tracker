"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const progress_service_1 = require("../services/progress.service");
// Mock active user for demonstration. In real app, this comes from req.user (JWT auth)
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";
/**
 * Controller handling HTTP requests for the Progress Tracker feature.
 * Delegates all business logic, AI orchestration, and database operations to ProgressService.
 */
class ProgressController {
    /**
     * POST /api/progress/log
     * Submits daily progress metrics, fetches historical context, generates AI report, and returns response.
     */
    static createLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("CREATE LOG CONTROLLER HIT");
            console.log(req.body);
            try {
                const result = yield progress_service_1.ProgressService.processCreateLog(MOCK_USER_ID, req.body);
                return res.status(201).json({
                    status: "success",
                    data: result
                });
            }
            catch (err) {
                console.error("CREATE LOG ERROR:", err);
                return res.status(400).json({
                    status: "fail",
                    message: (err === null || err === void 0 ? void 0 : err.message) || "Unknown Error",
                    error: err
                });
            }
            // catch (err: any) {
            //   if (err.code === 'DUPLICATE_LOG' || err.statusCode === 409) {
            //     return res.status(409).json({
            //       status: "fail",
            //       error: "DUPLICATE_LOG",
            //       message: err.message
            //     });
            //   }
            //   return res.status(400).json({ status: "fail", message: err.message });
            // }
        });
    }
    /**
     * PUT /api/progress/log/:date
     * Updates daily metrics for a specific date and regenerates the AI report.
     */
    static updateLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.params.date;
                const result = yield progress_service_1.ProgressService.processUpdateLog(MOCK_USER_ID, date, req.body);
                return res.status(200).json({
                    status: "success",
                    data: result
                });
            }
            catch (err) {
                if (err.code === 'LOG_NOT_FOUND' || err.statusCode === 404) {
                    return res.status(404).json({
                        status: "fail",
                        error: "LOG_NOT_FOUND",
                        message: err.message
                    });
                }
                return res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    /**
     * DELETE /api/progress/log/:date
     * Deletes a progress log and its associated AI report.
     */
    static deleteLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.params.date;
                const deleted = yield progress_service_1.ProgressService.deleteLog(MOCK_USER_ID, date);
                if (!deleted) {
                    return res.status(404).json({
                        status: "fail",
                        error: "LOG_NOT_FOUND",
                        message: "No progress log exists for the specified date to delete."
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Daily progress log and associated AI report successfully deleted."
                });
            }
            catch (err) {
                return res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    /**
     * GET /api/progress/report/:date
     * Retrieves the AI report for a specific calendar date.
     */
    static getReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.params.date;
                const report = yield progress_service_1.ProgressService.getReportByDate(MOCK_USER_ID, date);
                if (!report) {
                    return res.status(404).json({
                        status: "fail",
                        error: "REPORT_NOT_FOUND",
                        message: "No progress report found for the requested date"
                    });
                }
                return res.status(200).json({
                    status: "success",
                    data: report
                });
            }
            catch (err) {
                return res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    /**
     * GET /api/progress/history
     * Retrieves historical logs and embedded AI reports for dashboard timeline.
     */
    static getHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 7;
                const offset = parseInt(req.query.offset) || 0;
                const history = yield progress_service_1.ProgressService.getHistory(MOCK_USER_ID, limit, offset);
                return res.status(200).json({
                    status: "success",
                    count: history.length,
                    data: history
                });
            }
            catch (err) {
                return res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    /**
     * GET /api/progress/settings
     * Retrieves active user's AI coaching configuration settings.
     */
    static getSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const settings = yield progress_service_1.ProgressService.getSettings(MOCK_USER_ID);
                return res.status(200).json({
                    status: "success",
                    data: {
                        coachPersona: (settings === null || settings === void 0 ? void 0 : settings.coach_persona) || 'Motivational',
                        enableSafetyAlerts: (_a = settings === null || settings === void 0 ? void 0 : settings.enable_safety_alerts) !== null && _a !== void 0 ? _a : true,
                        priorityFocus: (settings === null || settings === void 0 ? void 0 : settings.priority_focus) || [],
                        weeklySummaryOptIn: (_b = settings === null || settings === void 0 ? void 0 : settings.weekly_summary_opt_in) !== null && _b !== void 0 ? _b : true
                    }
                });
            }
            catch (err) {
                return res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    /**
     * PUT /api/progress/settings
     * Updates active user's AI coaching preferences.
     */
    static updateSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settings = yield progress_service_1.ProgressService.updateSettings(MOCK_USER_ID, req.body);
                return res.status(200).json({
                    status: "success",
                    data: {
                        coachPersona: settings.coach_persona,
                        enableSafetyAlerts: settings.enable_safety_alerts,
                        priorityFocus: settings.priority_focus,
                        weeklySummaryOptIn: settings.weekly_summary_opt_in
                    }
                });
            }
            catch (err) {
                return res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
}
exports.ProgressController = ProgressController;
