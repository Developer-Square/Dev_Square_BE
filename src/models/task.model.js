const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const taskSchema = mongoose.Schema(
  {
    stack: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    difficulty: {
      type: String,
      trim: true,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    status: {
      type: String,
      trim: true,
      default: 'notStarted',
      enum: ['notStarted', 'inProgress', 'onHold', 'cancelled', 'completed'],
    },
    assigned: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

/**
 * @typedef Task
 */
const Task = mongoose.model('Task', taskSchema);

module.exports.taskSchema = taskSchema;
module.exports.Task = Task;
