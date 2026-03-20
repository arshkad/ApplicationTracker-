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
// GET single application with interviews
const getApplication = async (req, res) => {
    try {
      const { id } = req.params;
      const appResult = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
      if (!appResult.rows.length) return res.status(404).json({ error: 'Not found' });
  
      const interviewResult = await pool.query(
        'SELECT * FROM interviews WHERE application_id = $1 ORDER BY scheduled_date ASC',
        [id]
      );
  
      res.json({ ...appResult.rows[0], interviews: interviewResult.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // POST create application
  const createApplication = async (req, res) => {
    try {
      const { company, role, status, applied_date, location, salary_min, salary_max, job_url, notes } = req.body;
      if (!company || !role || !applied_date) {
        return res.status(400).json({ error: 'company, role, and applied_date are required' });
      }
  
      const result = await pool.query(
        `INSERT INTO applications (company, role, status, applied_date, location, salary_min, salary_max, job_url, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [company, role, status || 'Applied', applied_date, location, salary_min, salary_max, job_url, notes]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  // PUT update application
const updateApplication = async (req, res) => {
    try {
      const { id } = req.params;
      const { company, role, status, applied_date, location, salary_min, salary_max, job_url, notes } = req.body;
  
      const result = await pool.query(
        `UPDATE applications SET
          company=$1, role=$2, status=$3, applied_date=$4,
          location=$5, salary_min=$6, salary_max=$7, job_url=$8, notes=$9
         WHERE id=$10 RETURNING *`,
        [company, role, status, applied_date, location, salary_min, salary_max, job_url, notes, id]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  // DELETE application
const deleteApplication = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted', id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // GET analytics
  const getAnalytics = async (req, res) => {
    try {
      const [statusCount, monthlyCount, stageCount, responseRate] = await Promise.all([
        pool.query(`SELECT status, COUNT(*) as count FROM applications GROUP BY status`),
        pool.query(`
          SELECT TO_CHAR(applied_date, 'Mon YYYY') as month,
                 DATE_TRUNC('month', applied_date) as month_date,
                 COUNT(*) as count
          FROM applications
          GROUP BY month, month_date
          ORDER BY month_date DESC LIMIT 6
        `),
        pool.query(`SELECT stage, COUNT(*) as count FROM interviews GROUP BY stage`),
        pool.query(`
          SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status NOT IN ('Applied', 'Rejected') THEN 1 END) as responded
          FROM applications
        `),
      ]);
  
      res.json({
        byStatus: statusCount.rows,
        byMonth: monthlyCount.rows.reverse(),
        interviewStages: stageCount.rows,
        responseRate: responseRate.rows[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = { getApplications, getApplication, createApplication, updateApplication, deleteApplication, getAnalytics };