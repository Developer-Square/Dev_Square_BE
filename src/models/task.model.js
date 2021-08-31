const mongoose = require('mongoose');
const { paginate, toJSONWithDates } = require('./plugins');
const Project = require('./project.model');
const User = require('./user.model');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Project,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      default: 'notStarted',
      enum: ['notStarted', 'inProgress', 'onHold', 'cancelled', 'completed'],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSONWithDates);
taskSchema.plugin(paginate);

/**
 * @typedef Task
 */
const Task = mongoose.model('Task', taskSchema);

module.exports.taskSchema = taskSchema;
module.exports.Task = Task;
