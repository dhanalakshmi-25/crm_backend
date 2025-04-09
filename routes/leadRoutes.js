const express = require('express');
const router = express.Router();
const {getAllLeads ,createLead ,editLeadAddress ,deleteLead ,updateLeadStatus ,getConnectedCalls ,getRecentActivities ,getCallTrends ,getConnectedCallRecords} = require('../controller/leadController');
const { protect } = require("../middelware/authMiddleware")

router.use(protect);

// Get all leads
router.get('/',protect , getAllLeads);

// Add new lead
router.post('/', protect , createLead);

// Edit only address
router.put('/:id', protect , editLeadAddress);

// Delete lead
router.delete('/:id', protect , deleteLead);

// Update call status and response
router.put('/:id/status', protect , updateLeadStatus);

// Get dashboard connected calls
router.get('/dashboard/calls', protect , getConnectedCalls);

router.get('/dashboard/recent-activities' , protect ,getRecentActivities);

router.get('/dashboard/call-trends' , protect ,getCallTrends);

router.get('/dashboard/connected-calls' , protect ,getConnectedCallRecords)




module.exports = router;
