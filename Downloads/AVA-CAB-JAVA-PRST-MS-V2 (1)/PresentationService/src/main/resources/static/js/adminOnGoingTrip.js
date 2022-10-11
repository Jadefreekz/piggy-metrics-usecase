window.onload = function() {

	fetchOngoingTrip();
	setIntervalOperation =  setInterval('fetchOngoingTrip()', 60000);
}

var xhrGetTrip;
var setIntervalOperation;


var idSearch = window.location.search;
var tripCabId = idSearch.split("=")[1];
var reachCount=0;
var data;
var request;
var employeeCount=0;

function changeFieldNames(){
	if(request == "Drop"){
		var dropPointLabel = document.getElementById('changeDropPoint');
		dropPointLabel.innerText = "Drop Point";
		var sourceLabel = document.getElementById('sourceLabel');
		sourceLabel.innerHTML = "Source";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Destination";
		var locationTHead = document.getElementById('hideLocationThead');
		locationTHead.style.display = "none";
	}
	else if(request == "Pickup"){
		var dropPointLabel = document.getElementById('changeDropPoint');
		dropPointLabel.innerText = "Pickup Point";
		var sourceLabel = document.getElementById('sourceLabel');
		sourceLabel.innerHTML = "Destination";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Source";
	}
}
function fetchOngoingTrip() {

try{
	var url = pathName + "/bookingInfoService/tripService/tripSheetInfo/" + tripCabId;
	xhrGetTrip = createHttpRequest("GET", url, true, "ADMIN");
	xhrGetTrip.onreadystatechange = function () {


		if (xhrGetTrip.readyState == 4 && xhrGetTrip.status == 666) {

			data = JSON.parse(this.responseText);
			displayTripDetails(data);
			changeFieldNames();
		}
		if(xhrGetTrip.readyState == 4 && xhrGetTrip.status == 200){
			data = JSON.parse(this.responseText);
			if(data.status=="Completed"){
				window.location.href = "/admin/dashboard#pills-assigned";
			}
		}
	};
	xhrGetTrip.send(null);
	}
	catch(e){
		jsExceptionHandling(e, "adminOnGoingTrip.js-fetchOngoingTrip()");
	}
}

	function displayTripDetails(obj) {
		try{

		$("#tablebody").empty();

		document.getElementById("cabnumber").innerHTML = obj.cabNumber;
		document.getElementById("drivername").innerHTML = obj.driverName;
		document.getElementById("drivernumber").innerHTML = obj.driverNumber;
		document.getElementById("source").innerHTML = obj.source;
		document.getElementById("destination").innerHTML = obj.destination;
		request = obj.requestType;
		
		var date = obj.dateOfTravel;
		dateOfTravel = obj.dateOfTravel;
		var dateOfTravelValue = date.split("\-");
		document.getElementById("date").innerHTML = dateOfTravelValue[2] + "-" + dateOfTravelValue[1] + "-" + dateOfTravelValue[0];

		var timeSlotValue = timeFormatTo12Hr(obj.timeSlot, 0);
		document.getElementById("timeslot").innerHTML = timeSlotValue;
		
		document.getElementById("totalseats").innerHTML = obj.totalSeats;
		document.getElementById("allocatedseats").innerHTML = obj.allocatedSeats;
		document.getElementById("remainingseats").innerHTML = obj.remainingSeats;
		document.getElementById("status").innerHTML = obj.status;
		var startTimeValue = timeFormatTo12Hr(obj.startTime,0);
		document.getElementById("starttime").innerHTML=startTimeValue;

		onLoadOfTripInProgress();
		}
		catch(e){
			jsExceptionHandling(e, "adminOnGoingTrip.js-displayTripDetails(obj)");
		}
	}
	

/* ----------------------------------------------------------------------------------------------------------------------------*/





function onLoadOfTripInProgress() {
	
	try{

	var url = pathName + "/bookingInfoService/bookingRequest/adminOngoingSheet/getOngoinSheet/" + tripCabId+"?requestType="+request;
	xhrGetTrip = createHttpRequest("GET", url, true, "ADMIN");
	xhrGetTrip.onreadystatechange = processResponseTripInfo;
	xhrGetTrip.send(null);
	}
	catch(e){
		jsExceptionHandling(e, "adminOnGoingTrip.js-onLoadOfTripInProgress()");
	}

}

function processResponseTripInfo() {

try{
	if (xhrGetTrip.readyState == 4 && xhrGetTrip.status == 200) {

		var data = JSON.parse(this.responseText);
		displayBookedTripDetails(data);


	}
	}
	catch(e){
		jsExceptionHandling(e, "adminOnGoingTrip.js-processResponseTripInfo()");
	}
	}

	// To display the data 
	function displayBookedTripDetails(obj) {
		
		try{

		$("#tablebody").empty();

		var counter = 0;
		var tableBody = document.getElementById("tablebody");

		var rowLength = obj.length;
		for (var rows = 0; rows < rowLength; rows++) {

			var tableRow = document.createElement('tr');
			counter++;
			tableRow.className = "row-bg-style";
			tableRow.id = "tr" + counter;

			var serialNumber = document.createElement('td');
			serialNumber.className = "spacing1";
			serialNumber.innerHTML = rows + 1;
			tableRow.appendChild(serialNumber);

			var idOfEmployee = document.createElement('td');
			idOfEmployee.className = "spacing1";
			idOfEmployee.innerHTML = obj[rows].employeeId;
			tableRow.appendChild(idOfEmployee);

			var nameOfEmployee = document.createElement('td');
			nameOfEmployee.className = "spacing1";
			nameOfEmployee.innerHTML = obj[rows].employeeName;
			tableRow.appendChild(nameOfEmployee);
			
			var employeePhNumber = document.createElement('td');
			employeePhNumber.className = "spacing1";
			employeePhNumber.innerHTML = obj[rows].phoneNumber;
			tableRow.appendChild(employeePhNumber);

			var destinationDropPoint = document.createElement('td');
			destinationDropPoint.className = "spacing1";
			destinationDropPoint.innerHTML = obj[rows].dropPoint;
			tableRow.appendChild(destinationDropPoint);
			
			if(request == 'Pickup'){
				var location = document.createElement('td');
				location.className = "spacing1 locationTooltip text-nowrap";
				location.title = obj[rows].location;
				location.innerHTML = obj[rows].location;
				tableRow.appendChild(location);
			}

			var employeeReachedTime = document.createElement('td');
			employeeReachedTime.className = "spacing1";
			if (obj[rows].reachedTime != null) {

				var timeSlot = obj[rows].reachedTime;
				var timeSplit = timeSlot.split(":");
				var hour = timeSplit[0];
				if (hour < 12) {
					if (hour == 00) {
						employeeReachedTime.innerHTML = "12" + ":" + timeSplit[1] + " AM";
					}
					else {
						employeeReachedTime.innerHTML = hour + ":" + timeSplit[1] + " AM";
					}

				}
				else if (hour == 12) {

					employeeReachedTime.innerHTML = hour + ":" + timeSplit[1] + " PM";
				}

				else {
					hour = hour - 12;
					if (hour < 10) {
						employeeReachedTime.innerHTML = "0" + hour + ":" + timeSplit[1] + " PM";
					}
					else {
						employeeReachedTime.innerHTML = hour + ":" + timeSplit[1] + " PM";
					}

				}

			}
			else {
				employeeReachedTime.innerHTML = "";
			}


			tableRow.appendChild(employeeReachedTime);

			if (request == "Pickup") {
				let employeeStatus = obj[rows].status;
				let employeeActionButton = document.createElement('td');
				employeeActionButton.className = "spacing1 text-center";
				let pickedBtn = document.createElement('button');
				pickedBtn.className = 'pickedbutton';
				pickedBtn.innerHTML = 'Picked';
				let noshowBtn = document.createElement('button');
				noshowBtn.className = 'noshowbutton';
				noshowBtn.innerHTML = 'Noshow';
				if(employeeStatus == "Assigned"){
					pickedBtn.style = "background-color:rgb(45 213 23);color:white; border-radius: 20px;padding:8px 25px; margin:10px; border:none;";
					let bookingId = obj[rows].bookingId;
					pickedBtn.id = 'pickedButton' + rows;
					noshowBtn.id = 'noshowButton' + rows;
					pickedBtn.onclick = () => pickupIconClicked(bookingId, pickedBtn.id, noshowBtn.id);
					noshowBtn.onclick = () => noShowIconClicked(bookingId, noshowBtn.id, pickedBtn.id);
					noshowBtn.style = "background-color:rgb(240 81 81);color:white; border-radius: 20px;padding:8px 25px; border:none;";
						
				}
				else if(employeeStatus == "Ongoing"){
					
					pickedBtn.style = "display:inline-block;background-color:rgb(121 119 119);color:white; border-radius: 20px;padding:8px 25px; border:none;";
					noshowBtn.style.display = "none";
					document.getElementById('endTrip').style = "display: block";
					document.getElementById('noOneShow').style = "display: none";
					employeeCount++;
				}
				else if(employeeStatus == "Noshow"){
					
					noshowBtn.style = "display:inline-block;background-color:rgb(121 119 119);color:white; border-radius: 20px;padding:8px 25px; border:none;";
					pickedBtn.style = "display:none";
					document.getElementById('endTrip').style = "display: block";
					document.getElementById('noOneShow').style = "display: none";
					employeeCount++;
				}
				
				employeeActionButton.appendChild(pickedBtn);
				employeeActionButton.appendChild(noshowBtn);
				tableRow.appendChild(employeeActionButton);
				
				

			} else {
				var employeeReachedButton = document.createElement('td');
				employeeReachedButton.className = "spacing1";
				if (employeeReachedTime.innerHTML != "") {
					employeeReachedButton.innerHTML = "<button type='button' class='reachedbutton' onclick=reachedButtonClicked(this) disabled id='reached" + rows + "' style='background-color:#38BE41;color:white; border-radius: 20px;padding:5px;'><span class='status-reached font-semibold font-16'>Reached</span></button>";
				}
				else {
					employeeReachedButton.innerHTML = "<button type='button' class='reachedbutton' onclick=reachedButtonClicked(this) id='reached" + rows + "' style='background-color:#E90000;color:white; border-radius: 20px; padding:5px;'><span class='status-reached font-semibold font-16'>Reached</span></button>";
				}
				tableRow.appendChild(employeeReachedButton);
			}
			

			var employeeBookingId = document.createElement('td');
			employeeBookingId.className = "spacing1";
			employeeBookingId.innerHTML = obj[rows].bookingId;
			employeeBookingId.style.display = "none";
			tableRow.appendChild(employeeBookingId);

			tableBody.appendChild(tableRow);

		}
		var tableBody = document.getElementById("tablebody");

		for (var i = 0; i < tableBody.rows.length; i++) {
			if(request == 'Pickup'){
				if (tableBody.rows[i].cells[6].innerHTML != "") {
	
					reachCount++;
				}
			}else{
				if (tableBody.rows[i].cells[5].innerHTML != "") {
	
					reachCount++;
				}
			}

		}
		if (reachCount == tableBody.rows.length) {
			checkEndTrip();
		}
	}
	catch(e){
		jsExceptionHandling(e, "adminOnGoingTrip.js-displayBookedTripDetails(obj)");
	}

	}



/*------------------------------------------------------------------------------------------------------------------------------ */

//   To update employee's reached time
var updateTime;
function reachedButtonClicked(row) {
	
	try{

		var tableRow = row.closest("tr").id;
		if(request == 'Pickup'){
			var bookId = document.getElementById(tableRow).getElementsByTagName("td")[8].innerHTML;
		}else{
			var bookId = document.getElementById(tableRow).getElementsByTagName("td")[7].innerHTML;
		}
		var url=pathName + "/bookingInfoService/bookingRequest/adminOngoingSheet/updateReacheTimeAndStatus/" + bookId;
		updateTime=createHttpRequest("PUT",url , true,"ADMIN");
		updateTime.setRequestHeader("Content-Type", "application/json");
		updateTime.send();
		updateTime.onreadystatechange = function() {

				if (updateTime.readyState == 4 && updateTime.status == 200) {
					var response = JSON.parse(updateTime.responseText);
					var timeSlot = response.reachedTime;
					var timeSplit = timeSlot.split(":");
					var hour = timeSplit[0];
					if (hour < 12) {
						if (hour == 00) {
							if(request == 'Pickup'){
								document.getElementById(tableRow).getElementsByTagName("td")[6].innerHTML = "12" + ":" + timeSplit[1] + " AM";
							}else{
								document.getElementById(tableRow).getElementsByTagName("td")[5].innerHTML = "12" + ":" + timeSplit[1] + " AM";
							}
						}
						else {
							if(request == 'Pickup'){
								document.getElementById(tableRow).getElementsByTagName("td")[6].innerHTML = hour + ":" + timeSplit[1] + " AM";
							}else{
								document.getElementById(tableRow).getElementsByTagName("td")[5].innerHTML = hour + ":" + timeSplit[1] + " AM";
							}
						}

					}
					else {
						hour = hour - 12;
						if (hour < 10) {
							if(request == 'Pickup'){
								document.getElementById(tableRow).getElementsByTagName("td")[6].innerHTML = "0" + hour + ":" + timeSplit[1] + " PM";
							}else{
								document.getElementById(tableRow).getElementsByTagName("td")[5].innerHTML = "0" + hour + ":" + timeSplit[1] + " PM";
							}
						}
						else {
							if(request == 'Pickup'){
								document.getElementById(tableRow).getElementsByTagName("td")[6].innerHTML = hour + ":" + timeSplit[1] + " PM";
							}else{
								document.getElementById(tableRow).getElementsByTagName("td")[5].innerHTML = "0" + hour + ":" + timeSplit[1] + " PM";
							}
						}

					}
					document.getElementById(row.id).disabled = true;
					document.getElementById(row.id).style.background = "green";

				}
				var tableBody = document.getElementById("tablebody");
				var reachedCount = 0;
				for (var i = 0; i < tableBody.rows.length; i++) {
					if(request == 'Pickup'){
						if (tableBody.rows[i].cells[5].innerHTML != "") {
	
							reachedCount++;
						}
					}else{
						if (tableBody.rows[i].cells[4].innerHTML != "") {
	
							reachedCount++;
						}
					}	

				}
				if (reachedCount == tableBody.rows.length) {
					checkEndTrip();
				}
			

	}
	}
	catch(e){
		jsExceptionHandling(e, "adminOnGoingTrip.js-reachedButtonClicked(row)");
	}
}	


/*------------------------------------------------------------------------------------------------------------------------------------- */

// To check every employee has reached and update reached time of cab
var endTrip;
function checkEndTrip() {
	try{

	var tableBody = document.getElementById("tablebody");
	var reachedCount = 0;
	for (var row = 0; row < tableBody.rows.length; row++) {

		if(request == 'Pickup'){
			if (tableBody.rows[row].cells[6].innerHTML != "") {
	
				reachedCount++;
			}
		}else{
			if (tableBody.rows[row].cells[5].innerHTML != "") {
	
				reachedCount++;
			}
		}

	}

	if (reachedCount == tableBody.rows.length) {

		var url = pathName + "/bookingInfoService/bookingRequest/adminOngoingSheet/updateEndTime/" + tripCabId;
		endTrip = createHttpRequest("PUT", url, true, "ADMIN");
		endTrip.setRequestHeader("Content-Type", "application/json");
		endTrip.send();
		endTrip.onreadystatechange = function() {

			if (endTrip.readyState == 4 && endTrip.status == 200) {

				var response = JSON.parse(endTrip.responseText);

				var endTimeValue = timeFormatTo12Hr(response,0);
				document.getElementById("endtime").innerHTML=endTimeValue;

			}
			window.location.href = "/admin/dashboard#pills-assigned";

		}
	}
	}
	catch(e){
		jsExceptionHandling(e, "adminOnGoingTrip.js-checkEndTrip()");
	}

}

document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === 'visible') {
		setIntervalOperation =  setInterval('fetchOngoingTrip()', 60000);
	}else{
		clearInterval(setIntervalOperation);
	}
});
/*-----------------------------------------------------------------------------------------------------------------------*/


//No one showed button for trip
function noOneShowedUpButtonClicked() {

	try {
		var noOneShowedUp = true;
		var status = "Cancelled";
		var role = "ADMIN";

		var url = pathName + "/bookingInfoService/tripService/updateTripCabInfo/" + tripCabId + "?status=" + status + "&noOneShowedUp=" + noOneShowedUp + "&role=" + role;
		xhr = createHttpRequest("PUT", url, true, "ADMIN");
		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {
				var data = JSON.parse(this.responseText);
				window.location.href = "/admin/dashboard#pills-assigned";
			}
		};
		xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "adminOnGoingTrip.js-noOneShowedUpButtonClicked()");
	}

}

//pickup function

function pickupIconClicked(bookingId, pickId, noshowId) {
	try {
		var status = "Ongoing";

		var url = pathName + "/bookingInfoService/bookingRequest/updateTripStatus/" + bookingId + "?status=" + status;
		xhr = createHttpRequest("PUT", url, true, "ADMIN");
		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {

				var data = JSON.parse(this.responseText);
				// change the no show btn ---> start trip
				document.getElementById(pickId).disabled = true;
				document.getElementById(pickId).style = "background-color:rgb(121 119 119);color:white; border-radius: 20px;padding:8px 25px; margin:10px; border:none;";
				document.getElementById(noshowId).style = "display: none";
				document.getElementById('endTrip').style = "display: block";
				document.getElementById('noOneShow').style = "display: none";

				employeeCount++;
			}
		};
		xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "adminOnGoingTrip.js-pickupIconClicked()");
	}
}

//no show function for employee
function noShowIconClicked(bookingId, noshowid, pickId) {

	try {
		var status = "Noshow";

		var url = pathName + "/bookingInfoService/bookingRequest/updateTripStatus/" + bookingId + "?status=" + status;
		xhr = createHttpRequest("PUT", url, true, "ADMIN");
		xhr.onreadystatechange = function() {

			if (xhr.readyState == 4 && xhr.status == 200) {

				var data = JSON.parse(this.responseText);
				document.getElementById(noshowid).disabled = true;
				document.getElementById(noshowid).style = "background-color:rgb(121 119 119);color:white; border-radius: 20px;padding:8px 25px; margin:10px; border:none;";
				document.getElementById(pickId).style = "display:none";
				document.getElementById('endTrip').style = "display: block";
				document.getElementById('noOneShow').style = "display: none";
				employeeCount++;
			}
		};
		xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "adminOnGoingTrip.js-noShowIconClicked()");
	}
}

//End Trip
var errorEndTrip = document.getElementById("errorEndTrip");
function endTripButtonClicked() {

	try {

		var tableBody = document.getElementById("tablebody");

		if (employeeCount == tableBody.rows.length) {
			var status = "Completed";

			var url = pathName + "/bookingInfoService/tripService/updateTripCabInfo/" + tripCabId + "?status=" + status;
			xhr = createHttpRequest("PUT", url, true, "ADMIN");
			xhr.onreadystatechange = function() {

				if (xhr.readyState == 4 && xhr.status == 200) {
					var data = JSON.parse(this.responseText);
					window.location.href = "/admin/dashboard#pills-assigned";
				}
			};
			xhr.send();
		} else {
			errorEndTrip.innerHTML = "<p style='color: red;'>" +
				"Can't end the Trip</p>";
		}
	}
	catch (e) {
		jsExceptionHandling(e, "adminOnGoingTrip.js-endTripButtonClicked()");
	}

}


