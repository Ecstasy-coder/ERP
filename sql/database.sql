CREATE TABLE students (

    id SERIAL PRIMARY KEY,

    branch VARCHAR(100) NOT NULL,

    admission_no VARCHAR(30) UNIQUE NOT NULL,

    register_no VARCHAR(30) UNIQUE NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    gender VARCHAR(20),

    primary_mobile VARCHAR(15) NOT NULL,

    secondary_mobile VARCHAR(15),

    primary_email VARCHAR(100),

    secondary_email VARCHAR(100),

    dob DATE,

    aadhaar_number VARCHAR(20) UNIQUE,

    admission_date DATE,

    current_academic_year VARCHAR(30),

    current_class VARCHAR(50),

    current_section VARCHAR(20),

    address TEXT,

    caste VARCHAR(100),

    sub_caste VARCHAR(100),

    admission_academic_year VARCHAR(30),

    admission_class VARCHAR(50),

    father_name VARCHAR(150),

    father_qualification VARCHAR(150),

    father_occupation VARCHAR(150),

    mother_name VARCHAR(150),

    mother_qualification VARCHAR(150),

    mother_occupation VARCHAR(150),

    sibling_details JSONB,

    first_language VARCHAR(50),

    second_language VARCHAR(50),

    third_language VARCHAR(50),

    photo VARCHAR(255),

    other_details TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
-- student promotions table--
CREATE TABLE student_promotions (

    id SERIAL PRIMARY KEY,

    student_id INT NOT NULL REFERENCES students(id),

    admission_no VARCHAR(30),

    full_name VARCHAR(150),

    gender VARCHAR(20),

    current_academic_year VARCHAR(30),

    current_class VARCHAR(100),

    current_section VARCHAR(30),

    promote_academic_year VARCHAR(30),

    promote_class VARCHAR(100)

);

CREATE TABLE IF NOT EXISTS fee_types (

    id SERIAL PRIMARY KEY,

    fee_type VARCHAR(150) NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS payment_types (

    id SERIAL PRIMARY KEY,

    payment_type VARCHAR(100) NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================
-- STUDENT FEE DETAILS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS student_fee_details (

    id SERIAL PRIMARY KEY,

    student_id INTEGER NOT NULL,

    fee_type VARCHAR(150) NOT NULL,

    transport_type VARCHAR(100) DEFAULT 'Two Way',

    fee_amount DECIMAL(10,2) NOT NULL,

    discount_amount DECIMAL(10,2) DEFAULT 0.00,

    subtotal_amount DECIMAL(10,2) NOT NULL,

    fee_paid DECIMAL(10,2) DEFAULT 0.00,

    fee_balance DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS student_fee_terms (

    id SERIAL PRIMARY KEY,

    student_fee_id INTEGER NOT NULL,

    term_name VARCHAR(20) NOT NULL,

    due_date DATE,

    term_amount NUMERIC(10,2) DEFAULT 0,

    paid_amount NUMERIC(10,2) DEFAULT 0,

    balance_amount NUMERIC(10,2) DEFAULT 0,

    paid_date DATE,

    payment_type VARCHAR(100),
    transaction_number VARCHAR(150),
    receipt_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student_fee
        FOREIGN KEY(student_fee_id)
        REFERENCES student_fee_details(id)
        ON DELETE CASCADE

);


-- term fee details table
CREATE TABLE IF NOT EXISTS term_fee_details (

    term_fee_id SERIAL PRIMARY KEY,

    branch_id INT NOT NULL,

    academic_year_id INT NOT NULL,

    class_id INT NOT NULL,

    term_name VARCHAR(50) NOT NULL,

    term_amount NUMERIC(10,2) NOT NULL,

    due_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_term_branch
        FOREIGN KEY (branch_id)
        REFERENCES branches(branch_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_term_academic_year
        FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(academic_year_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_term_class
        FOREIGN KEY (class_id)
        REFERENCES study_classes(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_term_fee
        UNIQUE (
            branch_id,
            academic_year_id,
            class_id,
            term_name
        )

);

CREATE TABLE IF NOT EXISTS study_classes (

    id SERIAL PRIMARY KEY,

    class_name VARCHAR(100) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS student_term_payments (
    payment_id SERIAL PRIMARY KEY,

    term_fee_id INTEGER NOT NULL,

    term_name VARCHAR(100) NOT NULL,

    term_amount NUMERIC(10,2) NOT NULL,

    due_date DATE,

    term_paid_amount NUMERIC(10,2) DEFAULT 0,

    balance_amount NUMERIC(10,2) DEFAULT 0,

    payment_details JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_term_fee
        FOREIGN KEY (term_fee_id)
        REFERENCES term_fee_details(term_fee_id)
        ON DELETE CASCADE
);