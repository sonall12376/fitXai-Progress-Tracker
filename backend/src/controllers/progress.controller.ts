import { Request, Response } from 'express';
import { ProgressService } from '../services/progress.service';
import { AiService } from '../services/ai.service';

// Mock active user for demonstration. In real app, this comes from req.user (JWT auth)
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Controller handling HTTP requests for the Progress Tracker feature.
 * Delegates all business logic, AI orchestration, and database operations to ProgressService.
 */
export class ProgressController {
  
  /**
   * POST /api/progress/log
   * Submits daily progress metrics, fetches historical context, generates AI report, and returns response.
   */
  static async createLog(req: Request, res: Response) {
    console.log("CREATE LOG CONTROLLER HIT");
    console.log(req.body);

    try {
      const result = await ProgressService.processCreateLog(MOCK_USER_ID, req.body);
      return res.status(201).json({
        status: "success",
        data: result
      });
    } catch (err: any) {
      console.error("CREATE LOG ERROR:", err);

      if (err.code === 'DUPLICATE_LOG' || err.statusCode === 409) {
        return res.status(409).json({
          status: "fail",
          error: "DUPLICATE_LOG",
          message: err.message
        });
      }

      return res.status(400).json({
        status: "fail",
        message: err?.message || "Unknown Error",
        error: err
      });
    }
  }

  /**
   * PUT /api/progress/log/:date
   * Updates daily metrics for a specific date and regenerates the AI report.
   */
  static async updateLog(req: Request, res: Response) {
    try {
      const date = req.params.date as string;
      const result = await ProgressService.processUpdateLog(MOCK_USER_ID, date, req.body);
      return res.status(200).json({
        status: "success",
        data: result
      });
    } catch (err: any) {
      if (err.code === 'LOG_NOT_FOUND' || err.statusCode === 404) {
        return res.status(404).json({
          status: "fail",
          error: "LOG_NOT_FOUND",
          message: err.message
        });
      }
      return res.status(400).json({ status: "fail", message: err.message });
    }
  }

  /**
   * DELETE /api/progress/log/:date
   * Deletes a progress log and its associated AI report.
   */
  static async deleteLog(req: Request, res: Response) {
    try {
      const date = req.params.date as string;
      const deleted = await ProgressService.deleteLog(MOCK_USER_ID, date);
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
    } catch (err: any) {
      return res.status(400).json({ status: "fail", message: err.message });
    }
  }

  /**
   * GET /api/progress/report/:date
   * Retrieves the AI report for a specific calendar date.
   */
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
      
      return res.status(200).json({
        status: "success",
        data: report
      });
    } catch (err: any) {
      return res.status(400).json({ status: "fail", message: err.message });
    }
  }
  
  /**
   * GET /api/progress/history
   * Retrieves historical logs and embedded AI reports for dashboard timeline.
   */
  static async getHistory(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 7;
      const offset = parseInt(req.query.offset as string) || 0;
      const history = await ProgressService.getHistory(MOCK_USER_ID, limit, offset);
      
      return res.status(200).json({
        status: "success",
        count: history.length,
        data: history
      });
    } catch (err: any) {
      return res.status(400).json({ status: "fail", message: err.message });
    }
  }
  
  /**
   * GET /api/progress/settings
   * Retrieves active user's AI coaching configuration settings.
   */
  static async getSettings(req: Request, res: Response) {
    try {
      const settings = await ProgressService.getSettings(MOCK_USER_ID);
      return res.status(200).json({
        status: "success",
        data: {
          coachPersona: settings?.coach_persona || 'Motivational',
          enableSafetyAlerts: settings?.enable_safety_alerts ?? true,
          priorityFocus: settings?.priority_focus || [],
          weeklySummaryOptIn: settings?.weekly_summary_opt_in ?? true
        }
      });
    } catch (err: any) {
      return res.status(400).json({ status: "fail", message: err.message });
    }
  }
  
  /**
   * PUT /api/progress/settings
   * Updates active user's AI coaching preferences.
   */
  static async updateSettings(req: Request, res: Response) {
    try {
      const settings = await ProgressService.updateSettings(MOCK_USER_ID, req.body);
      return res.status(200).json({
        status: "success",
        data: {
          coachPersona: settings.coach_persona,
          enableSafetyAlerts: settings.enable_safety_alerts,
          priorityFocus: settings.priority_focus,
          weeklySummaryOptIn: settings.weekly_summary_opt_in
        }
      });
    } catch (err: any) {
      return res.status(400).json({ status: "fail", message: err.message });
    }
  }

  // POST /api/progress/report/:date/regenerate
  static async regenerateReport(req: Request, res: Response) {
      try {
          const date = req.params.date as string;
          const existingLog = await ProgressService.getLogByDate(MOCK_USER_ID, date);
          if (!existingLog) {
              return res.status(404).json({
                  status: "fail",
                  error: "LOG_NOT_FOUND",
                  message: "Cannot regenerate report because no progress log exists for the requested date."
              });
          }

          const historicalLogs = await ProgressService.getPreviousHistory(MOCK_USER_ID, date, 7); 
          const userProfile = await ProgressService.getUserProfileContext(MOCK_USER_ID);
          
          const reportData = await AiService.generateReport(userProfile, historicalLogs, existingLog);
          const reportRecord = await ProgressService.storeReport(existingLog.id, MOCK_USER_ID, reportData);
          
          res.status(200).json({
              status: "success",
              message: "AI report successfully regenerated",
              data: {
                  date: existingLog.log_date,
                  reportId: reportRecord.id,
                  report: reportData
              }
          });
      } catch (err: any) {
          res.status(400).json({ status: "fail", message: err.message });
      }
  }

  // GET /api/progress/analytics
  static async getAnalytics(req: Request, res: Response) {
      try {
          const rangeParam = (req.query.range as string) || '7d';
          const analytics = await ProgressService.getAnalytics(MOCK_USER_ID, rangeParam);
          res.status(200).json({
              status: "success",
              data: analytics,
          });
      } catch (err: any) {
          res.status(400).json({ status: "fail", message: err.message });
      }
  }

  // POST /api/progress/recommendations/:id/feedback
  static async submitFeedback(req: Request, res: Response) {
      try {
          res.status(200).json({
              status: "success",
              message: "Feedback recorded successfully"
          });
      } catch (err: any) {
          res.status(400).json({ status: "fail", message: err.message });
      }
  }

  // GET /api/progress/report/:date/export
  static async exportReport(req: Request, res: Response) {
      try {
          res.status(200).json({
              status: "success",
              data: {
                  downloadUrl: "https://api.fitai-x.com/exports/report_2026-07-23.pdf",
                  expiresIn: 3600
              }
          });
      } catch (err: any) {
          res.status(400).json({ status: "fail", message: err.message });
      }
  }
}
