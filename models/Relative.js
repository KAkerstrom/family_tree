const mongoose = require('mongoose');

const RelativeSchema = mongoose.Schema({
  tree: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trees',
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'undefined'],
    default: 'undefined',
  },
  birthdate: {
    type: Date,
    required: false,
  },
  deathdate: {
    type: Date,
    required: false,
  },
  attributes: {
    type: Array,
    required: false,
    items: {
      type: Object,
      properties: {
        name: { type: String },
        value: { type: String },
      },
      required: ['name', 'value'],
    },
  },
  children: {
    type: Array,
    default: [],
    items: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'relatives',
    },
  },
  parents: {
    type: Array,
    default: [],
    items: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'relatives',
    },
  },
  spouses: {
    type: Array,
    default: [],
    items: {
      type: Object,
      properties: {
        spouse: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'users',
        },
        start_date: {
          type: Date,
        },
        end_date: {
          type: Date,
        },
        required: ['spouse'],
      },
    },
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('relatives', RelativeSchema);
