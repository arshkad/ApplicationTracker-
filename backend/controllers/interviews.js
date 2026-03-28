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

const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, scheduled_date, completed, interviewer, notes, outcome } = req.body;

    const result = await pool.query(
      `UPDATE interviews SET stage=$1, scheduled_date=$2, completed=$3, interviewer=$4, notes=$5, outcome=$6
       WHERE id=$7 RETURNING *`,
      [stage, scheduled_date, completed, interviewer, notes, outcome, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });

    // If offer accepted/rejected, update application status
    if (outcome === 'Offer') {
      await pool.query('UPDATE applications SET status = $1 WHERE id = $2', ['Offer', result.rows[0].application_id]);
    } else if (outcome === 'Rejected') {
      await pool.query('UPDATE applications SET status = $1 WHERE id = $2', ['Rejected', result.rows[0].application_id]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM interviews WHERE id = $1', [id]);
    res.json({ message: 'Deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInterviews, createInterview, updateInterview, deleteInterview };
