const pool = require("../config/db");

// Get All
const getFeeTypes = async() => {

    const result = await pool.query(
        "SELECT * FROM fee_types ORDER BY id"
    );

    return result.rows;
};

// Get One
const getFeeType = async(id) => {

    const result = await pool.query(

        "SELECT * FROM fee_types WHERE id=$1",

        [id]

    );

    return result.rows[0];

};

// Add

const addFeeType = async(fee_type, is_active) => {

    const result = await pool.query(

        `INSERT INTO fee_types
        (fee_type,is_active)

        VALUES($1,$2)

        RETURNING *`,

        [fee_type, is_active]

    );

    return result.rows[0];

};

// Update

const updateFeeType = async(id, fee_type, is_active) => {

    const result = await pool.query(

        `UPDATE fee_types

        SET

        fee_type=$1,

        is_active=$2,

        updated_at=NOW()

        WHERE id=$3

        RETURNING *`,

        [fee_type, is_active, id]

    );

    return result.rows[0];

};

// Delete

const deleteFeeType = async(id) => {

    const result = await pool.query(

        "DELETE FROM fee_types WHERE id=$1 RETURNING *",

        [id]

    );

    return result.rows[0];

};

module.exports = {

    getFeeTypes,

    getFeeType,

    addFeeType,

    updateFeeType,

    deleteFeeType

};