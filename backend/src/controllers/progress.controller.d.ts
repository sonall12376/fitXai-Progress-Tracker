import { Request, Response } from 'express';
export declare class ProgressController {
    static createLog(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateLog(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteLog(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getHistory(req: Request, res: Response): Promise<void>;
    static getSettings(req: Request, res: Response): Promise<void>;
    static updateSettings(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=progress.controller.d.ts.map