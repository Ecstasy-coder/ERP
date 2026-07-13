const pool = require("./config/db");

const createTables = async () => {
  try {

    // ==========================
    // Branches Table
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_due_branches (
        branch_id SERIAL PRIMARY KEY,
        branch_name VARCHAR(100) NOT NULL,
        branch_code VARCHAR(20) NOT NULL
      );
    `);

    // ==========================
    // Classes Table
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_due_classes (
        class_id SERIAL PRIMARY KEY,
        class_name VARCHAR(100) NOT NULL
      );
    `);

    // ==========================
    // Terms Table
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_due_terms (
        term_id SERIAL PRIMARY KEY,
        term_name VARCHAR(100) NOT NULL
      );
    `);

    // ==========================
    // Students Table
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_due_students (
        student_id SERIAL PRIMARY KEY,
        student_name VARCHAR(100) NOT NULL,
        father_name VARCHAR(100),
        mobile VARCHAR(15),
        branch_id INTEGER,
        class_id INTEGER,

        CONSTRAINT fk_branch
          FOREIGN KEY(branch_id)
          REFERENCES fee_due_branches(branch_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_class
          FOREIGN KEY(class_id)
          REFERENCES fee_due_classes(class_id)
          ON DELETE CASCADE
      );
    `);

    // ==========================
    // Fee Due Details Table
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_due_details (
        fee_due_id SERIAL PRIMARY KEY,

        student_id INTEGER,
        term_id INTEGER,

        fee_due NUMERIC(10,2),

        CONSTRAINT fk_student
          FOREIGN KEY(student_id)
          REFERENCES fee_due_students(student_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_term
          FOREIGN KEY(term_id)
          REFERENCES fee_due_terms(term_id)
          ON DELETE CASCADE
      );
    `);

    // ==========================
    // Payment Table
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_due_payments (

        payment_id SERIAL PRIMARY KEY,

        student_id INTEGER NOT NULL,

        term_id INTEGER NOT NULL,

        amount NUMERIC(10,2) NOT NULL,

        payment_status VARCHAR(20) DEFAULT 'Pending',

        transaction_id VARCHAR(255),

        payment_link TEXT,

        paid_at TIMESTAMP,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_payment_student
          FOREIGN KEY(student_id)
          REFERENCES fee_due_students(student_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_payment_term
          FOREIGN KEY(term_id)
          REFERENCES fee_due_terms(term_id)
          ON DELETE CASCADE
      );
    `);

    // ==========================
    // SMS History Table
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_due_sms_history (

        sms_id SERIAL PRIMARY KEY,

        student_id INTEGER,

        mobile VARCHAR(15),

        message TEXT,

        payment_link TEXT,

        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_sms_student
          FOREIGN KEY(student_id)
          REFERENCES fee_due_students(student_id)
          ON DELETE CASCADE
      );
    `);

    console.log("✅ All Fee Due tables created successfully.");

  } catch (err) {

    console.error("❌ Error creating tables:");
    console.error(err);

  } finally {

    await pool.end();

  }
};

createTables();