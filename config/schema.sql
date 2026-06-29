-- ============================================================
--  FEE MODULE - PostgreSQL Schema
-- ============================================================

-- 1. Invalid Fee Data
--    Stores each failed/pending online payment transaction
CREATE TABLE IF NOT EXISTS invalid_fee_data (
  id               SERIAL PRIMARY KEY,
  student_id       VARCHAR(50)     NOT NULL,
  student_name     VARCHAR(150)    NOT NULL,
  current_class    VARCHAR(50)     NOT NULL,
  section          VARCHAR(20),
  roll_number      VARCHAR(30),
  amount           NUMERIC(10, 2)  NOT NULL,
  payment_mode     VARCHAR(50)     DEFAULT 'ONLINE',   -- ONLINE / UPI / CARD etc.
  transaction_ref  VARCHAR(100),                        -- Gateway reference / UTR
  error_reason     TEXT,                                -- Why the payment failed
  payment_date     TIMESTAMP       NOT NULL DEFAULT NOW(),
  status           VARCHAR(30)     NOT NULL DEFAULT 'INVALID',  -- INVALID / PENDING / RESOLVED
  created_at       TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 2. Invalid Fee Totals
--    Auto-aggregated summary per student from invalid_fee_data
CREATE TABLE IF NOT EXISTS invalid_fee_totals (
  id               SERIAL PRIMARY KEY,
  student_id       VARCHAR(50)     NOT NULL UNIQUE,
  student_name     VARCHAR(150)    NOT NULL,
  current_class    VARCHAR(50)     NOT NULL,
  section          VARCHAR(20),
  total_invalid_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_transactions    INT             NOT NULL DEFAULT 0,
  last_transaction_date TIMESTAMP,
  updated_at       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 3. Fee Not Generated
--    Students whose payment succeeded but fee slip was NOT generated
CREATE TABLE IF NOT EXISTS fee_not_generated (
  id               SERIAL PRIMARY KEY,
  student_id       VARCHAR(50)     NOT NULL,
  student_name     VARCHAR(150)    NOT NULL,
  current_class    VARCHAR(50)     NOT NULL,
  section          VARCHAR(20),
  roll_number      VARCHAR(30),
  amount_paid      NUMERIC(10, 2)  NOT NULL,
  transaction_ref  VARCHAR(100),
  payment_date     TIMESTAMP       NOT NULL,
  error_reason     TEXT,                                -- Why slip was not generated
  status           VARCHAR(30)     NOT NULL DEFAULT 'PENDING',  -- PENDING / RESOLVED
  created_at       TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 4. Transaction Logs
--    Master log: all invalid_fee_data + fee_not_generated entries
--    Populated by triggers OR by app logic — stores JSON snapshot
CREATE TABLE IF NOT EXISTS transaction_logs (
  id               SERIAL PRIMARY KEY,
  log_type         VARCHAR(50)     NOT NULL,  -- 'INVALID_FEE' | 'FEE_NOT_GENERATED'
  student_id       VARCHAR(50)     NOT NULL,
  student_name     VARCHAR(150)    NOT NULL,
  current_class    VARCHAR(50)     NOT NULL,
  section          VARCHAR(20),
  amount           NUMERIC(10, 2),
  transaction_ref  VARCHAR(100),
  error_reason     TEXT,
  status           VARCHAR(30),
  raw_payload      JSONB,                     -- Full JSON snapshot of the record
  logged_at        TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes for faster queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ifd_student    ON invalid_fee_data(student_id);
CREATE INDEX IF NOT EXISTS idx_ifd_status     ON invalid_fee_data(status);
CREATE INDEX IF NOT EXISTS idx_ifd_date       ON invalid_fee_data(payment_date);

CREATE INDEX IF NOT EXISTS idx_ift_student    ON invalid_fee_totals(student_id);

CREATE INDEX IF NOT EXISTS idx_fng_student    ON fee_not_generated(student_id);
CREATE INDEX IF NOT EXISTS idx_fng_status     ON fee_not_generated(status);

CREATE INDEX IF NOT EXISTS idx_tl_type        ON transaction_logs(log_type);
CREATE INDEX IF NOT EXISTS idx_tl_student     ON transaction_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_tl_logged_at   ON transaction_logs(logged_at); 











