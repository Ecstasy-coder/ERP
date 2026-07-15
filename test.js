const pool = require("./backend/config/db");

const createTables = async () => {
  try {

    // ===========================================
    // 1. HOLIDAYS TABLE
    // ===========================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS holidays (

          holiday_id SERIAL PRIMARY KEY,

          holiday_date DATE NOT NULL,

          description VARCHAR(255) NOT NULL,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(" holidays table created"); 


    // ===========================================
    // 2. BRANCHES TABLE
    // ===========================================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS branches (

          branch_id SERIAL PRIMARY KEY,

          branch_code VARCHAR(20) UNIQUE NOT NULL,

          branch_head VARCHAR(100) NOT NULL,

          branch_name VARCHAR(150) NOT NULL,

          branch_address TEXT NOT NULL,

          contact_number VARCHAR(15) NOT NULL,

          email VARCHAR(120),

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(" branches table created");


    // ===========================================
// 3. ACADEMIC YEARS TABLE
// ===========================================
await pool.query(`
    CREATE TABLE IF NOT EXISTS academic_years (

        academic_year_id SERIAL PRIMARY KEY,

        academic_year VARCHAR(20) UNIQUE NOT NULL,

        is_active BOOLEAN DEFAULT TRUE,

        is_current BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );
`);

console.log(" academic_years table created");


  await pool.query(`
      CREATE TABLE IF NOT EXISTS study_classes (
        id SERIAL PRIMARY KEY,
        class_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ); 
 `);
    console.log(" study_classes table created");
//lokesh
    await pool.query(`
            CREATE TABLE IF NOT EXISTS class_sections (
                id SERIAL PRIMARY KEY,

                class_id INTEGER NOT NULL,

                section_name VARCHAR(50) NOT NULL,

                status BOOLEAN DEFAULT TRUE,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_class_sections
                    FOREIGN KEY (class_id)
                    REFERENCES study_classes(id)
                    ON DELETE CASCADE
            );
        `);

        console.log("✅ class_sections table created successfully");



 await pool.query(`
    CREATE TABLE IF NOT EXISTS fee_types (

    id SERIAL PRIMARY KEY,

    fee_type VARCHAR(150) NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`);
console.log(" fee_types table created");

 await pool.query(`
  CREATE TABLE IF NOT EXISTS payment_types (
          id SERIAL PRIMARY KEY,
          payment_type VARCHAR(100) NOT NULL UNIQUE,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(" payment_types table created");

await pool.query(`
    CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_title VARCHAR(100) NOT NULL,
    is_language BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 `);
 console.log("Subjects table created");


 await pool.query(`
      CREATE TABLE IF NOT EXISTS drivers (

          driver_id SERIAL PRIMARY KEY,

          branch_id INT NOT NULL,

          employee_code VARCHAR(30),

          full_name VARCHAR(100) NOT NULL,

          mobile VARCHAR(15) NOT NULL,

          email VARCHAR(100),

          is_active BOOLEAN DEFAULT TRUE,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT fk_driver_branch
FOREIGN KEY (branch_id)
REFERENCES branches(branch_id)
ON DELETE CASCADE

      );
    `);

    console.log("Drivers table created");


    // VEHICLE DETAILS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_details (

          vehicle_id SERIAL PRIMARY KEY,

          branch_id INT NOT NULL,

          vehicle_model VARCHAR(100) NOT NULL,

          vehicle_number VARCHAR(30) UNIQUE NOT NULL,

          seat_capacity INT NOT NULL,

          route_no INT NOT NULL,

          route_name VARCHAR(100) NOT NULL,

          area_covered VARCHAR(150),

          contact_no VARCHAR(15),

          driver_id INT,

          attender_name VARCHAR(100),

          start_time TIME,

          is_active BOOLEAN DEFAULT TRUE,

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT fk_vehicle_branch
FOREIGN KEY (branch_id)
REFERENCES branches(branch_id)
ON DELETE CASCADE,

          CONSTRAINT fk_vehicle_driver
          FOREIGN KEY (driver_id)
          REFERENCES drivers(driver_id)
          ON DELETE SET NULL

      );
    `);

    console.log("Vehicle Details table created");
     
await pool.query(`
CREATE TABLE IF NOT EXISTS class_subject_assignments (
    id SERIAL PRIMARY KEY,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_class
        FOREIGN KEY (class_id)
        REFERENCES study_classes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_class_subject
        UNIQUE(class_id, subject_id)
);
`);

console.log("Class Subject Assignments table created");

await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_types (
        exam_type_id SERIAL PRIMARY KEY,
        exam_name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ exam_types table created");

    // ==========================
    // 2. Grade System
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS grade_system (
        grade_id SERIAL PRIMARY KEY,
        grade_name VARCHAR(10) UNIQUE NOT NULL,
        min_marks INT NOT NULL,
        max_marks INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
    `);

    console.log("✅ grade_system table created");

    // ==========================
    // 3. Grade Report Design
    // ==========================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS grade_report_design (
        report_id SERIAL PRIMARY KEY,

        class_name VARCHAR(100) NOT NULL,

        subject_name VARCHAR(100) NOT NULL,

        evaluation_name VARCHAR(100) NOT NULL,

        exam_type_id INT NOT NULL,

        max_marks INT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_exam_type
            FOREIGN KEY (exam_type_id)
            REFERENCES exam_types(exam_type_id)
            ON DELETE CASCADE
      );
    `);

    console.log(" grade_report_design table created");

       
// ==========================
// Student Transport
// ==========================
await pool.query(`
CREATE TABLE IF NOT EXISTS student_transport (

    transport_id SERIAL PRIMARY KEY,

    student_id INT NOT NULL,

    pickup_vehicle_id INT NOT NULL,

    drop_vehicle_id INT NOT NULL,

    transport_type VARCHAR(30) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transport_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pickup_vehicle
        FOREIGN KEY (pickup_vehicle_id)
        REFERENCES vehicle_details(vehicle_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_drop_vehicle
        FOREIGN KEY (drop_vehicle_id)
        REFERENCES vehicle_details(vehicle_id)
        ON DELETE CASCADE

);
`);

console.log("✅ student_transport table created");

// ===========================================
// STUDENTS TABLE
// ===========================================
await pool.query(`
CREATE TABLE IF NOT EXISTS students (

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
`);

console.log("Students table created");

// ===========================================
// FEE STRUCTURE TABLE
// ===========================================
await pool.query(`
CREATE TABLE IF NOT EXISTS fee_structure (

    fee_structure_id SERIAL PRIMARY KEY,

    branch_id INT NOT NULL,

    academic_year_id INT NOT NULL,

    class_id INT NOT NULL,

    fee_type_id INT NOT NULL,

    fee_amount NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fee_branch
        FOREIGN KEY(branch_id)
        REFERENCES branches(branch_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fee_academic_year
        FOREIGN KEY(academic_year_id)
        REFERENCES academic_years(academic_year_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fee_class
        FOREIGN KEY(class_id)
        REFERENCES study_classes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fee_type
        FOREIGN KEY(fee_type_id)
        REFERENCES fee_types(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_fee_structure
    UNIQUE
    (
        branch_id,
        academic_year_id,
        class_id,
        fee_type_id
    )

);
`);

console.log("✅ fee_structure table created");

  
// ===========================================
// TERM FEE DETAILS TABLE
// ===========================================
await pool.query(`
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
        UNIQUE
        (
            branch_id,
            academic_year_id,
            class_id,
            term_name
        )

);
`);

console.log(" term_fee_details table created");


  }  catch (err) {
    console.error("Error Creating Tables");
    console.error(err.message);
    console.error(err.detail);
    console.error(err.stack);
} finally {
    await pool.end();
  }

};
createTables();

