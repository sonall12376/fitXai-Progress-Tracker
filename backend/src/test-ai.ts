import dotenv from "dotenv";
dotenv.config();

import { AiService } from "./services/ai.service";

async function runTest() {

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

    const history = [] as any[];

    const report = await AiService.generateReport(
        userProfile,
        history,
        todayProgress,
        "Motivational"
    );

    console.log(JSON.stringify(report, null, 2));
}

runTest();