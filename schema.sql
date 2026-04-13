-- Postgres Schema for QuizAI
-- Optimized for Streaks and Recent Quizzes

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes Table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon TEXT,
    questions_count INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Quiz Results (Recent Quizzes)
CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Streaks
-- Note: Real-time streak updates are best handled via Redis for speed,
-- but persisted here for long-term storage.
CREATE TABLE user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_completed_at ON quiz_results(completed_at DESC);

/* 
Redis Strategy for Streaks:
Key: streak:user:{user_id}
Value: { "count": 5, "last_ts": 1712659200 }
TTL: 48 hours (if no activity for 48h, streak resets)

On every quiz completion:
1. GET streak:user:{user_id}
2. If last_ts is today, do nothing.
3. If last_ts is yesterday, INCR count, update last_ts.
4. If last_ts is older, reset count to 1, update last_ts.
5. Update Postgres user_streaks table asynchronously.
*/
