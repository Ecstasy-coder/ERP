CREATE TABLE students (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

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

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "employeeCode" VARCHAR(20) UNIQUE,
    branch VARCHAR(100),
    "firstName" VARCHAR(150),
    "lastName" VARCHAR(150),
    gender VARCHAR(20),
    phone VARCHAR(20),
    secondary_mobile VARCHAR(15),
    email VARCHAR(100),
    secondary_email VARCHAR(100),
    dob DATE,
    aadhaar_number VARCHAR(20),
    address TEXT,
    employee_type VARCHAR(100),
    designation VARCHAR(100),
    role VARCHAR(100),
    salary NUMERIC(12,2),
    joining_date DATE,
    relieved_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    photo TEXT,
    "otherDetails" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "employeeCode" VARCHAR(20) UNIQUE,
    "firstName" VARCHAR(150) NOT NULL,
    "lastName" VARCHAR(150) NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    role VARCHAR(100) CHECK (role IN ('Attender', 'Aaya')),
    salary NUMERIC(12,2),
    status VARCHAR(20) DEFAULT 'active',
    photo TEXT,
    "otherDetails" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(20) UNIQUE,
    teacher_name VARCHAR(150) NOT NULL,
    branch VARCHAR(100),
    gender VARCHAR(20),
    dob DATE,
    primary_mobile VARCHAR(15),
    secondary_mobile VARCHAR(15),
    primary_email VARCHAR(100),
    secondary_email VARCHAR(100),
    address TEXT,
    aadhaar_no VARCHAR(20),
    employee_type VARCHAR(50),
    employee_role VARCHAR(50),
    designation VARCHAR(100),
    joining_date DATE,
    relieving_date DATE,
    salary DECIMAL(10,2),
    other_details TEXT,
    photo TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safety net: if a "teachers" table already exists from the old standalone
-- teachers service (created before this merge), make sure it has every
-- column the model expects. IF NOT EXISTS makes this a no-op otherwise.
ALTER TABLE teachers
ADD COLUMN IF NOT EXISTS employee_code VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS branch VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS primary_mobile VARCHAR(15),
ADD COLUMN IF NOT EXISTS secondary_mobile VARCHAR(15),
ADD COLUMN IF NOT EXISTS primary_email VARCHAR(100),
ADD COLUMN IF NOT EXISTS secondary_email VARCHAR(100),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS aadhaar_no VARCHAR(20),
ADD COLUMN IF NOT EXISTS employee_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS employee_role VARCHAR(50),
ADD COLUMN IF NOT EXISTS designation VARCHAR(100),
ADD COLUMN IF NOT EXISTS joining_date DATE,
ADD COLUMN IF NOT EXISTS relieving_date DATE,
ADD COLUMN IF NOT EXISTS salary DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS other_details TEXT,
ADD COLUMN IF NOT EXISTS photo TEXT;