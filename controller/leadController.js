const Lead = require('../models/Lead');
const User = require('../models/User');
const moment = require('moment');

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate('added_by', 'name');
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new lead
 exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, address, added_by } = req.body;

    const lead = new Lead({
      name,
      email,
      phone,
      address,
      added_by,
      // callStatus: callStatus || {
      //   status: '',
      //   response: '',
      //   updatedAt: null,
      //   telecallerName: '',
      // },
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Edit lead address only
exports.editLeadAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { address },
      { new: true }
    );
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update call status and response
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status, response, telecallerName } = req.body;
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        callStatus: {
          status,
          response,
          updatedAt: new Date(),
          telecallerName,
        },
      },
      { new: true }
    );
    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get dashboard connected calls
exports.getConnectedCalls = async (req, res) => {
  try {
    // 1. Total Telecallers
    const totalTelecallers = await User.countDocuments({ role: 'telecaller' });

    const totalCallsMade = await Lead.countDocuments({
      'callStatus.status': { $ne: '' },
    });

    const totalConnectedCalls = await Lead.countDocuments({
      'callStatus.status': 'Connected',
    });

    res.json({
      totalTelecallers,
      totalCallsMade,
      totalConnectedCalls
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    // Recent Calls (last 5 leads where a call status has been set)
    const recentCalls = await Lead.find({ 'callStatus.status': { $ne: '' } })
      .sort({ 'callStatus.updatedAt': -1 })
      .limit(5)
      .select('name callStatus');

    // Recent Leads (last 5 leads added, based on createdAt)
    const recentLeads = await Lead.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email phone createdAt');

    // Map call response
    const formattedCalls = recentCalls.map(lead => ({
      name: lead.name,
      telecallerName: lead.callStatus.telecallerName,
      response: lead.callStatus.response,
      status: lead.callStatus.status,
      updatedAt: lead.callStatus.updatedAt
    }));

    const formattedLeads = recentLeads.map(lead => ({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      addedAt: lead.createdAt
    }));

    res.json({
      recentCalls: formattedCalls,
      recentLeads: formattedLeads
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getCallTrends = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const sevenDaysAgo = moment().subtract(6, 'days').startOf('day');

    const trends = await Lead.aggregate([
      {
        $match: {
          'callStatus.status': { $ne: '' },
          'callStatus.updatedAt': {
            $gte: sevenDaysAgo.toDate(),
            $lte: today.clone().endOf('day').toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$callStatus.updatedAt" },
          },
          calls: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Ensure all 7 days are present in result
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().subtract(6 - i, 'days').format("YYYY-MM-DD");
      const trend = trends.find(t => t._id === date);
      result.push({ date, calls: trend ? trend.calls : 0 });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConnectedCallRecords = async (req, res) => {
  try {
    const connectedLeads = await Lead.find({ 'callStatus.status': 'Connected' })
      .sort({ 'callStatus.updatedAt': -1 });

    const records = connectedLeads.map(lead => ({
      customerName: lead.name,
      callDateTime: lead.callStatus.updatedAt,
      telecallerName: lead.callStatus.telecallerName,
      callResponse: lead.callStatus.response,
    }));

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
