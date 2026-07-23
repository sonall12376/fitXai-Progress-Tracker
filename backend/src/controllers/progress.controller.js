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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const progress_service_1 = require("../services/progress.service");
const ai_service_1 = require("../services/ai.service");
// Mock active user for demonstration. In real app, this comes from req.user (JWT auth)
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";
class ProgressController {
    // POST /api/progress/log
    static createLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const today = new Date().toISOString().split('T')[0];
                // Check for duplicate
                const existing = yield progress_service_1.ProgressService.getLogByDate(MOCK_USER_ID, today);
                if (existing) {
                    return res.status(409).json({
                        status: "fail",
                        error: "DUPLICATE_LOG",
                        message: "Today's metrics have already been recorded. Use PUT request to modify today's log."
                    });
                }
                // 1. Save Log to DB
                const log = yield progress_service_1.ProgressService.createLog(MOCK_USER_ID, data);
                // 2. Fetch Context (Historical + Profile) [Mocked for now]
                const historicalLogs = [];
                const userProfile = {};
                // 3. Generate AI Report
                let reportData;
                let reportRecord;
                try {
                    reportData = yield ai_service_1.AiService.generateReport(userProfile, historicalLogs, data);
                    reportRecord = yield progress_service_1.ProgressService.storeReport(log.id, MOCK_USER_ID, reportData);
                }
                catch (aiError) {
                    // Fallback Strategy
                    return res.status(200).json({
                        status: "partial_success",
                        message: "Log stored, but AI Analysis is temporarily unavailable due to upstream connectivity issues.",
                        data: {
                            logId: log.id,
                            date: log.log_date,
                            reportId: null,
                            report: null
                        }
                    });
                }
                // 4. Success Response
                res.status(201).json({
                    status: "success",
                    data: {
                        logId: log.id,
                        date: log.log_date,
                        reportId: reportRecord.id,
                        report: reportData
                    }
                });
            }
            catch (err) {
                res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    // PUT /api/progress/log/:date
    static updateLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.params.date;
                const existing = yield progress_service_1.ProgressService.getLogByDate(MOCK_USER_ID, date);
                if (!existing) {
                    return res.status(404).json({
                        status: "fail",
                        error: "LOG_NOT_FOUND",
                        message: "No progress log exists for the specified date to update."
                    });
                }
                const updatedLog = yield progress_service_1.ProgressService.updateLog(MOCK_USER_ID, date, req.body);
                const reportData = yield ai_service_1.AiService.generateReport({}, [], req.body);
                const reportRecord = yield progress_service_1.ProgressService.storeReport(updatedLog.id, MOCK_USER_ID, reportData);
                res.status(200).json({
                    status: "success",
                    data: {
                        logId: updatedLog.id,
                        date: updatedLog.log_date,
                        reportId: reportRecord.id,
                        report: reportData
                    }
                });
            }
            catch (err) {
                res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    // DELETE /api/progress/log/:date
    static deleteLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.params.date;
                const deleted = yield progress_service_1.ProgressService.deleteLog(MOCK_USER_ID, date);
                if (!deleted)
                    return res.status(404).json({ status: "fail" });
                res.status(200).json({
                    status: "success",
                    message: "Daily progress log and associated AI report successfully deleted."
                });
            }
            catch (err) {
                res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    // GET /api/progress/report/:date
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
                // Remove standard DB fields to match schema
                const { id, log_id, user_id, created_at, date: logDate } = report, reportData = __rest(report, ["id", "log_id", "user_id", "created_at", "date"]);
                res.status(200).json({
                    status: "success",
                    data: Object.assign({ date: logDate, reportId: id }, reportData)
                });
            }
            catch (err) {
                res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    // GET /api/progress/history
    static getHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 7;
                const offset = parseInt(req.query.offset) || 0;
                const history = yield progress_service_1.ProgressService.getHistory(MOCK_USER_ID, limit, offset);
                res.status(200).json({
                    status: "success",
                    count: history.length,
                    data: history
                });
            }
            catch (err) {
                res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    // GET /api/progress/settings
    static getSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const settings = yield progress_service_1.ProgressService.getSettings(MOCK_USER_ID);
                res.status(200).json({
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
                res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
    // PUT /api/progress/settings
    static updateSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settings = yield progress_service_1.ProgressService.updateSettings(MOCK_USER_ID, req.body);
                res.status(200).json({
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
                res.status(400).json({ status: "fail", message: err.message });
            }
        });
    }
}
exports.ProgressController = ProgressController;
