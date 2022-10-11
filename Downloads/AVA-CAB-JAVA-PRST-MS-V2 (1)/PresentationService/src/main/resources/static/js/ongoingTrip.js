
var empId = localStorage.getItem("employeeDetailId");
var queryParams = window.location.search;
var id = queryParams.split("=");
var tripCabId = id[1];

window.onload = fetchOngoingTrip;
var xhr = new XMLHttpRequest();
function fetchOngoingTrip() {
	try{
	$('#tablebody').empty();
	xhr=createHttpRequest("GET", pathName+"/bookingInfoService/tripService/getTripInfoById/" + tripCabId, true,"EMPLOYEE");
	xhr.onreadystatechange = function() {

	if (xhr.readyState == 4 && xhr.status == 600) {

		if (xhr.responseText == "" || xhr.responseText == undefined) {
			window.location.href = "/user_reserve_cab.html";
		}

	
	}
	else if(xhr.readyState == 4 && xhr.status == 200){
			var tripSheet = JSON.parse(this.responseText);
		displayOngoingTripSheet(tripSheet);
		changeFieldNames();
	}
	else if(xhr.readyState == 4 && xhr.status == 562){
		window.location.href ="/accessdenied";
	}

};
	xhr.send(null);

	}
	catch(e){
		jsExceptionHandling(e,"ongoingTrip.js-fetchOngoingTrip()");
	}
	
}

var counter = 0;
var request;
function displayOngoingTripSheet(tripBO) {
	try{
		var rowLength = tripBO.bookingRequest.length;
	document.getElementById("cabnumber").innerHTML = tripBO.cabNumber;
	document.getElementById("drivername").innerHTML = tripBO.driverName;
	document.getElementById("drivernumber").innerHTML = tripBO.driverNumber;
	document.getElementById("destination").innerHTML = tripBO.destination;
	var date = tripBO.dateOfTravel;
	request = tripBO.requestType;
	var dateOfTravel = date.split("\-");
	document.getElementById("date").innerHTML = dateOfTravel[2] + "-" + dateOfTravel[1] + "-" + dateOfTravel[0];
	var timeSlot = tripBO.timeSlot;
	var timeSplit = timeSlot.split(":");
	var hour = timeSplit[0];
	if (hour < 12) {
		if (hour == 00) {
			document.getElementById("timeslot").innerHTML = "12" + ":" + timeSplit[1] + " AM";
		}
		else {
			document.getElementById("timeslot").innerHTML = hour + ":" + timeSplit[1] + " AM";
		}

	}
	else if (hour == 12) {
		document.getElementById("timeslot").innerHTML = hour + ":" + timeSplit[1] + " PM";
	}
	else {
		hour = hour - 12;
		if (hour < 10) {
			document.getElementById("timeslot").innerHTML = "0" + hour + ":" + timeSplit[1] + " PM";
		}
		else {
			document.getElementById("timeslot").innerHTML = hour + ":" + timeSplit[1] + " PM";
		}

	}

	var tbody = document.getElementById("tablebody");
	for (var rows = 0; rows < rowLength; rows++) {
		var tr = document.createElement('tr');
		counter++;
		tr.id = "tr" + counter;
		tbody.appendChild(tr);
		tr.className = "row-bg-style";

		var sno = document.createElement('td');
		sno.className = "number-spacing";
		sno.innerHTML = rows + 1;
		tr.appendChild(sno);

		var empName = document.createElement('td');
		empName.className = "spacing";
		empName.innerHTML = tripBO.bookingRequest[rows].employeeName;
		tr.appendChild(empName);

		var empId = document.createElement('td');
		empId.className = "spacing";
		empId.innerHTML =  tripBO.bookingRequest[rows].employeeId;
		tr.appendChild(empId);
		
		var employeePhNumber = document.createElement('td');
		employeePhNumber.className = "spacing";
		employeePhNumber.innerHTML = tripBO.bookingRequest[rows].phoneNumber;
		tr.appendChild(employeePhNumber);

		var dropPoints = document.createElement('td');
		dropPoints.className = "spacing";
		dropPoints.innerHTML =  tripBO.bookingRequest[rows].dropPoint;
		tr.appendChild(dropPoints);
		
		if(request == 'Pickup'){
			var location = document.createElement('td');
			location.className = "spacing";
			location.innerHTML =  tripBO.bookingRequest[rows].location;
			tr.appendChild(location);
		}
		tbody.appendChild(tr);

	}

	document.getElementById("passengers").innerHTML = "Number of passengers : " + rowLength;
	}
	catch(e){
		jsExceptionHandling(e,"ongoingTrip.js-displayOngoingTripSheet(tripBO)");
	}
	
}

function changeFieldNames() {
	if(request == "Drop"){
		var dropPoint = document.getElementById('changeDropLabel');
		dropPoint.innerHTML = "Drop Point";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Destination";
		var hideLocationData = document.getElementById('hideAndShowLocation');
		hideLocationData.style.display = "none";
	}
	else if(request == "Pickup"){
		var dropPoint = document.getElementById('changeDropLabel');
		dropPoint.innerHTML = "Pickup Point";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Source";
		var locationBox = document.getElementById('hideAndShowLocation');
		locationBox.style.display = "block";
	
	}
} 
