$(document).ready(function(){
// Initialize Firebase
    var config = {
        apiKey: "AIzaSyBN6_kv4-L47QMKdnPOhLoZDsDIM9VnEtU",
        authDomain: "train-scheduler-721bc.firebaseapp.com",
        databaseURL: "https://train-scheduler-721bc.firebaseio.com",
        projectId: "train-scheduler-721bc",
        storageBucket: "train-scheduler-721bc.appspot.com",
        messagingSenderId: "988441910947"
    };
    firebase.initializeApp(config);

    database = firebase.database();

    //global variables, used for firebase
    var name;
    var dest;
    var firstTrainTime;
    var freq;

    function send_form(){
        name = $("#inputTrainName").val().trim();
        dest = $("#inputDestination").val().trim();
        firstTrainTime = $("#inputFirstTime").val().trim();
        freq = $("#inputFrequency").val().trim();

        database.ref().push({
            name: name,
            dest: dest,
            firstTrainTime: firstTrainTime,
            freq: freq,
            //for this assignment, assume that
            firstDate: moment().format("YYYY-MM-DD")
        });

        //clear values in input fields after submission
        $("#inputTrainName").val("");
        $("#inputDestination").val("");
        $("#inputFirstTime").val("");
        $("#inputFrequency").val("");

    }

    database.ref().on("value", function(snapshot){
        $("tbody").html("");
        snapshot.forEach(function(value){
            var schedule_row = $("<tr>");
            
            var name_cell = $("<td>").text(value.val().name);
            schedule_row.append(name_cell);

            var destination_cell = $("<td>").text(value.val().dest);
            schedule_row.append(destination_cell);

            var freq_text = value.val().freq;
            var freq_cell = $("<td>").text(freq_text);
            schedule_row.append(freq_cell);

            //concatenate firstDate and firstTime to create first datetime
            var first_datetime = moment(value.val().firstDate + " " + value.val().firstTrainTime, "YYYY-MM-DD HH:mm");
            var current_date = moment();
            var diff = current_date.diff(first_datetime, "minutes");

            //based on first datetime and frequency, determines minutes to next arribal
            var minutes_to_next = parseFloat(freq_text)-(diff % parseFloat(freq_text));
            var next_arrival;
            if (minutes_to_next != 0){
                next_arrival = current_date.add(minutes_to_next, "minutes").format("hh:mm a");
            }
            else{
                next_arrival = current_date.add(freq, "minutes").format("hh:mm a");
                minutes_to_next = freq;
            }

            var next_arrival_cell = $("<td>").text(next_arrival);
            schedule_row.append(next_arrival_cell);

            var minutes_away_cell = $("<td>").text(minutes_to_next);
            schedule_row.append(minutes_away_cell);

            $("tbody").append(schedule_row);
        });
    });

    $("#submit-btn").on("click", function(event){
        event.preventDefault();

        send_form();
    });
});