'use strict';

// Dummy exam data
var revisionStart = moment(),
    startHour = 9,
    startMinute = 0,
    endHour = 18,
    endMinute = 0,

    revisionChunks = [],
    exams =
[
    {
        title: "TTS",
        portion: 0.4,
        components: [
            {name: "Read Textbook", portion: 0.25},
            {name: "Solve Tutorials", portion: 0.25},
            {name: "Revise Lecture Notes", portion: 0.25},
            {name: "Attempt Past Papers", portion: 0.25}
        ],
        date: moment("2014-01-23 14:30"),
        duration: moment.duration(2, "hours")
    },
    {
        title: "IAR",
        portion: 0.2,
        components: [
            {name: "Read Textbook", portion: 0.35},
            {name: "Solve Tutorials", portion: 0.35},
            {name: "Revise Lecture Notes", portion: 0.3}
        ],
        date: moment("2014-01-29 9:30"),
        duration: moment.duration(2, "hours")
    },
    {
        title: "DS",
        portion: 0.2,
        components: [
            {name: "Read Textbook", portion: 0.35},
            {name: "Solve Tutorials", portion: 0.35},
            {name: "Revise Lecture Notes", portion: 0.3}
        ],
        date: moment("2014-01-23 9:30"),
        duration: moment.duration(2, "hours")
    },
    {
        title: "EXC",
        portion: 0.2,
        components: [
            {name: "Read Textbook", portion: 0.5},
            {name: "Revise Lecture Notes", portion: 0.25},
            {name: "Attempt Past Papers", portion: 0.25}
        ],
        date: moment("2014-01-20 12:30"),
        duration: moment.duration(2, "hours")
    },

];

// === Algorithm ===

// Sort exams by date (earlyest first)
exams.sort(function(a,b){return a.date.unix() - b.date.unix()});
// Find latest exam and set time of revisionEnd
var lastExam = exams[exams.length - 1];
// change time of revisionStart in order to count days correctly
var revisionLength = lastExam.date.diff( moment(revisionStart.format()).hour(startHour).minute(startMinute) , "days");
console.log("Revision lenght -", revisionLength, "days" );

// Divide Revision/Exam period in chunks between exams
var currentExams = [],
    examIndex = exams.length - 1,
    examinedDate = moment(lastExam.date.format());


for (var i = 0; i < revisionLength; i++) {
    console.log("Checking", examinedDate.format("DD-MM-YY"));
    // Check if there is an exam on the current day
    if (exams[examIndex].date.format("DDMMYY") == examinedDate.format("DDMMYY")) {
        while (exams[examIndex].date.format("DDMMYY") == examinedDate.format("DDMMYY")) {
            // End current revision chunk
            if (revisionChunks.length > 0) {
                var currentChunk = revisionChunks[revisionChunks.length - 1];
                currentChunk.start = moment(exams[examIndex].date.format()).add(exams[examIndex].duration);
                // Add first slice unless it was added in previous step
                if (examIndex < exams.length-1 && exams[examIndex].date.format("DDMMYY") != exams[examIndex+1].date.format("DDMMYY")) {
                    currentChunk.slices.push({
                        end: moment(examinedDate.format()).hours(endHour).minutes(endMinute),
                        start: moment(exams[examIndex].date.format()).add(exams[examIndex].duration)
                    });
                }
            }
            // Check if next exam is on the same day
            var sliceStart;
            if (examIndex > 0 && exams[examIndex-1].date.format("DDMMYY") == exams[examIndex].date.format("DDMMYY")) {
                sliceStart = moment(exams[examIndex-1].date.format()).add(exams[examIndex-1].duration);
            } else {
                sliceStart = moment(examinedDate.format()).hours(startHour).minutes(startMinute);
            }
            // Push new chunk in list
            console.log("Today:", exams[examIndex].title);
            currentExams.push(exams[examIndex]);
            revisionChunks.push({
                exams: currentExams.slice(0),
                end: moment(exams[examIndex].date.format()),
                slices: [
                    {
                        end: moment(exams[examIndex].date.format()),
                        start: sliceStart
                    }
                ]
            });

            if (examIndex > 0) {
                examIndex -= 1;
            } else {
                break;
            }
        }
    }
    // Else add day to current revision chunk
    else {
        revisionChunks[revisionChunks.length - 1].slices.push({
            end: moment(examinedDate.format()).hours(endHour).minutes(endMinute),
            start: moment(examinedDate.format()).hours(startHour).minutes(startMinute)
        });
    };


    // TODO: Starting from last chunk proportionally split time between remaining exams, keeping track of spent hours(?)
    // TODO: Round up from .5
    // TODO: Allocate last exam remaining portion

    // Decrement the current date
    examinedDate.subtract(1, "days");
};
// End final revision chunk
var currentChunk = revisionChunks[revisionChunks.length-1];
currentChunk.start = moment(revisionStart.format());

console.log(revisionChunks);



// b = moment(Date.now())
// moment(b.diff(a)).format("mm:ss")
