import { Request, Response } from 'express';

// Hardcoded mock user ID for testing
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

export class AuthController {
    // POST /api/auth/login
    static async login(req: Request, res: Response) {
        try {
            // Mocking a JWT token for the frontend to store and use
            const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJpYXQiOjE3MTY4ODg4OTV9.mockSignatureForFrontendIntegrationTest";
            
            res.status(200).json({
                status: "success",
                message: "Logged in successfully",
                data: {
                    user: {
                        id: MOCK_USER_ID,
                        name: "Rahul",
                        email: req.body.email || "rahul@fitxai.com"
                    },
                    token: mockToken
                }
            });
        } catch (err: any) {
            res.status(400).json({ status: "fail", message: err.message });
        }
    }
}
