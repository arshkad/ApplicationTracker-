const { pool } = require('../db');

// GET all applications with interview count
const getApplications = async (req, res) => {
  try {
    const { status, search, sort = 'created_at', order = 'DESC' } = req.query;

    let query = `
      SELECT 
        a.*,
        COUNT(i.id) AS interview_count,
        MAX(i.scheduled_date) AS next_interview
      FROM applications a
      LEFT JOIN interviews i ON a.id = i.application_id AND i.completed = false
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (a.company ILIKE $${params.length} OR a.role ILIKE $${params.length})`;
    }

    const validSorts = ['created_at', 'applied_date', 'company', 'updated_at'];
    const sortCol = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';

    query += ` GROUP BY a.id ORDER BY a.${sortCol} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};