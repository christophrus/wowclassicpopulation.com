const mongoose = require('mongoose');

const { Schema } = mongoose;

const characterSchema = new Schema({
  name: { type: String, required: true, index: true },
  realm: { type: String, required: true, index: true },
  faction: { type: String, required: true, index: true },
  class: { type: String, required: true, index: true },
  race: { type: String, required: true, index: true },
  guild: { type: String, index: true },
  level: { type: Number, required: true, index: true },
  lastSeen: { type: Date, required: true }
});

module.exports = mongoose.model('Character', characterSchema);
