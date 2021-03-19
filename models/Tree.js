const mongoose = require('mongoose');

const TreeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    required: true,
    items: {
      type: Object,
      properties: {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'users',
        },
        role: Number,
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
