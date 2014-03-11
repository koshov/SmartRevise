'use strict';

var mongoose = require('mongoose'),
    Exam = mongoose.model('Exam'),
    async = require('async');



// Exams
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
  var exam = req.body;
  console.log('Adding exam: ' + JSON.stringify(exam));
  Exam.create(exam,
    function(err) {
      return res.send(err);
    }
  );
};

exports.updateExam = function(req, res) {
  var exam = req.body;
  Exam.update(
    {title: exam.title},
    {date: exam.date},
    function(err) {
      return res.send(err);
    }
  );
};


exports.delExam = function(req, res) {
  Exam.remove(
    { title : req.params['title'] },
    function(err) {
      return res.send(err);
    }
  );
};
