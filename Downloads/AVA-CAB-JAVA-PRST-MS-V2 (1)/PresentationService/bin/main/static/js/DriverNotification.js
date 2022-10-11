var tripId;
var cabDetail;
var response;
var cabId = localStorage.getItem('cabNumber');

//DRIVER NOTIFICATION SCRIPT STARTS HERE 


var xhttp;
window.onload = driverNotification();
setInterval('driverNotification()', 5000);

//Gets notification when the status is in Assigned&ongoing
function driverNotification() {

	try {
		
		var url=pathName + "/notificationService/driver/driverNotification/" + cabId
			xhttp = createHttpRequest("GET", url, true, "DRIVER");
		xhttp.onreadystatechange = processNotification;

		xhttp.send();

	}
	catch (e) {

		jsExceptionHandling(e, "DriverNotification.js-driverNotification()");
	}
}

function processNotification() {
	
	try{
	if (this.readyState == 4 && this.status == 200) {

		if (this.responseText) {

			response = JSON.parse(this.responseText);
			tripId = response.tripCabId;
			if (response.status == "Assigned") {

				var slotTime = timeFormatTo12Hr(response.timeSlot, 0);
				document.getElementById("notification-details").innerHTML = " <button type='button' class='btn btn-primary' data-toggle='modal' data-target=''#exampleModal' onclick='tripDetails()' >" + "<h5 class='text-center fw-bold'>You have been assigned a trip</h5>" + "<img src='images/Map-table.svg' alt='map-icon' class='mx-1 map-icon1'>" +
				response.source + " -> " + response.destination + "  @  " + slotTime + "</button>";
				document.getElementById("notificationID").src = "images/notification.svg";
			}
			else {
				window.location.href = "/driver/ongoingtrip?tripId=" + tripId;
			}
		}

		else {
			var notification = document.getElementById("notification");
			notification.innerHTML = '<h5>No Records Found</h5>';
			notification.style.textAlign = 'center';
			notification.style.color ='#8080808c';
			notification.style.fontFamily ='inherit';
			document.getElementById("notificationID").src = "images/notification.svg";

		}

	}
}
catch(e){
	jsExceptionHandling(e, "DriverNotification.js-processNotification()");
}

}
function tripDetails() {

try{
	window.location.href = "/driver/tripsheet?tripId=" + tripId;
}
catch(e){
	jsExceptionHandling(e, "DriverNotification.js-tripDetails()");
}
}


