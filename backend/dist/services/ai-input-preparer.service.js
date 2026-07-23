"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiInputPreparerService = void 0;
/**
 * Service responsible for preparing and formatting raw backend data into
 * the exact standardized AiInputPayload defined in AI_INPUT.md.
 *
 * Follows Clean Architecture and Single Responsibility Principles.
 */
class AiInputPreparerService {
    /**
     * Main entry point to prepare the full AI Input Payload.
     *
     * @param rawData - Object containing raw today log, history, profile, and settings
     * @returns Fully formatted AiInputPayload matching AI_INPUT.md specification
     */
    static prepareInputPayload(rawData) {
        const userProfile = this.formatUserProfile(rawData.userProfile, rawData.userSettings);
        const todayProgress = this.formatDailyProgress(rawData.todayLog);
        const previousHistory = this.formatHistoryLogs(rawData.historyLogs);
        return {
            userProfile,
            todayProgress,
            previousHistory
        };
    }
    /**
     * Helper Function: Formats and normalizes a single daily progress log.
     * Ensures all field types, numerical bounds, and optional properties match AI_INPUT.md.
     *
     * @param rawLog - Raw daily progress record from request or database
     * @returns Clean, typed AiProgressLog object
     */
    static formatDailyProgress(rawLog = {}) {
        var _a;
        const workoutCompleted = Boolean((_a = rawLog.workoutCompleted) !== null && _a !== void 0 ? _a : false);
        const dateStr = this.sanitizeDate(rawLog.date || rawLog.log_date);
        return {
            date: dateStr,
            workoutCompleted,
            workoutType: workoutCompleted ? (rawLog.workoutType || rawLog.workout_type || 'General') : null,
            workoutDuration: workoutCompleted ? this.sanitizeNumber(rawLog.workoutDuration || rawLog.workout_duration, 0, 360, 30) : 0,
            caloriesBurned: workoutCompleted ? this.sanitizeNumber(rawLog.caloriesBurned || rawLog.calories_burned, 0, 3000, 200) : 0,
            caloriesConsumed: this.sanitizeNumber(rawLog.caloriesConsumed || rawLog.calories_consumed, 0, 10000, 2000),
            steps: this.sanitizeNumber(rawLog.steps, 0, 100000, 5000),
            sleepHours: this.sanitizeNumber(rawLog.sleepHours || rawLog.sleep_hours, 0, 24, 7.0),
            waterIntake: this.sanitizeNumber(rawLog.waterIntake || rawLog.water_intake, 0, 15, 2.5),
            mood: this.sanitizeMood(rawLog.mood),
            energyLevel: this.sanitizeNumber(rawLog.energyLevel || rawLog.energy_level, 1, 10, 7),
            injury: this.formatInjuryData(rawLog.injury || {
                hasInjury: rawLog.has_injury || rawLog.hasInjury,
                painLevel: rawLog.pain_level || rawLog.painLevel,
                details: rawLog.injury_details || rawLog.details
            }),
            notes: rawLog.notes ? String(rawLog.notes).slice(0, 500) : null
        };
    }
    /**
     * Helper Function: Processes an array of historical logs (up to 7 previous days).
     * Normalizes each entry, sorts chronologically descending, and caps array length at 7.
     *
     * @param rawHistory - Array of raw history logs from database
     * @returns Clean array of up to 7 AiProgressLog items
     */
    static formatHistoryLogs(rawHistory = []) {
        if (!Array.isArray(rawHistory)) {
            return [];
        }
        return rawHistory
            .map(log => this.formatDailyProgress(log))
            // Sort descending by date (most recent first)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            // AI_INPUT.md specifies a maximum history payload size of 7 days
            .slice(0, 7);
    }
    /**
     * Helper Function: Prepares user profile and workout plan metrics.
     * Combines database profile data with user AI settings.
     * Includes mock fallback defaults for features not yet fully implemented.
     *
     * @param rawProfile - Raw user profile record from database
     * @param rawSettings - Raw user AI settings configuration
     * @returns Clean, typed AiUserProfile object
     */
    static formatUserProfile(rawProfile = {}, rawSettings = {}) {
        // TODO: Connect to User Profile Service when full User Management DB table is implemented
        const userId = rawProfile.userId || rawProfile.user_id || 'USR_MOCK_001';
        const name = rawProfile.name || 'Athlete';
        const age = this.sanitizeNumber(rawProfile.age, 13, 120, 25);
        const gender = this.sanitizeGender(rawProfile.gender);
        const height = this.sanitizeNumber(rawProfile.height, 100, 250, 175);
        const weight = this.sanitizeNumber(rawProfile.weight, 30, 300, 70.0);
        const fitnessLevel = this.sanitizeFitnessLevel(rawProfile.fitnessLevel || rawProfile.fitness_level);
        const currentGoal = this.sanitizeCurrentGoal(rawProfile.currentGoal || rawProfile.current_goal);
        // TODO: Connect to Workout Plan Service when dynamic Plan Customization feature is built
        const workoutPlan = this.formatWorkoutPlan(rawProfile.workoutPlan || rawProfile.workout_plan);
        return {
            userId,
            name,
            age,
            gender,
            height,
            weight,
            fitnessLevel,
            currentGoal,
            workoutPlan
        };
    }
    /**
     * Helper Function: Normalizes workout plan target metrics.
     * Uses standard health baseline fallbacks if plan metrics are missing.
     *
     * @param rawPlan - Raw workout plan configuration
     * @returns Clean AiWorkoutPlan object
     */
    static formatWorkoutPlan(rawPlan = {}) {
        // TODO: Implement Workout Plan Repository lookup for dynamic target benchmarks
        return {
            planId: rawPlan.planId || rawPlan.plan_id || 'PLAN_DEFAULT_01',
            planName: rawPlan.planName || rawPlan.plan_name || 'Standard Progression Plan',
            frequencyPerWeek: this.sanitizeNumber(rawPlan.frequencyPerWeek || rawPlan.frequency_per_week, 1, 7, 4),
            targetCaloriesBurnPerSession: this.sanitizeNumber(rawPlan.targetCaloriesBurnPerSession || rawPlan.target_calories_burn_per_session, 100, 2000, 400),
            targetSleepPerNight: this.sanitizeNumber(rawPlan.targetSleepPerNight || rawPlan.target_sleep_per_night, 5.0, 12.0, 8.0),
            targetWaterPerDay: this.sanitizeNumber(rawPlan.targetWaterPerDay || rawPlan.target_water_per_day, 1.5, 6.0, 3.0),
            targetStepsPerDay: this.sanitizeNumber(rawPlan.targetStepsPerDay || rawPlan.target_steps_per_day, 1000, 50000, 8000)
        };
    }
    /**
     * Helper Function: Normalizes injury tracking object.
     *
     * @param rawInjury - Raw injury data from input
     * @returns Clean AiInjury object
     */
    static formatInjuryData(rawInjury = {}) {
        const hasInjury = Boolean((rawInjury === null || rawInjury === void 0 ? void 0 : rawInjury.hasInjury) || (rawInjury === null || rawInjury === void 0 ? void 0 : rawInjury.has_injury) || false);
        const painLevel = hasInjury ? this.sanitizeNumber((rawInjury === null || rawInjury === void 0 ? void 0 : rawInjury.painLevel) || (rawInjury === null || rawInjury === void 0 ? void 0 : rawInjury.pain_level), 0, 10, 1) : 0;
        const details = hasInjury && (rawInjury === null || rawInjury === void 0 ? void 0 : rawInjury.details) ? String(rawInjury.details).slice(0, 250) : undefined;
        return Object.assign({ hasInjury,
            painLevel }, (details ? { details } : {}));
    }
    // ==========================================
    // SANITIZATION HELPER UTILITIES
    // ==========================================
    /**
     * Utility: Sanitizes numbers within min/max bounds, returning a fallback if invalid.
     */
    static sanitizeNumber(value, min, max, defaultValue) {
        const num = Number(value);
        if (isNaN(num))
            return defaultValue;
        return Math.max(min, Math.min(max, num));
    }
    /**
     * Utility: Sanitizes and formats ISO date string (YYYY-MM-DD).
     */
    static sanitizeDate(dateVal) {
        if (!dateVal)
            return new Date().toISOString().split('T')[0];
        const parsed = new Date(dateVal);
        if (isNaN(parsed.getTime()))
            return new Date().toISOString().split('T')[0];
        return parsed.toISOString().split('T')[0];
    }
    /**
     * Utility: Sanitizes Mood enum string.
     */
    static sanitizeMood(mood) {
        const validMoods = ['Energetic', 'Good', 'Tired', 'Exhausted', 'Stressed'];
        if (typeof mood === 'string' && validMoods.includes(mood)) {
            return mood;
        }
        return 'Good';
    }
    /**
     * Utility: Sanitizes Gender enum string.
     */
    static sanitizeGender(gender) {
        const validGenders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
        if (typeof gender === 'string' && validGenders.includes(gender)) {
            return gender;
        }
        return 'Prefer not to say';
    }
    /**
     * Utility: Sanitizes Fitness Level enum string.
     */
    static sanitizeFitnessLevel(level) {
        const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
        if (typeof level === 'string' && validLevels.includes(level)) {
            return level;
        }
        return 'Intermediate';
    }
    /**
     * Utility: Sanitizes Goal enum string.
     */
    static sanitizeCurrentGoal(goal) {
        const validGoals = ['Muscle Gain', 'Fat Loss', 'Endurance', 'Maintenance'];
        if (typeof goal === 'string' && validGoals.includes(goal)) {
            return goal;
        }
        return 'Maintenance';
    }
}
exports.AiInputPreparerService = AiInputPreparerService;
