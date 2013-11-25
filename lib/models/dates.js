'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema
var DatesSchema = new Schema({
  start: String,
  end:   String
});

// Validations
DatesSchema.path('start').validate(function (str) {
  return str != '' || str != Null;
}, 'Name must be a valid string.');
DatesSchema.path('end').validate(function (str) {
  return str != '' || str != Null;
}, 'Name must be a valid string.');

mongoose.model('Dates', DatesSchema);
