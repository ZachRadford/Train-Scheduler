
$(document).ready(function(){

	var config = {
	    apiKey: "AIzaSyBZHj11EqxUdAJoPRi8nG9Y45s_JpsnF50",
	    authDomain: "train-scheduler-f4f2a.firebaseapp.com",
	    databaseURL: "https://train-scheduler-f4f2a.firebaseio.com",
	    projectId: "train-scheduler-f4f2a",
	    storageBucket: "train-scheduler-f4f2a.appspot.com",
	    messagingSenderId: "1020435820509"
  	};

  	firebase.initializeApp(config);

  	var database = firebase.database();



	$("#trainForm").on("submit", function(event){
		event.preventDefault();

		var values = $(this).serializeArray()
		console.log(values)

		values = formatData(values)
		console.log("2", values)

		writeData(values);

	
	})


	var trainsRef = database.ref();
	trainsRef.on('value', function(snapshot){
		$("#trainSchedule tbody").empty();
		snapshot.forEach(function(childSnapshot){
			var row = $("<tr>")

			row.append($("<td>").text(childSnapshot.val().departure_city))
			row.append($("<td>").text(childSnapshot.val().arrival_city))
			row.append($("<td>").text(childSnapshot.val().frequency_of_train))
			row.append($("<td>").text(childSnapshot.val().time_of_train))
			row.append($("<td>").text(fuckTime(childSnapshot.val().time_of_train, childSnapshot.val().frequency_of_train)))



			$("#trainSchedule tbody").append(row)

		})
	})



	function writeData(values){
		database.ref().push(values)
	}



	function formatData(values){
		var formattedData = {}

		values.forEach(function(value){
			formattedData[value.name] = value.value;
		})

		return formattedData
	}



	function fuckTime(time_of_train, frequency_of_train){
		var now = new Date()

		var originalTime = new Date(time_of_train)
		console.log(originalTime)

		var difference = originalTime - now

		console.log(difference.getMinutes())
	}



});