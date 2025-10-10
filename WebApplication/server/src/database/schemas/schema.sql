-- IMPORTANT: Create users table with all required fields
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'unverified' CHECK (status IN ('unverified', 'active', 'blocked')),
    last_login_time TIMESTAMP,
    registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTA BENE: Create UNIQUE INDEX separately from PRIMARY KEY (task requirement!)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- NOTE: Table for email verification tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- IMPORTANT: Create index for token lookup performance
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);