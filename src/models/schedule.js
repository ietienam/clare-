const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'Please provide a userId'],
      unique: true,
    },
    scheduledDates: {
      type: [String],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;