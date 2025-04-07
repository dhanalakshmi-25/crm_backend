const express = require('express');
const router = express.Router();
const {getAllLeads ,createLead ,editLeadAddress ,deleteLead ,updateLeadStatus ,getConnectedCalls ,getRecentActivities ,getCallTrends ,getConnectedCallRecords} = require('../controller/leadController');

// Get all leads
router.get('/', getAllLeads);

// Add new lead
router.post('/', createLead);

// Edit only address
router.put('/:id', editLeadAddress);

// Delete lead
router.delete('/:id', deleteLead);

// Update call status and response
router.put('/:id/status', updateLeadStatus);

// Get dashboard connected calls
router.get('/dashboard/calls', getConnectedCalls);

router.get('/dashboard/recent-activities' ,getRecentActivities);

router.get('/dashboard/call-trends' ,getCallTrends);

router.get('/dashboard/connected-calls' ,getConnectedCallRecords)




module.exports = router;
