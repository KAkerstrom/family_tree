const mongoose = require('mongoose');
const Relative = require('./Relative');

const TreeSchema = mongoose.Schema({
  members: {
    type: Array,
    required: true,
    items: {
      type: Object,
      properties: {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'users',
        },
        role: Number, // 0 = No permissions, 1 = read, 2 = add, 3 = edit, 4 = delete
      },
    },
  },
  private: {
    type: Boolean,
    default: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('trees', TreeSchema);
