'use strict';

function algo(pExams) {
    // Dummy exam data
    var revisionStart = moment(),
        startHour = 9,
        startMinute = 0,
        endHour = 18,
        endMinute = 0,
        smallestChunk = 30,

        revisionChunks = [],

        exams = pExams;

    // === Algorithm ===

    // Sort exams by date (earlyest first)
    exams.sort(function(a,b){return a.date.unix() - b.date.unix()});
    // Find latest exam and set time of revisionEnd
    var lastExam = exams[exams.length - 1];
    // Change time of revisionStart in order to count days correctly
    // TODO: check if this is actually true
    var revisionLength = lastExam.date.diff( moment(revisionStart.format()).hours(startHour).minutes(startMinute) , "days") + 1;
    console.log("Revision lenght -", revisionLength, "days" );

    // Divide Revision/Exam period in chunks between exams
    var currentExams = [],
        examIndex = exams.length - 1,
        examinedDate = moment(lastExam.date.format()),
        revisionTime = 0;
    for (var i = 0; i < revisionLength; i++) {
        console.log("Checking", examinedDate.format("DD-MM-YY"));
        // Check if there is an exam on the current day
        if (exams[examIndex].date.format("DDMMYY") == examinedDate.format("DDMMYY")) {
            while (exams[examIndex].date.format("DDMMYY") == examinedDate.format("DDMMYY")) {
                // End current revision chunk
                if (revisionChunks.length > 0) {
                    var currentChunk = revisionChunks[revisionChunks.length-1];
                    currentChunk.start = moment(exams[examIndex].date.format()).add(exams[examIndex].duration);
                    // Add first slice unless it was added in previous step
                    if (examIndex < exams.length-1 && exams[examIndex].date.format("DDMMYY") != exams[examIndex+1].date.format("DDMMYY")) {
                        currentChunk.slices.push({
                            end: moment(examinedDate.format()).hours(endHour).minutes(endMinute),
                            start: moment(exams[examIndex].date.format()).add(exams[examIndex].duration)
                        });
                        var newSlice = currentChunk.slices[currentChunk.slices.length-1]
                        revisionTime += newSlice.end.diff(newSlice.start, "minutes");
                        console.log(revisionTime);
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
                    slices: [{
                        end: moment(exams[examIndex].date.format()),
                        start: sliceStart
                    }]
                });
                var currentChunk = revisionChunks[revisionChunks.length-1];
                var newSlice = currentChunk.slices[currentChunk.slices.length - 1]
                revisionTime += newSlice.end.diff(newSlice.start, "minutes");
                console.log(revisionTime);

                if (examIndex > 0) {
                    examIndex -= 1;
                } else {
                    break;
                }
            }
        }
        // Else add day to current revision chunk
        else {
            var currentChunk = revisionChunks[revisionChunks.length-1];
            if (i < revisionLength-1) {
                currentChunk.slices.push({
                    end: moment(examinedDate.format()).hours(endHour).minutes(endMinute),
                    start: moment(examinedDate.format()).hours(startHour).minutes(startMinute)
                });
                var newSlice = currentChunk.slices[currentChunk.slices.length - 1]
                revisionTime += newSlice.end.diff(newSlice.start, "minutes");
                console.log(revisionTime);
            } else {
                // First day's revision begins now
                var todayHour = moment().hours(),
                    todayMinute = Math.ceil(moment().minutes() / 30) * 30,
                    todayStart = moment(moment().format("YYYY-MM-DD")).hours(todayHour).minutes(todayMinute),
                    todayEnd = moment(examinedDate.format()).hours(endHour).minutes(endMinute);
                if (todayEnd.diff(todayStart) > 0) {
                    currentChunk.slices.push({
                        end: todayEnd,
                        start: todayStart
                    });
                    var newSlice = currentChunk.slices[currentChunk.slices.length - 1]
                    revisionTime += newSlice.end.diff(newSlice.start, "minutes");
                    console.log(revisionTime);
                }
            }
        };

        // Decrement the current date
        examinedDate.subtract(1, "days");
    };
    // End final revision chunk
    var currentChunk = revisionChunks[revisionChunks.length-1];
    currentChunk.start = moment(revisionStart.format());
    console.log(revisionChunks);

    // Find revision hours per exam
    for (var i = exams.length - 1; i >= 0; i--) {
        exams[i].time = revisionTime * exams[i].portion / 100;
    };

    // Starting from last chunk proportionally (to remaining hours of each subject)
    //   split time between exams, keeping track of spent hours
    var revisionStore = []
    for (var i = 0; i < revisionChunks.length; i++) {
        for (var j = 0; j < revisionChunks[i].slices.length; j++) {
            console.log("---");
            // Calculate total revision time for the exams in this chunk
            // NOTE: has to be calculated for every slice since times change on each iteration
            var examsTotalTime = 0;
            for (var k = 0; k < revisionChunks[i].exams.length; k++) {
                examsTotalTime += revisionChunks[i].exams[k].time;
            };
            var sliceLen = revisionChunks[i].slices[j].end.diff(revisionChunks[i].slices[j].start, "minutes");
            var delta = 0;
            for (var k = 0; k < revisionChunks[i].exams.length; k++) {
                if (revisionChunks[i].exams[k].time > 0 && sliceLen >= smallestChunk) {
                    var subjectTime = 0;
                    if (k < revisionChunks[i].exams.length - 1){
                        subjectTime = (revisionChunks[i].exams[k].time / examsTotalTime) * sliceLen;
                    } else {
                        // Last chunk gets the remaining time
                        subjectTime = sliceLen - delta;
                    }
                    // Make sure subjectTime is a multiple of smallestChunk to prevent irregular revision lengths
                    subjectTime = Math.floor(subjectTime/smallestChunk) * smallestChunk;
                    // Not needed if there is enough time for all exams
                    if (revisionChunks[i].exams[k].time - subjectTime <= 0) {
                        var subjectTime = Math.ceil(revisionChunks[i].exams[k].time / smallestChunk) * smallestChunk;
                    }
                    if (subjectTime > 0) {
                        revisionChunks[i].exams[k].time -= subjectTime;
                        revisionStore.push({
                            title: revisionChunks[i].exams[k].title,
                            start: moment(revisionChunks[i].slices[j].start.format()).add(delta, "minutes").toDate(),
                            end: moment(revisionChunks[i].slices[j].start.format()).add((delta+subjectTime), "minutes").toDate(),
                            allDay: false,
                            color: exams[k].color
                        });
                        delta += subjectTime;
                        console.log(revisionChunks[i].exams[k].title, ":", subjectTime);
                        console.log("Time remaining:", revisionChunks[i].exams[k].time);
                    }
                }
            };
        };
    };
    // Alert in case an exam is scheduled too soon
    for (var i = 0; i < exams.length; i++) {
        if (exams[i].time > 120) {
            // TODO: display this to user
            var warning = "Whoops! The " + exams[i].title + " exam is scheduled too early and we could not allocate " + (exams[i].time / 60) + " hours of revision."
            console.debug(warning);
        }
    };

    // Currently the last event in revisionStore is the first exam session
    var firstDay = moment(revisionStore[revisionStore.length - 1].start);

    for (var i = 0; i < exams.length; i++) {
        revisionStore.push({
            title: exams[i].title + " exam",
            start: exams[i].date.toDate(),
            end: moment(exams[i].date.format()).add(exams[i].duration).toDate(),
            allDay: false,
            color: "#C74258"
        });
    };
    return {events: revisionStore, firstDay: firstDay}
}
