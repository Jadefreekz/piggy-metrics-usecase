window.onload = function() {
	
	fetchTripHistory();
};

//var pathName = "http://localhost:8011/bookingInfoService/tripService"

var xhr;
var idSearch = window.location.search;
var tripCabId = idSearch.split("=")[1];
var requestType;

function changeFieldNames(){
	if(requestType == "Drop"){
		var dropPointLabel = document.getElementById('changeTh');
		dropPointLabel.innerText = "Drop Point";
		var sourceLabel = document.getElementById('sourceLabel');
		sourceLabel.innerHTML = "Source";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Destination";
		var locationThead = document.getElementById('locationThead');
		locationThead.style.display = "none";
	}
	else if(requestType == "Pickup"){
		var dropPointLabel = document.getElementById('changeTh');
		dropPointLabel.innerText = "Pickup Point";
		var sourceLabel = document.getElementById('sourceLabel');
		sourceLabel.innerHTML = "Destination";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Source";
	}
}
function fetchTripHistory() {

	try {

		var url = pathName + "/bookingInfoService/tripService/tripSheetInfo/" + tripCabId;
		xhr = createHttpRequest("GET", url, true, "ADMIN");
		//	xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {

				var data = JSON.parse(this.responseText);
				displayTripHistory(data);

			}
		};
		xhr.send(null);
	}
	catch (e) {
		jsExceptionHandling(e, "tripHistory.js-fetchTripHistory()");
	}
}
var dateOfTravel;
function displayTripHistory(tripBO) {
	try{
	document.getElementById("cabnumber").innerHTML = tripBO.cabNumber;
	document.getElementById("drivername").innerHTML = tripBO.driverName;
	document.getElementById("drivernumber").innerHTML = tripBO.driverNumber;
	document.getElementById("source").innerHTML = tripBO.source;
	document.getElementById("destination").innerHTML = tripBO.destination;
	var date = tripBO.dateOfTravel;
	dateOfTravel = tripBO.dateOfTravel;
	requestType = tripBO.requestType;
	changeFieldNames();
	var dateOfTravelValue = date.split("\-");
	document.getElementById("date").innerHTML = dateOfTravelValue[2] + "-" + dateOfTravelValue[1] + "-" + dateOfTravelValue[0];

	var timeSlotValue = timeFormatTo12Hr(tripBO.timeSlot, 0);
	document.getElementById("timeslot").innerHTML = timeSlotValue;

	document.getElementById("totalseats").innerHTML = tripBO.totalSeats;
	document.getElementById("allocatedseats").innerHTML = tripBO.allocatedSeats;
	document.getElementById("remainingseats").innerHTML = tripBO.remainingSeats;
	document.getElementById("status").innerHTML = tripBO.status;
	document.getElementById("starttime").innerHTML = timeFormatTo12Hr(tripBO.startTime, 0);
	document.getElementById("endtime").innerHTML = timeFormatTo12Hr(tripBO.endTime, 0);


	var counter = 0;
	var serialNumberCounter = 1;
	var tableBody = document.getElementById("tablebody");
	var rowLength = tripBO.bookingRequest.length;


	$("#tablebody tr").slice(1).remove();
	for (var rows = 0; rows < rowLength; rows++) {

		var tableRow = document.createElement('tr');
		counter++;
		tableRow.className = "row-bg-style";
		tableRow.id = "tr" + counter;

		var serialNumber = document.createElement('td');
		serialNumber.className = "spacing1";
		serialNumber.innerHTML = serialNumberCounter++;
		tableRow.appendChild(serialNumber);
		
		var idOfEmployee = document.createElement('td');
		idOfEmployee.className = "spacing1";
		idOfEmployee.innerHTML = tripBO.bookingRequest[rows].employeeId;
		tableRow.appendChild(idOfEmployee);

		var nameOfEmployee = document.createElement('td');
		nameOfEmployee.className = "spacing1";
		nameOfEmployee.innerHTML = tripBO.bookingRequest[rows].employeeName;
		tableRow.appendChild(nameOfEmployee);
		
		var phoneNumber = document.createElement('td');
		phoneNumber.className = "spacing1";
		phoneNumber.innerHTML = tripBO.bookingRequest[rows].phoneNumber;
		tableRow.appendChild(phoneNumber);

		var destinationDropPoint = document.createElement('td');
		destinationDropPoint.className = "spacing1";
		destinationDropPoint.innerHTML = tripBO.bookingRequest[rows].dropPoint;
		tableRow.appendChild(destinationDropPoint);
		
		if(requestType == 'Pickup'){
			var location = document.createElement('td');
			location.className = "spacing1 locationTooltip text-nowrap";
			location.title = tripBO.bookingRequest[rows].location;
			location.innerHTML = tripBO.bookingRequest[rows].location;
			tableRow.appendChild(location);
		}

		if (tripBO.bookingRequest[rows].reachedTime == "" || tripBO.bookingRequest[rows].reachedTime == null) {
			var employeeReachedTime = document.createElement('td');
			employeeReachedTime.className = "spacing1";
			employeeReachedTime.innerHTML = "-";
			tableRow.appendChild(employeeReachedTime);
		}
		else {
			var employeeReachedTime = document.createElement('td');
			employeeReachedTime.className = "spacing1";
			employeeReachedTime.innerHTML = timeFormatTo12Hr(tripBO.bookingRequest[rows].reachedTime, 0);
			tableRow.appendChild(employeeReachedTime);
		}



		if (tripBO.bookingRequest[rows].reachedTime == "" || tripBO.bookingRequest[rows].reachedTime == null) {
			var employeeStatus = document.createElement('td');
			employeeStatus.className = "spacing1";
			employeeStatus.innerHTML = "<button class='round1'></button>No Show";
			tableRow.appendChild(employeeStatus);
		}
		else {
			var employeeStatus = document.createElement('td');
			employeeStatus.className = "spacing1";
			employeeStatus.innerHTML = "<button class='round'></button>Reached";
			tableRow.appendChild(employeeStatus);
		}

		var employeeBookingId = document.createElement('td');
		employeeBookingId.className = "spacing1";
		employeeBookingId.innerHTML = tripBO.bookingRequest[rows].bookingId;
		employeeBookingId.style.display = "none";
		tableRow.appendChild(employeeBookingId);

		tableBody.appendChild(tableRow);

	}
	}
	catch(e){
		jsExceptionHandling(e, "tripHistory.js-displayTripHistory(tripBO)");
	}

}
