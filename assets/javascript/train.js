
$(document).ready(function(){

	 var config = {
		    apiKey: "AIzaSyCMsOqLxqriJkdcasa8FCd9_Wygt3d4cck",
		    authDomain: "train-homework-3205f.firebaseapp.com",
		    databaseURL: "https://train-homework-3205f.firebaseio.com",
		    projectId: "train-homework-3205f",
		    storageBucket: "train-homework-3205f.appspot.com",
		    messagingSenderId: "460020105624"
		  };


  	firebase.initializeApp(config);

  	var database = firebase.database();


  	var options =  {
	  
	  onKeyPress: function(cep, event, currentField, options){
	    console.log('An key was pressed!:', cep, ' event: ', event,
	                'currentField: ', currentField, ' options: ', options);
	  },
	  onChange: function(cep){
	    console.log('cep changed! ', cep);
	  },
	  onInvalid: function(val, e, f, invalid, options){
	    var error = invalid[0];
	    console.log ("Digit: ", error.v, " is invalid for the position: ", error.p, ". We expect something like: ", error.e);
	  }
	};


  	$("input[name='frequency_of_train']").mask('99:99', options)
  	$("input[name='time_of_train']").mask('90:99', options)
  	
  	



	$("#trainForm").on("submit", function(event){
		event.preventDefault();

		var values = $(this).serializeArray()

		values = formatData(values)

		writeData(values);

	
	})


	var trainsRef = database.ref();

	trainsRef.on('value', function(snapshot){
		$("#trainSchedule tbody").empty();
		snapshot.forEach(function(childSnapshot){
			var row = $("<tr>")

			var data = childSnapshot.val()

			row.append($("<td>").text(data.departure_city))
			row.append($("<td>").text(data.arrival_city))
			row.append($("<td>").text(data.frequency_of_train))
			row.append($("<td>").text(data.time_of_train))
			row.append($("<td>").text(calcTime(data.time_of_train, data.frequency_of_train)))
			
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



	function calcTime(time_of_train, frequency_of_train){
		
		var now = moment()

		var totFormat = moment(time_of_train, "HH:mm")

		var timeSince = now.diff(totFormat, 'minutes')

		var lastTrain = timeSince % frequency_of_train

		var nextTrain = frequency_of_train - lastTrain

		var hours = Math.floor(nextTrain / 60)

		var minutes = nextTrain % 60

		console.log(nextTrain)

		var nextTrainString = ""

		if (hours > 0) {
			nextTrainString += hours + " hour"

			if (hours > 1){
				nextTrainString += "s"
			}

			nextTrainString += ", "
		}


		nextTrainString +=  minutes + " minute"
		if (minutes > 1){
			nextTrainString += "s"
		}

		return nextTrainString
		
	}



});