'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema
var ExamSchema = new Schema({
  title: String
});

// Validations
ExamSchema.path('title').validate(function (str) {
  return str != '' || str != Null;
}, 'Name must be a valid string.');

mongoose.model('Exam', ExamSchema);
