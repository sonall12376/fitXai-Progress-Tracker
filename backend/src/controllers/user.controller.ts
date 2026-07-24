import { Request, Response } from 'express';
import { query } from '../db';

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

export class UserController {
    // GET /api/user/profile
    static async getProfile(req: Request, res: Response) {
        try {
            // Assume the user ID is decoded from the JWT, using mock for now
            const userId = MOCK_USER_ID;

            const profileResult = await query(
                'SELECT * FROM user_profiles WHERE user_id = $1',
                [userId]
            );

            if (profileResult.rows.length === 0) {
                res.status(404).json({
                    status: "fail",
                    message: "User profile not found"
                });
                return;
            }

            const activePlanResult = await query(
                'SELECT * FROM workout_plans WHERE user_id = $1 AND is_active = true LIMIT 1',
                [userId]
            );

            res.status(200).json({
                status: "success",
                data: {
                    profile: profileResult.rows[0],
                    activePlan: activePlanResult.rows[0] || null
                }
            });
        } catch (err: any) {
            res.status(400).json({ status: "fail", message: err.message });
        }
    }
}
