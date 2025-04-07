const mongoose = require('mongoose');

const callStatusSchema = new mongoose.Schema(
  {
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    telecaller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['connected', 'not_connected'],
      required: true,
    },
    response: {
      type: String,
      enum: [
        'discussed',
        'callback',
        'interested',
        'busy',
        'rnr', 
        'switched_off',
      ],
      required: true,
    },
    call_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('CallStatus', callStatusSchema);
