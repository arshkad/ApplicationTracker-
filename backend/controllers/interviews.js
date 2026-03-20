const { pool } = require('../db');

const getInterviews = async (req, res) => {
  try {
    const { application_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM interviews WHERE application_id = $1 ORDER BY scheduled_date ASC',
      [application_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInterview = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { stage, scheduled_date, interviewer, notes } = req.body;

    if (!stage) return res.status(400).json({ error: 'stage is required' });

    // Update application status to reflect interview stage
    const stageToStatus = {
      'Phone Screen': 'Phone Screen',
      'Technical': 'Technical Interview',
      'Onsite': 'Onsite Interview',
      'Final Round': 'Final Round',
    };
    if (stageToStatus[stage]) {
      await pool.query('UPDATE applications SET status = $1 WHERE id = $2', [stageToStatus[stage], application_id]);
    }

    const result = await pool.query(
      `INSERT INTO interviews (application_id, stage, scheduled_date, interviewer, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [application_id, stage, scheduled_date, interviewer, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};