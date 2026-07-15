const pool = require("../config/db");

// ===============================
// Helper: Build base SELECT for given view
// ===============================
const buildBaseQuery = (view) => {
  const commonFields = `
    st.transport_id,
    st.student_id,
    s.admission_no,
    s.register_no,
    s.full_name,
    s.father_name,
    s.gender,
    CONCAT_WS(' - ', s.current_class, NULLIF(s.current_section, '')) AS class,
    CONCAT_WS(', ', NULLIF(s.primary_mobile, ''), NULLIF(s.secondary_mobile, '')) AS mobile,
    s.primary_email,
    s.address,
    st.transport_type,
    b.branch_id,
    b.branch_code,
    b.branch_name
  `;

  if (view === 'pickup') {
    return `
      SELECT
        ${commonFields},
        pv.vehicle_id AS pickup_vehicle_id,
        pv.vehicle_id AS route_vehicle_id,
        pv.route_no AS route_no,
        pv.route_name AS route_name,
        pv.start_time AS start_time
      FROM student_transport st
      INNER JOIN students s ON st.student_id = s.id
      INNER JOIN vehicle_details pv ON st.pickup_vehicle_id = pv.vehicle_id
      INNER JOIN branches b ON pv.branch_id = b.branch_id
    `;
  }

  if (view === 'drop') {
    return `
      SELECT
        ${commonFields},
        dv.vehicle_id AS drop_vehicle_id,
        dv.vehicle_id AS route_vehicle_id,
        dv.route_no AS route_no,
        dv.route_name AS route_name,
        dv.start_time AS start_time
      FROM student_transport st
      INNER JOIN students s ON st.student_id = s.id
      INNER JOIN vehicle_details dv ON st.drop_vehicle_id = dv.vehicle_id
      INNER JOIN branches b ON dv.branch_id = b.branch_id
    `;
  }

  // 'both' (default)
  return `
    SELECT
      ${commonFields},
      pv.vehicle_id AS pickup_vehicle_id,
      dv.vehicle_id AS drop_vehicle_id,
      pv.route_no AS pickup_route_no,
      pv.route_name AS pickup_route_name,
      pv.start_time AS pickup_start_time,
      dv.route_no AS drop_route_no,
      dv.route_name AS drop_route_name,
      dv.start_time AS drop_start_time
    FROM student_transport st
    INNER JOIN students s ON st.student_id = s.id
    INNER JOIN vehicle_details pv ON st.pickup_vehicle_id = pv.vehicle_id
    INNER JOIN vehicle_details dv ON st.drop_vehicle_id = dv.vehicle_id
    INNER JOIN branches b ON pv.branch_id = b.branch_id
  `;
};

// ===============================
// Helper: Map row to response object
// ===============================
const mapRow = (row, view) => {
  const base = {
    transport_id: row.transport_id,
    student_id: row.student_id,
    admission_no: row.admission_no,
    register_no: row.register_no,
    full_name: row.full_name,
    father_name: row.father_name,
    gender: row.gender,
    class: row.class,
    mobile: row.mobile,
    primary_email: row.primary_email,
    address: row.address,
    branch_name: row.branch_name
  };

  if (view === 'pickup') {
    return {
      ...base,
      pickup_vehicle_id: row.pickup_vehicle_id,
      transport_type: 'Pickup',
      route_no: row.route_no,
      route_name: row.route_name,
      start_time: row.start_time
    };
  }

  if (view === 'drop') {
    return {
      ...base,
      drop_vehicle_id: row.drop_vehicle_id,
      transport_type: 'Drop',
      route_no: row.route_no,
      route_name: row.route_name,
      start_time: row.start_time
    };
  }

  // 'both'
  return {
    ...base,
    pickup_vehicle_id: row.pickup_vehicle_id,
    drop_vehicle_id: row.drop_vehicle_id,
    transport_type: row.transport_type,
    pickup: {
      route_no: row.pickup_route_no,
      route_name: row.pickup_route_name,
      start_time: row.pickup_start_time
    },
    drop: {
      route_no: row.drop_route_no,
      route_name: row.drop_route_name,
      start_time: row.drop_start_time
    }
  };
};

// ===============================
// Helper: Get full transport details by ID (for POST/PUT responses)
// ===============================
const getTransportDetailsById = async (transportId) => {
  const query = `
    SELECT
      st.transport_id,
      st.student_id,
      s.admission_no,
      s.register_no,
      s.full_name,
      s.father_name,
      s.gender,
      CONCAT_WS(' - ', s.current_class, NULLIF(s.current_section, '')) AS class,
      CONCAT_WS(', ', NULLIF(s.primary_mobile, ''), NULLIF(s.secondary_mobile, '')) AS mobile,
      s.primary_email,
      s.address,
      st.transport_type,
      pv.vehicle_id AS pickup_vehicle_id,
      dv.vehicle_id AS drop_vehicle_id,
      CONCAT(
        'Route#', pv.route_no, ' - ', pv.route_name,
        E'\nStart Time ', TO_CHAR(pv.start_time, 'HH12:MI AM')
      ) AS pickup,
      CONCAT(
        'Route#', dv.route_no, ' - ', dv.route_name,
        E'\nStart Time ', TO_CHAR(dv.start_time, 'HH12:MI AM')
      ) AS drop,
      b.branch_name,
      st.created_at
    FROM student_transport st
    INNER JOIN students s ON st.student_id = s.id
    INNER JOIN vehicle_details pv ON st.pickup_vehicle_id = pv.vehicle_id
    INNER JOIN vehicle_details dv ON st.drop_vehicle_id = dv.vehicle_id
    INNER JOIN branches b ON pv.branch_id = b.branch_id
    WHERE st.transport_id = $1
  `;
  const result = await pool.query(query, [transportId]);
  return result.rows[0];
};

// ===============================
// Transport Students By Route (with filters & pagination)
// ===============================
const getTransportStudentsByRoute = async (filters = {}) => {
  const {
    branch_id,
    route_id,
    search = "",
    page = 1,
    limit = 50,
    transport_view = 'both'
  } = filters;

  const transportTypeMap = {
    pickup: 'Pickup Only',
    drop: 'Drop Only',
    both: 'Two Way'
  };
  const dbTransportType = transportTypeMap[transport_view] || 'Two Way';

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.max(Number(limit) || 50, 1);
  const offset = (currentPage - 1) * pageLimit;

  const where = [];
  const values = [];
  let index = 1;

  where.push(`st.transport_type = $${index}`);
  values.push(dbTransportType);
  index++;

  const baseQuery = buildBaseQuery(transport_view);

  if (branch_id) {
    where.push(`b.branch_id = $${index}`);
    values.push(branch_id);
    index++;
  }

  if (route_id) {
    if (transport_view === 'pickup') {
      where.push(`pv.vehicle_id = $${index}`);
    } else if (transport_view === 'drop') {
      where.push(`dv.vehicle_id = $${index}`);
    } else {
      where.push(`(pv.vehicle_id = $${index} OR dv.vehicle_id = $${index})`);
    }
    values.push(route_id);
    index++;
  }

  if (search) {
    const searchCondition = `
      LOWER(s.full_name) LIKE LOWER($${index})
      OR LOWER(s.father_name) LIKE LOWER($${index})
      OR LOWER(s.current_class) LIKE LOWER($${index})
      OR LOWER(COALESCE(s.current_section, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(s.primary_mobile, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(s.secondary_mobile, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(s.primary_email, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(s.address, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(pv.route_name, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(dv.route_name, '')) LIKE LOWER($${index})
      OR CAST(pv.route_no AS TEXT) LIKE $${index}
      OR CAST(dv.route_no AS TEXT) LIKE $${index}
      OR LOWER(COALESCE(st.transport_type, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(s.admission_no, '')) LIKE LOWER($${index})
      OR LOWER(COALESCE(s.register_no, '')) LIKE LOWER($${index})
    `;
    where.push(`(${searchCondition})`);
    values.push(`%${search}%`);
    index++;
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const fullQuery = `${baseQuery} ${whereSql}`;

  const dataQuery = `
    ${fullQuery}
    ORDER BY s.full_name ASC
    LIMIT $${index}
    OFFSET $${index + 1}
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM (${fullQuery}) report_rows
  `;

  const dataValues = [...values, pageLimit, offset];

  const [studentsResult, countResult] = await Promise.all([
    pool.query(dataQuery, dataValues),
    pool.query(countQuery, values)
  ]);

  const total = countResult.rows[0].total;

  return {
    total,
    page: currentPage,
    limit: pageLimit,
    from: total === 0 ? 0 : offset + 1,
    to: Math.min(offset + pageLimit, total),
    data: studentsResult.rows.map(row => mapRow(row, transport_view))
  };
};

// ===============================
// Get All Transport Students
// ===============================
const getTransportStudents = async () => {
  const query = `
    SELECT
      st.transport_id,
      st.student_id,
      s.admission_no,
      s.register_no,
      s.full_name,
      s.father_name,
      s.gender,
      CONCAT_WS(' - ', s.current_class, NULLIF(s.current_section, '')) AS class,
      CONCAT_WS(', ', NULLIF(s.primary_mobile, ''), NULLIF(s.secondary_mobile, '')) AS mobile,
      s.primary_email,
      s.address,
      st.transport_type,
      pv.vehicle_id AS pickup_vehicle_id,
      dv.vehicle_id AS drop_vehicle_id,
      CONCAT(
        'Route#', pv.route_no, ' - ', pv.route_name,
        E'\nStart Time ', TO_CHAR(pv.start_time, 'HH12:MI AM')
      ) AS pickup,
      CONCAT(
        'Route#', dv.route_no, ' - ', dv.route_name,
        E'\nStart Time ', TO_CHAR(dv.start_time, 'HH12:MI AM')
      ) AS drop,
      b.branch_name
    FROM student_transport st
    INNER JOIN students s ON st.student_id = s.id
    INNER JOIN vehicle_details pv ON st.pickup_vehicle_id = pv.vehicle_id
    INNER JOIN vehicle_details dv ON st.drop_vehicle_id = dv.vehicle_id
    INNER JOIN branches b ON pv.branch_id = b.branch_id
    ORDER BY s.full_name;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ===============================
// Get Transport Student By ID
// ===============================
const getTransportStudentById = async (id) => {
  const query = `
    SELECT
      st.transport_id,
      st.student_id,
      s.admission_no,
      s.register_no,
      s.full_name,
      s.father_name,
      s.gender,
      CONCAT_WS(' - ', s.current_class, NULLIF(s.current_section, '')) AS class,
      CONCAT_WS(', ', NULLIF(s.primary_mobile, ''), NULLIF(s.secondary_mobile, '')) AS mobile,
      s.primary_email,
      s.address,
      st.transport_type,
      pv.vehicle_id AS pickup_vehicle_id,
      dv.vehicle_id AS drop_vehicle_id,
      CONCAT(
        'Route#', pv.route_no, ' - ', pv.route_name,
        E'\nStart Time ', TO_CHAR(pv.start_time, 'HH12:MI AM')
      ) AS pickup,
      CONCAT(
        'Route#', dv.route_no, ' - ', dv.route_name,
        E'\nStart Time ', TO_CHAR(dv.start_time, 'HH12:MI AM')
      ) AS drop,
      b.branch_name
    FROM student_transport st
    INNER JOIN students s ON st.student_id = s.id
    INNER JOIN vehicle_details pv ON st.pickup_vehicle_id = pv.vehicle_id
    INNER JOIN vehicle_details dv ON st.drop_vehicle_id = dv.vehicle_id
    INNER JOIN branches b ON pv.branch_id = b.branch_id
    WHERE st.transport_id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// ===============================
// Assign Transport (returns full details, no is_active)
// ===============================
const assignTransport = async (data) => {
  const query = `
    INSERT INTO student_transport
    (student_id, pickup_vehicle_id, drop_vehicle_id, transport_type, is_active)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING transport_id;
  `;
  const values = [
    data.student_id,
    data.pickup_vehicle_id,
    data.drop_vehicle_id,
    data.transport_type,
    data.is_active ?? true
  ];
  const result = await pool.query(query, values);
  const transportId = result.rows[0].transport_id;
  return await getTransportDetailsById(transportId);
};

// ===============================
// Update Transport (returns full details, no is_active)
// ===============================
const updateTransport = async (id, data) => {
  const query = `
    UPDATE student_transport
    SET student_id=$1, pickup_vehicle_id=$2, drop_vehicle_id=$3,
        transport_type=$4, is_active=$5
    WHERE transport_id=$6
    RETURNING transport_id;
  `;
  const values = [
    data.student_id,
    data.pickup_vehicle_id,
    data.drop_vehicle_id,
    data.transport_type,
    data.is_active,
    id
  ];
  const result = await pool.query(query, values);
  if (result.rows.length === 0) return null;
  const transportId = result.rows[0].transport_id;
  return await getTransportDetailsById(transportId);
};

// ===============================
// Delete Transport (returns deleted record without is_active)
// ===============================
const deleteTransport = async (id) => {
  const query = `DELETE FROM student_transport WHERE transport_id=$1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) return null;
  // Return a clean object without is_active (though it's not present in the response)
  // but we can just return the row and let the controller handle the message.
  // We'll remove is_active manually:
  const deleted = result.rows[0];
  delete deleted.is_active;
  return deleted;
};

module.exports = {
  getTransportStudentsByRoute,
  getTransportStudents,
  getTransportStudentById,
  assignTransport,
  updateTransport,
  deleteTransport
};