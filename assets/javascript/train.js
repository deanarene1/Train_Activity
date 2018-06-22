
$(document).ready(function () {


    var database = firebase.database();

    var freq = "";
    var trainTime = "";

    // Capture Button Click
    $("#add-train").on("click", function (event) {
        // prevent page from refreshing when form tries to submit itself
        event.preventDefault();

        // Capture nputs and store them into variables
        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var trainTime = $("#time-input").val();
        var freq = $("#frequency-input").val();


        var data = {
            name: name,
            trainTime: trainTime,
            destination: destination,
            freq: freq,

            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };
        database.ref().push(data);
    });

    database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {

        // $("#name-display").text(trainName);
        // $("#destination-display").text(destination);
        // $("#time-display").text(trainTime);
        // $("#frequency-display").text(freq);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(parseInt(snapshot.val().trainTime), "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % snapshot.val().freq;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = snapshot.val().freq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        var arrival = moment(nextTrain).format("hh:mm")

        var row = $('<tr>' +
            '<td scope="col-lg">' + snapshot.val().name + '</td>' +
            '<td scope="col-lg">' + snapshot.val().destination + '</td>' +
            '<td scope="col-lg">' + snapshot.val().freq + '</td>' +
            '<td scope="col-lg">' + arrival + '</td>' +
            '<td scope="col-lg">' + tMinutesTillTrain + '</td>' +
            '</tr>');
        $("#tbody").append(row)
        console.log(parseInt(snapshot.val().trainTime));
    });



});






