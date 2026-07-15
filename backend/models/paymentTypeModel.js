const pool = require("../config/db");

// Get All

const getPaymentTypes = async () => {

    const result = await pool.query(

        "SELECT * FROM payment_types ORDER BY id"

    );

    return result.rows;

};

// Get One

const getPaymentType = async(id)=>{

    const result = await pool.query(

        "SELECT * FROM payment_types WHERE id=$1",

        [id]

    );

    return result.rows[0];

};

// Add

const addPaymentType = async(payment_type,is_active)=>{

    const result = await pool.query(

        `INSERT INTO payment_types
        (payment_type,is_active)

        VALUES($1,$2)

        RETURNING *`,

        [payment_type,is_active]

    );

    return result.rows[0];

};

// Update

const updatePaymentType = async(

id,

payment_type,

is_active

)=>{

const result = await pool.query(

`UPDATE payment_types

SET

payment_type=$1,

is_active=$2,

updated_at=NOW()

WHERE id=$3

RETURNING *`,

[payment_type,is_active,id]

);

return result.rows[0];

};

// Delete

const deletePaymentType = async(id)=>{

const result = await pool.query(

"DELETE FROM payment_types WHERE id=$1 RETURNING *",

[id]

);

return result.rows[0];

};

module.exports={

getPaymentTypes,

getPaymentType,

addPaymentType,

updatePaymentType,

deletePaymentType

};