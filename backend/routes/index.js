const express = require('express');
const router = express.Router();
const {
  getApplications, getApplication, createApplication,
  updateApplication, deleteApplication, getAnalytics
} = require('../controllers/applications');
const { getInterviews, createInterview, updateInterview, deleteInterview } = require('../controllers/interviews');

// Applications
router.get('/applications', getApplications);
router.get('/applications/analytics', getAnalytics);
router.get('/applications/:id', getApplication);
router.post('/applications', createApplication);
router.put('/applications/:id', updateApplication);
router.delete('/applications/:id', deleteApplication);

// Interviews (nested under applications)
router.get('/applications/:application_id/interviews', getInterviews);
router.post('/applications/:application_id/interviews', createInterview);
router.put('/interviews/:id', updateInterview);
router.delete('/interviews/:id', deleteInterview);

module.exports = router;
