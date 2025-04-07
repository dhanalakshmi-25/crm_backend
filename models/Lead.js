const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    callStatus: {
      status: {
        type: String,
        enum: ['' ,'Connected', 'Not Connected'],
        default: '',
      },
      response: {
        type: String,
        default: '',
      },
      updatedAt: {
        type: Date,
      },
      telecallerName: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
