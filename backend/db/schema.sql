CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mock Users Table (assuming Auth module handles real users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User AI Settings
CREATE TABLE IF NOT EXISTS user_ai_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    coach_persona VARCHAR(50) DEFAULT 'Motivational' CHECK (coach_persona IN ('Motivational', 'Strict', 'Analytical', 'Enthusiastic')),
    enable_safety_alerts BOOLEAN DEFAULT true,
    priority_focus JSONB DEFAULT '[]'::jsonb, -- Array of strings
    weekly_summary_opt_in BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Progress Logs
CREATE TABLE IF NOT EXISTS daily_progress_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    
    -- Workout Metrics
    workout_completed BOOLEAN NOT NULL DEFAULT false,
    workout_type VARCHAR(50),
    workout_duration INT CHECK (workout_duration >= 5 AND workout_duration <= 360),
    calories_burned INT CHECK (calories_burned >= 0 AND calories_burned <= 3000),
    
    -- Daily Health Metrics
    calories_consumed INT CHECK (calories_consumed >= 0 AND calories_consumed <= 10000),
    steps INT CHECK (steps >= 0 AND steps <= 100000),
    sleep_hours NUMERIC(4,2) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    water_intake NUMERIC(4,2) CHECK (water_intake >= 0 AND water_intake <= 15),
    
    -- Subjective Metrics
    mood VARCHAR(20) CHECK (mood IN ('Energetic', 'Good', 'Tired', 'Exhausted', 'Stressed')),
    energy_level INT CHECK (energy_level >= 1 AND energy_level <= 10),
    
    -- Injury Metrics
    has_injury BOOLEAN NOT NULL DEFAULT false,
    pain_level INT CHECK (pain_level >= 0 AND pain_level <= 10),
    injury_details VARCHAR(250),
    
    -- Additional Notes
    notes VARCHAR(500),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, log_date)
);

-- AI Reports
CREATE TABLE IF NOT EXISTS ai_reports (
    id SERIAL PRIMARY KEY,
    log_id INT NOT NULL REFERENCES daily_progress_logs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Top level scores
    progress_score INT,
    confidence_score NUMERIC(3,2),
    
    -- Structured JSON Data
    consistency_analysis JSONB,
    workout_performance JSONB,
    recovery_analysis JSONB,
    injury_risk JSONB,
    user_vulnerabilities JSONB,
    improvement_analysis JSONB,
    goal_progress JSONB,
    personalized_recommendations JSONB,
    
    motivation_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(log_id)
);
