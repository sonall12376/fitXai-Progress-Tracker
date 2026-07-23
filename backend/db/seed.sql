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

-- 5. Insert 7 Days of historical logs
INSERT INTO daily_progress_logs (user_id, log_date, workout_completed, workout_type, workout_duration, calories_burned, calories_consumed, steps, sleep_hours, water_intake, mood, energy_level, has_injury)
VALUES 
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '7 days', true, 'Push', 60, 400, 2600, 8500, 7.5, 3.0, 'Energetic', 8, false),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '6 days', true, 'Pull', 55, 380, 2700, 9200, 7.0, 3.2, 'Good', 7, false),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', true, 'Legs', 70, 450, 2500, 10500, 8.0, 3.5, 'Tired', 6, false),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', false, NULL, NULL, NULL, 2200, 6000, 6.5, 2.0, 'Exhausted', 4, true),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', true, 'Push', 65, 420, 2800, 8000, 7.5, 3.0, 'Good', 7, false),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', true, 'Pull', 60, 400, 2650, 9500, 8.0, 3.5, 'Energetic', 8, false),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', true, 'Legs', 75, 480, 2900, 11000, 7.0, 3.8, 'Tired', 5, false)
ON CONFLICT (user_id, log_date) DO NOTHING;
