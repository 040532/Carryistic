const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  startinglatitude: Number,
  startinglongitude: Number,
  endinglatitude: Number,
  endinglongitude: Number,
  delivery:[
    {type: Schema.Types.ObjectId, ref: 'Employee'}
  ]
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;