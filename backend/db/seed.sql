-- 1. Insert dummy user (same ID used across backend mock calls)
INSERT INTO users (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'rahul@example.com') ON CONFLICT DO NOTHING;

-- 2. Insert User Profile
INSERT INTO user_profiles (user_id, name, age, gender, height, weight, fitness_level, current_goal)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Rahul', 22, 'Male', 175, 72.5, 'Intermediate', 'Muscle Gain'
) ON CONFLICT (user_id) DO NOTHING;

-- 3. Insert Workout Plan
INSERT INTO workout_plans (user_id, plan_name, frequency_per_week, target_calories_burn_per_session, target_sleep_per_night, target_water_per_day, target_steps_per_day, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Push-Pull-Legs', 5, 400, 8.0, 3.5, 10000, true
);

-- 4. Insert AI Settings
INSERT INTO user_ai_settings (user_id, coach_persona, enable_safety_alerts, priority_focus, weekly_summary_opt_in)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Motivational', true, '["Sleep Recovery", "Hypertrophy"]', true
) ON CONFLICT (user_id) DO NOTHING;

