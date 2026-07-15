const pool = require("../config/db");

// Add Driver
const addDriver = async (driver) => {

    const query = `
        INSERT INTO drivers (
            branch_id,
            employee_code,
            full_name,
            gender,
            mobile,
            alternate_mobile,
            email, 
            address,
            aadhaar_number,
            designation,
            joining_date,
            relieving_date,
            salary,
            other_details,
            photo,
            is_active
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
        )
        RETURNING *;
    `;

    const values = [

        driver.branch_id,
        driver.employee_code,
        driver.full_name,
        driver.gender,
        driver.mobile,
        driver.alternate_mobile,
        driver.email,
        driver.address,
        driver.aadhaar_number,
        driver.designation,
        driver.joining_date,
        driver.relieving_date,
        driver.salary,
        driver.other_details,
        driver.photo,
        driver.is_active

    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};

// Get All Drivers
const getDrivers = async () => {

    const query = `
        SELECT
            drivers.*,
            branches.branch_name AS branch_name
        FROM drivers
        LEFT JOIN branches
            ON drivers.branch_id = branches.branch_id
        ORDER BY drivers.driver_id DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

};

// Get Driver By ID
const getDriverById = async (id) => {

    const query = `
        SELECT
            drivers.*,
            branches.branch_name AS branch_name
        FROM drivers
        LEFT JOIN branches
            ON drivers.branch_id = branches.branch_id
        WHERE drivers.driver_id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

};

// Update Driver
const updateDriver = async (id, driver) => {

    const query = `
    UPDATE drivers
    SET

        branch_id=$1,
        employee_code=$2,
        full_name=$3,
        gender=$4,
        mobile=$5,
        alternate_mobile=$6,
        email=$7,
        address=$8,
        aadhaar_number=$9,
        designation=$10,
        joining_date=$11,
        relieving_date=$12,
        salary=$13,
        other_details=$14,
        photo=$15,
        is_active=$16

    WHERE driver_id=$17

    RETURNING *;
    `;

    const values = [

        driver.branch_id,
        driver.employee_code,
        driver.full_name,
        driver.gender,
        driver.mobile,
        driver.alternate_mobile,
        driver.email,
        driver.address,
        driver.aadhaar_number,
        driver.designation,
        driver.joining_date,
        driver.relieving_date,
        driver.salary,
        driver.other_details,
        driver.photo,
        driver.is_active,
        id

    ];

    const result = await pool.query(query, values);

    return result.rows[0];

};

// Delete Driver
const deleteDriver = async (id) => {

    const result = await pool.query(

        "DELETE FROM drivers WHERE driver_id=$1 RETURNING *",

        [id]

    );

    return result.rows[0];

};

module.exports = {

    addDriver,
    getDrivers,
    getDriverById,
    updateDriver,
    deleteDriver

};