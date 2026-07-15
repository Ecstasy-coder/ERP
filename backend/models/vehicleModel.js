const pool = require("../config/db");

// ======================================
// Add Vehicle
// ======================================
const addVehicle = async (vehicle) => {

    const query = `
        INSERT INTO vehicle_details (
            branch_id,
            vehicle_model,
            vehicle_number,
            seat_capacity,
            route_no,
            route_name,
            area_covered,
            contact_no,
            driver_id,
            attender_name,
            start_time,
            is_active
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )
        RETURNING *;
    `;

    const values = [

        vehicle.branch_id,
        vehicle.vehicle_model,
        vehicle.vehicle_number,
        vehicle.seat_capacity,
        vehicle.route_no,
        vehicle.route_name,
        vehicle.area_covered,
        vehicle.contact_no,
        vehicle.driver_id,
        vehicle.attender_name,
        vehicle.start_time,
        vehicle.is_active

    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// ======================================
// Get All Vehicles
// ======================================
const getVehicles = async () => {

    const query = `
        SELECT

            vehicle_details.*,
            drivers.full_name AS driver_name,
            branches.branch_name AS branch_name

        FROM vehicle_details

        LEFT JOIN drivers
            ON vehicle_details.driver_id = drivers.driver_id
        LEFT JOIN branches
            ON vehicle_details.branch_id = branches.branch_id

        ORDER BY vehicle_details.vehicle_id DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
};

// ======================================
// Get Vehicle By ID
// ======================================
const getVehicleById = async (id) => {

    const query = `
        SELECT

            vehicle_details.*,
            drivers.full_name AS driver_name,
            branches.branch_name AS branch_name

        FROM vehicle_details

        LEFT JOIN drivers
            ON vehicle_details.driver_id = drivers.driver_id
        LEFT JOIN branches
            ON vehicle_details.branch_id = branches.branch_id

        WHERE vehicle_details.vehicle_id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

// ======================================
// Update Vehicle
// ======================================
const updateVehicle = async (id, vehicle) => {

    const query = `
        UPDATE vehicle_details
        SET
            branch_id=$1,
            vehicle_model=$2,
            vehicle_number=$3,
            seat_capacity=$4,
            route_no=$5,
            route_name=$6,
            area_covered=$7,
            contact_no=$8,
            driver_id=$9,
            attender_name=$10,
            start_time=$11,
            is_active=$12
        WHERE vehicle_id=$13
        RETURNING *;
    `;

    const values = [

        vehicle.branch_id,
        vehicle.vehicle_model,
        vehicle.vehicle_number,
        vehicle.seat_capacity,
        vehicle.route_no,
        vehicle.route_name,
        vehicle.area_covered,
        vehicle.contact_no,
        vehicle.driver_id,
        vehicle.attender_name,
        vehicle.start_time,
        vehicle.is_active,
        id

    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// ======================================
// Delete Vehicle
// ======================================
const deleteVehicle = async (id) => {

    const result = await pool.query(
        "DELETE FROM vehicle_details WHERE vehicle_id=$1 RETURNING *",
        [id]
    );

    return result.rows[0];
};

module.exports = {

    addVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle

};