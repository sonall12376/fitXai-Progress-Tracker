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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ai_service_1 = require("./services/ai.service");
function runTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const userProfile = {
            userId: "1",
            name: "Shreya",
            age: 21,
            gender: "Female",
            height: 165,
            weight: 60,
            fitnessLevel: "Beginner",
            currentGoal: "Fat Loss"
        };
        const todayProgress = {
            workoutCompleted: true,
            workoutType: "Strength",
            workoutDuration: 60,
            caloriesBurned: 500,
            caloriesConsumed: 2000,
            steps: 9000,
            sleepHours: 7,
            waterIntake: 3,
            mood: "Good",
            energyLevel: 8,
            injury: {
                hasInjury: false,
                painLevel: 0,
                details: ""
            }
        };
        const history = [];
        const report = yield ai_service_1.AiService.generateReport(userProfile, history, todayProgress, "Motivational");
        console.log(JSON.stringify(report, null, 2));
    });
}
runTest();
