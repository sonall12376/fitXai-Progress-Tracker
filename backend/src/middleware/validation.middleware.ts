import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const logSchema = z.object({
  workoutCompleted: z.boolean({ message: "workoutCompleted is required" }),
  workoutType: z.string().optional(),
  workoutDuration: z.number().min(5).max(360).optional(),
  caloriesBurned: z.number().min(0).max(3000).optional(),
  caloriesConsumed: z.number().min(0).max(10000).optional(),
  steps: z.number().min(0).max(100000).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  waterIntake: z.number().min(0).max(15).optional(),
  mood: z.enum(['Energetic', 'Good', 'Tired', 'Exhausted', 'Stressed']).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  injury: z.object({
    hasInjury: z.boolean(),
    painLevel: z.number().min(0).max(10).optional(),
    details: z.string().optional()
  }).optional(),
  notes: z.string().optional()
}).refine(data => {
  if (data.workoutCompleted && (!data.workoutType || !data.workoutDuration || !data.caloriesBurned)) {
    return false;
  }
  return true;
}, {
  message: "workoutType, workoutDuration, and caloriesBurned are required if workoutCompleted is true"
});

export const validateRequest = (schema: z.ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'fail',
          error: 'VALIDATION_ERROR',
          details: error.issues
        });
      }
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };
};
