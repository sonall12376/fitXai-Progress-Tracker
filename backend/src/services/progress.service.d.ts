export declare class ProgressService {
    /**
     * Insert a daily progress log.
     */
    static createLog(userId: string, data: any): Promise<any>;
    /**
     * Update an existing daily log for a date.
     */
    static updateLog(userId: string, date: string, data: any): Promise<any>;
    /**
     * Store the generated AI report in the database.
     */
    static storeReport(logId: number, userId: string, report: any): Promise<any>;
    static getLogByDate(userId: string, date: string): Promise<any>;
    static getReportByDate(userId: string, date: string): Promise<any>;
    static deleteLog(userId: string, date: string): Promise<boolean>;
    static getHistory(userId: string, limit: number, offset: number): Promise<any[]>;
    static getSettings(userId: string): Promise<any>;
    static updateSettings(userId: string, data: any): Promise<any>;
}
//# sourceMappingURL=progress.service.d.ts.map