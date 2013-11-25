'use strict';

var mongoose = require('mongoose'),
    Dates = mongoose.model('Dates'),
    Exam = mongoose.model('Exam'),
    async = require('async');



// Dates
exports.getDates = function(req, res) {
  return Dates.find(function (err, dates) {
    if (!err) {
      var dateObj = [];

      async.each(dates, function (dates, cb) {
        dateObj.push(dates);
        cb();
      }, function (err) {
        return res.send(dateObj);
      });
    } else {
      return res.send(err);
    }
  });
};

exports.setDates = function(req, res) {
  Dates.update(
    {
      start : req.params['start'],
      end: req.params['end']
    },
    function(err) {
      return res.send(true);
    }
  ).exec();
};


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
