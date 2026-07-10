CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_years (
    id SERIAL PRIMARY KEY,
    academic_year VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    teacher_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_classes (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id),
    student_name VARCHAR(150) NOT NULL,
    admission_no VARCHAR(50),
    email VARCHAR(150),
    phone VARCHAR(20),
    current_class_id INT REFERENCES study_classes(id),
    current_section_id INT REFERENCES sections(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_teacher_assignments (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id),
    academic_year_id INT NOT NULL REFERENCES academic_years(academic_year_id),
    class_id INT NOT NULL REFERENCES study_classes(id),
    section_id INT NOT NULL REFERENCES sections(id),
    teacher_id INT NOT NULL REFERENCES teachers(id),
    subject_id INT NOT NULL REFERENCES subjects(id),
    is_class_teacher BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_teacher_assignment UNIQUE (branch_id, academic_year_id, class_id, section_id, teacher_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_class_teacher_assignments_active ON class_teacher_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_class_teacher_assignments_filters ON class_teacher_assignments(branch_id, academic_year_id, class_id, section_id, teacher_id);

CREATE TABLE IF NOT EXISTS class_attendance_records (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id),
    academic_year_id INT NOT NULL REFERENCES academic_years(academic_year_id),
    class_id INT NOT NULL REFERENCES study_classes(id),
    section_id INT NOT NULL REFERENCES sections(id),
    student_id INT NOT NULL REFERENCES students(id),
    attendance_date DATE NOT NULL,
    attendance_status VARCHAR(20) NOT NULL,
    remarks TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_daily_attendance UNIQUE (branch_id, class_id, section_id, student_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS class_diary_entries (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id),
    academic_year_id INT NOT NULL REFERENCES academic_years(academic_year_id),
    class_id INT NOT NULL REFERENCES study_classes(id),
    section_id INT NOT NULL REFERENCES sections(id),
    diary_date DATE NOT NULL,
    subject_id INT NOT NULL REFERENCES subjects(id),
    message TEXT NOT NULL,
    created_by INT,
    updated_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_assignments (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id),
    academic_year_id INT NOT NULL REFERENCES academic_years(academic_year_id),
    class_id INT NOT NULL REFERENCES study_classes(id),
    section_id INT NOT NULL REFERENCES sections(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assignment_date DATE NOT NULL,
    due_date DATE,
    created_by INT,
    updated_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_timetable_entries (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id),
    academic_year_id INT NOT NULL REFERENCES academic_years(academic_year_id),
    class_id INT NOT NULL REFERENCES study_classes(id),
    section_id INT NOT NULL REFERENCES sections(id),
    day_name VARCHAR(20) NOT NULL,
    period_no INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id INT NOT NULL REFERENCES subjects(id),
    teacher_id INT REFERENCES teachers(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);