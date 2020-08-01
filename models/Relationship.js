const mongoose = require('mongoose');

const RelationshipSchema = mongoose.Schema({
  spouses: {
    type: Array,
    min: 2,
    max: 2,
    items: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
    },
    required: true,
  },
  start_date: {
    type: Date,
    required: false,
  },
  end_date: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model('relationships', RelationshipSchema);
