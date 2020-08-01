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
  relationships: {
    type: Array,
    default: [],
    items: {
      type: Object,
      properties: {
        _id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
        },
        spouse: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'relatives',
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
      },
    },
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('relatives', RelativeSchema);
