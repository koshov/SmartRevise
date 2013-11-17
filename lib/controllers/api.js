'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Exam = mongoose.model('Exam'),
    async = require('async');

// // Return a list of thing 'names'
// exports.awesomeThings = function(req, res) {
//   return Thing.find(function (err, things) {
//     if (!err) {
//       var thingNames = [];

//       async.each(things, function (thing, cb) {
//         thingNames.push(thing.name);
//         cb();
//       }, function (err) {
//         return res.send(thingNames);
//       });
//     } else {
//       return res.send(err);
//     }
//   });
// };


// Exams API
exports.getExams = function(req, res) {
  return Exam.find(function (err, exams) {
    if (!err) {
      var examNames = [];

      async.each(exams, function (exams, cb) {
        examNames.push(exams);
        cb();
      }, function (err) {
        return res.send(examNames);
      });
    } else {
      return res.send(err);
    }
  });
};

exports.addExam = function(req, res) {
  Exam.create(
    { name : req.params['name'] },
    function(err) {
      return res.send(true);
    }
  );
};

exports.delExam = function(req, res) {
  Exam.remove(
    { name : req.params['name'] },
    function(err) {
      return res.send(true);
    }
  );
};
