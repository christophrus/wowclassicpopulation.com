const mongoose = require('mongoose');

const { Schema } = mongoose;

const TimeSchema = new Schema({
  date: { type: Date, required: true, index: true },
  realm: { type: String, required: true, index: true },
  faction: { type: String, required: true, index: true },
  onlineByClass: {
    druid: { type: Number },
    hunter: { type: Number },
    mage: { type: Number },
    priest: { type: Number },
    rogue: { type: Number },
    warlock: { type: Number },
    warrior: { type: Number },
    shaman: { type: Number },
    paladin: { type: Number },
  },
  onlineTotal: { type: Number, required: true },
});

module.exports = mongoose.model('Time', TimeSchema);
