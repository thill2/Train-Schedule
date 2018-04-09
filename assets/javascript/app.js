$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyCpQSCheQRDdl8mSpo2zmCSq-Om6Q-9fvQ",
    authDomain: "trains-b3e32.firebaseapp.com",
    databaseURL: "https://trains-b3e32.firebaseio.com",
    projectId: "trains-b3e32",
    storageBucket: "trains-b3e32.appspot.com",
    messagingSenderId: "310118769322"
  };
  firebase.initializeApp(config);
 
  var database = firebase.database();

	$("#addTrainBtn").on("click", function(event){
    event.preventDefault();
		var trainName = $("#trainNameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
    var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").format("X");
		var frequencyInput = $("#frequencyInput").val().trim();

		console.log(trainName);
		console.log(destination);
		console.log(trainTimeInput);
		console.log(frequencyInput);

		// temp object
		var newTrain = {
			name: trainName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		}

		// pushing temp object to firebase
		database.ref().push(newTrain);

		// clear inputs
		$("#trainNameInput").val("");
		$("#destinationInput").val("");
		$("#trainTimeInput").val("");
		$("#frequencyInput").val("");

		// prevents page from refreshing
		return false;
	});

	database.ref().on("child_added", function(childSnapshot, prevChildKey){

		console.log(childSnapshot.val());

		// assign firebase variables to snapshots.
		var firebaseName = childSnapshot.val().name;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;
		
		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
		
		// log times
		console.log(minutes);
		console.log(nextTrainArrival);
		console.log(moment().format("hh:mm A"));
		console.log(moment().format("X"));

		// append table with new data 
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
});
