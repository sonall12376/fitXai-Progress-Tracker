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
exports.validateRequest = exports.logSchema = void 0;
const zod_1 = require("zod");
exports.logSchema = zod_1.z.object({
    workoutCompleted: zod_1.z.boolean({ message: "workoutCompleted is required" }),
    workoutType: zod_1.z.string().optional(),
    workoutDuration: zod_1.z.number().min(5).max(360).optional(),
    caloriesBurned: zod_1.z.number().min(0).max(3000).optional(),
    caloriesConsumed: zod_1.z.number().min(0).max(10000).optional(),
    steps: zod_1.z.number().min(0).max(100000).optional(),
    sleepHours: zod_1.z.number().min(0).max(24).optional(),
    waterIntake: zod_1.z.number().min(0).max(15).optional(),
    mood: zod_1.z.enum(['Energetic', 'Good', 'Tired', 'Exhausted', 'Stressed']).optional(),
    energyLevel: zod_1.z.number().min(1).max(10).optional(),
    injury: zod_1.z.object({
        hasInjury: zod_1.z.boolean(),
        painLevel: zod_1.z.number().min(0).max(10).optional(),
        details: zod_1.z.string().optional()
    }).optional(),
    notes: zod_1.z.string().optional()
}).refine(data => {
    if (data.workoutCompleted && (!data.workoutType || !data.workoutDuration || !data.caloriesBurned)) {
        return false;
    }
    return true;
}, {
    message: "workoutType, workoutDuration, and caloriesBurned are required if workoutCompleted is true"
});
const validateRequest = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    status: 'fail',
                    error: 'VALIDATION_ERROR',
                    details: error.issues
                });
            }
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    });
};
exports.validateRequest = validateRequest;
