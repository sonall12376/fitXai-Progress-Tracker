import { Request, Response } from 'express';
import { ProgressService } from '../services/progress.service';
import { AiService } from '../services/ai.service';

// Mock active user for demonstration. In real app, this comes from req.user (JWT auth)
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

export class ProgressController {
  
  // POST /api/progress/log
  static async createLog(req: Request, res: Response) {
    try {
      const data = req.body;
      const today = new Date().toISOString().split('T')[0];
      
      // Check for duplicate
      const existing = await ProgressService.getLogByDate(MOCK_USER_ID, today);
      if (existing) {
        return res.status(409).json({
          status: "fail",
          error: "DUPLICATE_LOG",
          message: "Today's metrics have already been recorded. Use PUT request to modify today's log."
        });
      }

      // 1. Save Log to DB
      const log = await ProgressService.createLog(MOCK_USER_ID, data);

      // 2. Fetch Context (Historical + Profile) [Mocked for now]
      const historicalLogs: any[] = []; 
      const userProfile = {};

      // 3. Generate AI Report
      let reportData;
      let reportRecord;
      try {
        reportData = await AiService.generateReport(userProfile, historicalLogs, data);
        reportRecord = await ProgressService.storeReport(log.id, MOCK_USER_ID, reportData);
      } catch (aiError) {
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
    } catch (err: any) {
        res.status(400).json({ status: "fail", message: err.message });
    }
  }

  // PUT /api/progress/log/:date
  static async updateLog(req: Request, res: Response) {
    try {
      const date = req.params.date as string;
      const existing = await ProgressService.getLogByDate(MOCK_USER_ID, date);
      if (!existing) {
        return res.status(404).json({
            status: "fail",
            error: "LOG_NOT_FOUND",
            message: "No progress log exists for the specified date to update."
        });
      }

      const updatedLog = await ProgressService.updateLog(MOCK_USER_ID, date, req.body);
      const reportData = await AiService.generateReport({}, [], req.body);
      const reportRecord = await ProgressService.storeReport(updatedLog.id, MOCK_USER_ID, reportData);

      res.status(200).json({
        status: "success",
        data: {
          logId: updatedLog.id,
          date: updatedLog.log_date,
          reportId: reportRecord.id,
          report: reportData
        }
      });
    } catch (err: any) {
        res.status(400).json({ status: "fail", message: err.message });
    }
  }

  // DELETE /api/progress/log/:date
  static async deleteLog(req: Request, res: Response) {
    try {
      const date = req.params.date as string;
      const deleted = await ProgressService.deleteLog(MOCK_USER_ID, date);
      if (!deleted) return res.status(404).json({ status: "fail" });
      
      res.status(200).json({
          status: "success",
          message: "Daily progress log and associated AI report successfully deleted."
      });
    } catch (err: any) {
        res.status(400).json({ status: "fail", message: err.message });
    }
  }

  // GET /api/progress/report/:date
  static async getReport(req: Request, res: Response) {
    try {
        const date = req.params.date as string;
        const report = await ProgressService.getReportByDate(MOCK_USER_ID, date);
        if (!report) {
            return res.status(404).json({
                status: "fail",
                error: "REPORT_NOT_FOUND",
                message: "No progress report found for the requested date"
            });
        }
        
        // Remove standard DB fields to match schema
        const { id, log_id, user_id, created_at, date: logDate, ...reportData } = report;
        
        res.status(200).json({
            status: "success",
            data: {
                date: logDate,
                reportId: id,
                ...reportData
            }
        });
    } catch (err: any) {
        res.status(400).json({ status: "fail", message: err.message });
    }
  }
  
  // GET /api/progress/history
  static async getHistory(req: Request, res: Response) {
      try {
          const limit = parseInt(req.query.limit as string) || 7;
          const offset = parseInt(req.query.offset as string) || 0;
          const history = await ProgressService.getHistory(MOCK_USER_ID, limit, offset);
          
          res.status(200).json({
              status: "success",
              count: history.length,
              data: history
          });
      } catch (err: any) {
          res.status(400).json({ status: "fail", message: err.message });
      }
  }
  
  // GET /api/progress/settings
  static async getSettings(req: Request, res: Response) {
      try {
          const settings = await ProgressService.getSettings(MOCK_USER_ID);
          res.status(200).json({
              status: "success",
              data: {
                  coachPersona: settings?.coach_persona || 'Motivational',
                  enableSafetyAlerts: settings?.enable_safety_alerts ?? true,
                  priorityFocus: settings?.priority_focus || [],
                  weeklySummaryOptIn: settings?.weekly_summary_opt_in ?? true
              }
          });
      } catch (err: any) {
          res.status(400).json({ status: "fail", message: err.message });
      }
  }
  
  // PUT /api/progress/settings
  static async updateSettings(req: Request, res: Response) {
      try {
          const settings = await ProgressService.updateSettings(MOCK_USER_ID, req.body);
          res.status(200).json({
              status: "success",
              data: {
                  coachPersona: settings.coach_persona,
                  enableSafetyAlerts: settings.enable_safety_alerts,
                  priorityFocus: settings.priority_focus,
                  weeklySummaryOptIn: settings.weekly_summary_opt_in
              }
          });
      } catch (err: any) {
          res.status(400).json({ status: "fail", message: err.message });
      }
  }
}
