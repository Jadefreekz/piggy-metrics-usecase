var querystr = window.location.search; // search the details from the previous screen

var id = querystr.split("="); //split the details
var tripId = id[1];
var bookingId = id[2];
var emplID = id[3];
var request;
window.onload = function(){
	getCompletedTrip();		
}
var xhr;
var xhrComplaints;
var data;
var tripBO;
var raiseBtn = document.getElementById("raiseBtn");    // To get the details from the completed trip Screen
raiseBtn.addEventListener("click", getComplaints);
var time;
var dateFormat;

function changeFieldName(){
	if(request == "Drop"){
		var dropPointLabel = document.getElementById('dropPoint');
		dropPointLabel.innerText = "Drop Point";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Destination";
		var location = document.getElementById('locationThead');
		location.style.display = "none";
	}
	else if(request == "Pickup"){
		var dropPointLabel = document.getElementById('dropPoint');
		dropPointLabel.innerText = "Pickup Point";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Source";
	}
}
function getCompletedTrip() {
	try {
		xhr = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/tripSheetInfo/" + tripId, true, "EMPLOYEE");
		xhr.onreadystatechange =

			function() {
				if ((xhr.readyState == 4 && xhr.status == 200) || (xhr.readyState == 4 && xhr.status == 666)) {
					tripBO = JSON.parse(this.responseText);
					displayCompletedTrip(tripBO);
				}
				else if (xhr.readyState == 4 && xhr.status == 562) {
					window.location.href = "/accessdenied";
				}

			};
		xhr.send(null);
	} catch (e) {
		jsExceptionHandling(e, "completedTrip.js-getCompletedTrip()");
	}
}


function displayCompletedTrip(tripBO) {
	try {

		// place the details from the database.
		document.getElementById('cabNumber').innerText = tripBO.cabNumber;
		document.getElementById('driverName').innerText = tripBO.driverName;
		document.getElementById('driverContact').innerText = tripBO.driverNumber;
		document.getElementById('destination').innerText = tripBO.destination;


		var date = tripBO.dateOfTravel;  // date format
		var dateOfTravel = date.split("\-");
		dateFormat = dateOfTravel[2] + "-" + dateOfTravel[1] + "-" + dateOfTravel[0];
		document.getElementById("date").innerHTML = dateFormat;

		// TimeSlot Format 
		var timeSlotOption = document.getElementById('timeSlot');
		var slot = tripBO.timeSlot;
		time = timeFormatTo12Hr(slot, 0);
		timeSlotOption.innerHTML = time;

		request = tripBO.requestType;
		changeFieldName();
		var employeeReachedTime;
		
		
		var length = tripBO.bookingRequest.length;
		var tbody = document.getElementById("tableBody");

		for (i = 0; i < length; i++) {
			if (bookingId==tripBO.bookingRequest[i].bookingId) {

				employeeReachedTime = tripBO.bookingRequest[i].reachedTime;

			}
		}
		for (i = 0; i < length; i++) {
			$("#tablebody").empty();
			var trow = document.createElement('tr');
			trow.className = "row-bg-style";

			var sno = document.createElement('td');
			sno.className = "spacing";
			sno.innerHTML = i + 1;
			trow.appendChild(sno);

			var empId = document.createElement('td');
			empId.className = "spacing text-nowrap";
			empId.innerHTML = tripBO.bookingRequest[i].employeeId;
			trow.appendChild(empId);

			var empName = document.createElement('td');
			empName.className = "spacing text-nowrap";
			empName.innerHTML = tripBO.bookingRequest[i].employeeName;
			trow.appendChild(empName);
			
			var empPhoneNum = document.createElement('td');
			empPhoneNum.className = "spacing text-nowrap";
			empPhoneNum.innerHTML = tripBO.bookingRequest[i].phoneNumber;
			trow.appendChild(empPhoneNum);

			var dropPoints = document.createElement('td');
			dropPoints.className = "spacing text-nowrap";
			dropPoints.innerHTML = tripBO.bookingRequest[i].dropPoint;
			trow.appendChild(dropPoints);
			
			if(request == 'Pickup'){
				var location = document.createElement('td');
				location.className = "spacing text-nowrap locationTooltip";
				location.title = tripBO.bookingRequest[i].location;
				location.innerHTML = tripBO.bookingRequest[i].location;
				trow.appendChild(location);
			}
			tbody.appendChild(trow);
			
		}

		document.getElementById("passenger").innerText = "No. of Passengers : " + length;

		var reachedTime = document.getElementById('reachedTime');

		var reachedTimeSlot = employeeReachedTime;
		reachedTime.innerText = timeFormatTo12Hr(reachedTimeSlot, 0);

	}
	catch (e) {
		jsExceptionHandling(e, "completedTrip.js-displayCompletedTrip()");
	}
}

//////////////////////////***************************************////////////////////////////////////////////////////////////////

function raisebtnclicked() {
	try {
		document.getElementById("PopupDate").innerHTML = "Date: " + dateFormat;
		var timeSlot = document.getElementById("PopupTimeslot");
		timeSlot.innerHTML = "Time Slot:" + time;

		document.getElementById("PopupCabNo").innerHTML = "Cab Number:" + tripBO.cabNumber;

		document.getElementById("PopDriverName").innerHTML = "Driver Name:" + tripBO.driverName;

		document.getElementById("PopupDriverNo").innerHTML = "Driver Number:" + tripBO.driverNumber;

		document.getElementById("PopupDestination").innerHTML = "Destination:" + tripBO.destination;

	} catch (e) {
		jsExceptionHandling(e, "completedTrip.js-raisebtnclicked()");
	}

}

// get Complaints in dropDown

function getComplaints() {

	// get the complaints from the DB.
	try {
		xhrComplaints = createHttpRequest("GET", pathName + "/complaints/getComplaints", true, "ADMIN");
		xhrComplaints.onreadystatechange = getComplaintsResponse;
		xhrComplaints.send();
	} catch (e) {
		jsExceptionHandling(e, "completedTrip.js-getComplaints()");
	}

}
function getComplaintsResponse() {
	try {
		if (xhrComplaints.readyState == 4 && xhrComplaints.status == 200) {
			var complaintsList = JSON.parse(this.responseText);
			var reasonSel = document.getElementById("dropdown");
			var len = complaintsList.length;


			var optLength = reasonSel.options.length;
			for (i = optLength - 1; i > 0; i--) {     // it will work in reverse that reduce the length=null;
				reasonSel.options[i] = null;
			}

			// create the dropdownlist
			for (var i = 0; i < len; i++) {
				var list = complaintsList[i];
				var ele = document.createElement("option");
				ele.innerHTML = list.complaintDescription;
				ele.value=list.complaintId;
				reasonSel.appendChild(ele);
			}

		}
	} catch (e) {
		jsExceptionHandling(e, "completedTrip.js-getComplaintsResp()");
	}
}


var popup = document.getElementById("raiseComPopUp");
popup.addEventListener('click', validateComplaints);




function validateComplaints() {
	try {    
		
		                                           // to validate the complaint 
		var complaintsId =document.querySelector("#dropdown").value;
		var ComplaintDescription=$("#dropdown option:selected").text();
		var cabNum = tripBO.cabNumber;
		var driverName = tripBO.driverName;
		var driverNumber = tripBO.driverNumber;
		
		data = { "complaintId":complaintsId,"complaintDescription": ComplaintDescription, "cabNumber": cabNum, "driverName": driverName, "driverNumber": driverNumber }

		// get the selected index value,
		//if its 0 then its Invalid.
		if (ComplaintDescription == 0) {
			document.getElementById("dropdown").style.borderColor = "red";
			raiseComplaintError.innerHTML = "<p style='color: red'>" +
				"Invalid Complaint!</p>";

		}
		else {
			raiseComplaintError.innerHTML = "";
			document.getElementById("dropdown").style.borderColor = "lightgrey";
			popraisebtnclicked();  // trigger the popRaise a complaint btn.
		}
	} catch (e) {
		jsExceptionHandling(e, "completedTrip.js-validateComplaints()");
	}

}

//To register Complaints 
function popraisebtnclicked() {
	try {

		xhrComplaints = createHttpRequest("PUT", pathName + "/complaints/registerComplaints/" + bookingId, true, "ADMIN");
		xhrComplaints.onreadystatechange = registerComplaints;
		xhrComplaints.setRequestHeader("Content-Type", "application/json");
		xhrComplaints.send(JSON.stringify(data));


		function registerComplaints() {
			if (xhrComplaints.readyState == 4 && xhrComplaints.status == 200) { //Complaints register if conditio true

				$('#raise-complaint').modal('hide');
				$('#raise-complaint-success').modal('show');
			}
			if (xhrComplaints.readyState == 4 && xhrComplaints.status == 208) { //else condition false

				document.getElementById("dropdown").style.borderColor = "red";
				raiseComplaintError.innerHTML = "<p style='color: red'>" +
					"Complaints already registered!</p>";


			}

		}
	} catch (e) {
		jsExceptionHandling(e, "completedTrip.js-popraisebtnclicked()");
	}
}


