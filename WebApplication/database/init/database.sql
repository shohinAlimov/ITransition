CREATE TABLE users (
  id SERIAL PRIMARY KEY, -- Primary key: auto-incrementing ID
  name VARCHAR(100) NOT NULL, -- NOT NULL = required field
  email VARCHAR(255) UNIQUE NOT NULL, -- UNIQUE constraint creates a UNIQUE INDEX automatically
  password_hashed VARCHAR(100) NOT NULL, -- Hashed password
  status VARCHAR(20) DEFAULT 'unverified'
    CHECK (status IN ('unverified', 'active', 'blocked')), -- Valid statuses
  last_login_time TIMESTAMP NULL, -- Last login timestamp
  registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Auto-set registration time
);

-- =====================================================
-- Index for sorting by last_login_time (improves ORDER BY performance)
-- =====================================================
CREATE INDEX idx_users_last_login ON users(last_login_time DESC);

-- =====================================================
-- Index for filtering by status (improves WHERE performance)
-- =====================================================
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- Test users
-- =====================================================
INSERT INTO users (name, email, password_hashed, status, last_login_time) VALUES
  ('Admin User', 'admin@test.com', '$2b$10$dummyhash1', 'active', CURRENT_TIMESTAMP),
  ('John Doe', 'john@test.com', '$2b$10$dummyhash2', 'active', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
  ('Jane Smith', 'jane@test.com', '$2b$10$dummyhash3', 'unverified', NULL),
  ('Blocked User', 'blocked@test.com', '$2b$10$dummyhash4', 'blocked', CURRENT_TIMESTAMP - INTERVAL '2 days');
