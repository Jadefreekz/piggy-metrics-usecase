var id = 1;
var newCancelData;
var route;
var dynamicList;
var dynamicDropList;
var destination;
/*------------------------------------- dynamic textfields for dropPoint starts here------------------------------*/


var destinationEmpty = document.getElementById("destinationEmpty");
var dropPointEmpty = document.getElementById("dropPointEmpty");
var pickupTimeSlotEmpty = document.getElementById("pickupTimeSlotEmpty");
var dropTimeSlotEmpty = document.getElementById("dropTimeSlotEmpty");
//destintion Blur Function and checks if destination is empty
var destinationDuplicate = false;
var xhrDestinationCheck;
function destinationBlurFunction() {

	try {

		destination=document.getElementById('destination').value;
		const destinationPattern = new RegExp("^[a-zA-Z ]+$");
		var destinationPatternTrue = destinationPattern.test(destination);
		
		if (document.getElementById('destination').value == undefined || document.getElementById('destination').value == "") {
			document.getElementById("destination").style.borderColor = "red";
			destinationEmpty.innerHTML = "<p style='color: red'>" +
				 "*Required</p>";
             return false;
		}
		else {
			destinationEmpty.innerHTML = "";
			document.getElementById("destination").style.borderColor = "lightgrey";
			
			
			if(!(destinationPatternTrue)){
				
				document.getElementById("destination").style.borderColor = "red";
				destinationEmpty.innerHTML = "<p style='color: red'>" +
				            "*Invalid</p>";
		     return false;
			}
			else{
				destinationEmpty.innerHTML = "";
				document.getElementById("destination").style.borderColor = "lightgrey";
				//return true;
				destinationDuplicateCheck();
				if(destinationDuplicate == true){
					return true;
				}
				else{
					return false;
				}

			}
			
	}
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-destinationBlurFunction()");
	}

}

//dropPoint Blur Function and checks if destination is empty
function dropPointBlurFunction() {

	try {
		if (document.getElementById('dropPoint').value == undefined || document.getElementById('dropPoint').value == "") {
			document.getElementById("dropPoint").style.borderColor = "red";
			document.getElementById("dropPoint").style.textDecoration = "none";
			dropPointEmpty.innerHTML = "<p style='color: red'>" +
				"*Required</p>";

			return false;
		}
		else {
			dropPointEmpty.innerHTML = "";
			document.getElementById("dropPoint").style.borderColor = "lightgrey";

		}
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-dropPointBlurFunction()");
	}

}
//timeSlot  Blur Function and checks if destination is empty
function pickupTimeSlotBlurFunction() {
	try {
		if (document.getElementById('pickupTimeSlot').value == undefined || document.getElementById('pickupTimeSlot').value == "") {
			document.getElementById("pickupTimeSlot").style.borderColor = "red";
			document.getElementById("pickupTimeSlot").style.textDecoration = "none";
			pickupTimeSlotEmpty.innerHTML = "<p style='color: red'>" +
				"*Required</p>";

			return false;
		}
		else {
			pickupTimeSlotEmpty.innerHTML = "";
			document.getElementById("pickupTimeSlot").style.borderColor = "lightgrey";
		}
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-timeSlotBlurFunction()");
	}

}

function dropTimeSlotBlurFunction() {
	try {
		if (document.getElementById('dropTimeSlot').value == undefined || document.getElementById('dropTimeSlot').value == "") {
			document.getElementById("dropTimeSlot").style.borderColor = "red";
			document.getElementById("dropTimeSlot").style.textDecoration = "none";
			dropTimeSlotEmpty.innerHTML = "<p style='color: red'>" +
				"*Required</p>";

			return false;
		}
		else {
			dropTimeSlotEmpty.innerHTML = "";
			document.getElementById("dropTimeSlot").style.borderColor = "lightgrey";
		}
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-timeSlotBlurFunction()");
	}

}


function dropPoint() {

	try {

		if (route != undefined) {
			id = route.dropPoints.length;
		}



		var dynamicTextField = document.getElementById("dis");
		var addDropPoint = document.getElementById("dropPoint").value;

		if (addDropPoint == "") {

			document.getElementById("dropPoint").style.borderColor = "red";
			document.getElementById("dropPoint").style.textDecoration = "none";
			dropPointEmpty.innerHTML = "<p style='color: red'>" +
				"*Required</p>";

			return false;
		}
		else {
			dropPointEmpty.innerHTML = "";
			document.getElementById("dropPoint").style.borderColor = "lightgrey";
		}

		if (route != undefined) {
			route.dropPoints.push({ "dropPoint": addDropPoint });
		}



		dropPointDiv = document.createElement("tr");
		dropPointDiv.setAttribute("id", "row" + (id));

		tableDataElement = document.createElement("td");

		inputCreateElement = document.createElement("INPUT");
		inputCreateElement.className = "problem";
		inputCreateElement.style = "margin-right:5%";
		inputCreateElement.setAttribute("type", "text");

		inputCreateElement.setAttribute("id", "tdr1" + (dropTimeId));

		inputCreateElement.value = addDropPoint;
		inputCreateElement.disabled = true;
		tableDataElement.appendChild(inputCreateElement);
		document.getElementById("dropPoint").value = "";

		dynamicDropList = dynamicTextField.querySelectorAll('input[type="text"]')


		for (var i = 0; i < dynamicDropList.length; i++) {
			if (addDropPoint == dynamicDropList[i].value) {
				document.getElementById("dropPoint").style.borderColor = "red";
				document.getElementById("dropPoint").style.textDecoration = "none";
				dropPointEmpty.innerHTML = "<p style='color: red'>" +
					"*Already exists</p>";

				return false;
			}
			else {
				dropPointEmpty.innerHTML = "";
				document.getElementById("dropPoint").style.borderColor = "lightgrey";
			}

		}

		tableDataCancelElement = document.createElement("td");
		tableDataCancelElement.innerHTML = "<img class = 'cancel-data-new' src='images/close.svg' alt='cancel-icon' style='margin-left:98px' style='margin-right:7%' style='margin-bottom:4%' onclick='cancelOf(this)'/>"
		tableDataCancelElement.style = "padding-right:35%";
		tableDataCancelElement.setAttribute("id", "cancel" + (i));


		dropPointDiv.appendChild(tableDataElement);
		dropPointDiv.appendChild(tableDataCancelElement);
		dynamicTextField.appendChild(dropPointDiv);

		id++;


	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-dopPoint()");
	}
}
function cancelOf(id) {
	try {
		var cancel = (id.closest("tr")).id;
		newCancelData = document.getElementById(cancel).getElementsByTagName("input")[0].value;
		if (route != undefined) {
			for (var k = 0; k < route.dropPoints.length; k++) {
				if (newCancelData == route.dropPoints[k].dropPoint) {

					var cancelResult = document.getElementById(cancel).parentNode.removeChild(document.getElementById(cancel));
					route.dropPoints.splice(k, 1);

				}

			}
		}
		else {
			var cancelResult = document.getElementById(cancel).parentNode.removeChild(document.getElementById(cancel));

		}
		appendRouteDetails();

	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-cancelOf()");
	}

}
//---------------****-------------(TimeSlot dynamic changes)
var timeId = 1;
function pickupTimeSlot() {

	try {
		if (route != undefined) {
			timeId = route.pickupTimeSlot.length;
		}



		var dynamicTextField = document.getElementById("disPickup");
		var addPickupTimeSlot = document.getElementById("pickupTimeSlot").value + ":00";

		if (document.getElementById("pickupTimeSlot").value == "") {
			document.getElementById("pickupTimeSlot").style.borderColor = "red";
			document.getElementById("pickupTimeSlot").style.textDecoration = "none";
			pickupTimeSlotEmpty.innerHTML = "<p style='color: red','padding-right:2%'>" +
				"*Required</p>";
				return false;
		}
		else {
			pickupTimeSlotEmpty.innerHTML = "";
			document.getElementById("pickupTimeSlot").style.borderColor = "lightgrey";
		}

		if (route != undefined) {
			route.pickupTimeSlot.push({ "pickupTimeSlot": addPickupTimeSlot });
		}




		var timeSlotDiv = document.createElement("tr");
		timeSlotDiv.setAttribute("id", "timerow" + (timeId));

		tableDataElement = document.createElement("td");

		var inputCreateElement = document.createElement("INPUT");
		inputCreateElement.className = "problem";
		inputCreateElement.style = "margin-right:5%";
		inputCreateElement.setAttribute("type", "text");

		inputCreateElement.setAttribute("id", "t1" + (timeId));


		var time;
		var slotSplitted = addPickupTimeSlot.split(":");
		var slotHour = slotSplitted[0];
		if (slotHour < 12) {
			if (slotHour == 00) {
				time = "12" + ":" + slotSplitted[1] + " AM";

			}
			else {
				time = slotHour + ":" + slotSplitted[1] + " AM";

			}
		} else {
			slotHour = slotHour - 12;
			if (slotHour == 0) {
				time = "12" + ":" + slotSplitted[1] + " PM";
			}
			else if (slotHour < 10) {
				time = "0" + slotHour + ":" + slotSplitted[1] + " PM";

			} else {
				time = slotHour + ":" + slotSplitted[1] + " PM";
			}

		}

		document.getElementById("pickupTimeSlot").value = "";
		inputCreateElement.value = time;
		inputCreateElement.disabled = true;
		tableDataElement.appendChild(inputCreateElement);

		dynamicList = dynamicTextField.querySelectorAll('input[type="text"]')


		for (var i = 0; i < dynamicList.length; i++) {
			if (time == dynamicList[i].value) {
				document.getElementById("pickupTimeSlot").style.borderColor = "red";
				document.getElementById("pickupTimeSlot").style.textDecoration = "none";
				pickupTimeSlotEmpty.innerHTML = "<p style='color: red' ,'padding-right:2%'>" +
					"*Already exists</p>";

				return false;
			}
			else {
				pickupTimeSlotEmpty.innerHTML = "";
				document.getElementById("pickupTimeSlot").style.borderColor = "lightgrey";
			}



		}



		tableDataCancelElement = document.createElement("td");
		tableDataCancelElement.innerHTML = "<img class = 'cancel-data-new' src='images/close.svg' alt='cancel-icon' style='margin-left:98px' style='margin-right:3%' style='margin-bottom:4%' onclick='cancelOfTime(this)'/>"
		tableDataCancelElement.style = "padding-right:35%";
		tableDataCancelElement.setAttribute("id", "cancel" + (timeId));


		timeSlotDiv.appendChild(tableDataElement);
		timeSlotDiv.appendChild(tableDataCancelElement);
		dynamicTextField.appendChild(timeSlotDiv);

		timeId++;
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-timeSlot()");
	}

}

var dropTimeId = 1;
function dropTimeSlot() {

	try {
		if (route != undefined) {
			dropTimeId = route.dropTimeSlot.length;
		}



		var dynamicDropTextField = document.getElementById("disDrop");
		var addDropTimeSlot = document.getElementById("dropTimeSlot").value + ":00";

		if (document.getElementById("dropTimeSlot").value == "") {
			document.getElementById("dropTimeSlot").style.borderColor = "red";
			document.getElementById("dropTimeSlot").style.textDecoration = "none";
			dropTimeSlotEmpty.innerHTML = "<p style='color: red','padding-right:2%'>" +
				"*Required</p>";
			return false;
		}
		else {
			dropTimeSlotEmpty.innerHTML = "";
			document.getElementById("dropTimeSlot").style.borderColor = "lightgrey";
		}

		if (route != undefined) {
			route.dropTimeSlot.push({"dropTimeSlot": addDropTimeSlot});
		}




		timeSlotDiv = document.createElement("tr");
		timeSlotDiv.setAttribute("id", "timeDroprow" + (dropTimeId));

		tableDataElement = document.createElement("td");

		inputCreateElement = document.createElement("INPUT");
		inputCreateElement.className = "problem";
		inputCreateElement.style = "margin-right:5%";
		inputCreateElement.setAttribute("type", "text");

		inputCreateElement.setAttribute("id", "tdr1" + (dropTimeId));


		var dropTime;
		var slotDropSplitted = addDropTimeSlot.split(":");
		var slotDropHour = slotDropSplitted[0];
		if (slotDropHour < 12) {
			if (slotDropHour == 00) {
				dropTime = "12" + ":" + slotDropSplitted[1] + " AM";

			}
			else {
				dropTime = slotDropHour + ":" + slotDropSplitted[1] + " AM";

			}
		} else {
			slotDropHour = slotDropHour - 12;
			if (slotDropHour == 0) {
				dropTime = "12" + ":" + slotDropSplitted[1] + " PM";
			}
			else if (slotDropHour < 10) {
				dropTime = "0" + slotDropHour + ":" + slotDropSplitted[1] + " PM";

			} else {
				dropTime = slotDropHour + ":" + slotDropSplitted[1] + " PM";
			}

		}

		document.getElementById("dropTimeSlot").value = "";
		inputCreateElement.value = dropTime;
		inputCreateElement.disabled = true;
		tableDataElement.appendChild(inputCreateElement);

		dynamicDropList = dynamicDropTextField.querySelectorAll('input[type="text"]')


		for (var i = 0; i < dynamicDropList.length; i++) {
			if (dropTime == dynamicDropList[i].value) {
				document.getElementById("dropTimeSlot").style.borderColor = "red";
				document.getElementById("dropTimeSlot").style.textDecoration = "none";
				dropTimeSlotEmpty.innerHTML = "<p style='color: red' ,'padding-right:2%'>" +
					"*Already exists</p>";

				return false;
			}
			else {
				dropTimeSlotEmpty.innerHTML = "";
				document.getElementById("dropTimeSlot").style.borderColor = "lightgrey";
			}



		}



		tableDataCancelElement = document.createElement("td");
		tableDataCancelElement.innerHTML = "<img class = 'cancel-data-new' src='images/close.svg' alt='cancel-icon' style='margin-left:98px' style='margin-right:3%' style='margin-bottom:4%' onclick='cancelOfTime(this)'/>"
		tableDataCancelElement.style = "padding-right:35%";
		tableDataCancelElement.setAttribute("id", "cancel" + (dropTimeId));


		timeSlotDiv.appendChild(tableDataElement);
		timeSlotDiv.appendChild(tableDataCancelElement);
		dynamicDropTextField.appendChild(timeSlotDiv);

		dropTimeId++;
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-timeSlot()");
	}

}

var newSlotCancelData;
function cancelOfTime(id) {
	try {
		var cancel = (id.closest("tr")).id;

		newSlotCancelData = document.getElementById(cancel).getElementsByTagName("input")[0].value;
		var splittedTimeSlot = newSlotCancelData.split(":");
		var mins;

		if (parseInt(splittedTimeSlot[1]) < 10) {
			mins = "0" + parseInt(splittedTimeSlot[1]);
		} else {
			mins = parseInt(splittedTimeSlot[1]);
		}

		if (splittedTimeSlot[1].includes("PM")) {

			if (parseInt(splittedTimeSlot[0], 10) + 12 == 24) {
				bookingTimeSlot = parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
			}

			else {
				splittedTimeSlotHour = parseInt(splittedTimeSlot[0], 10) + 12;
				bookingTimeSlot = splittedTimeSlotHour + ":" + mins + ":00";
			}
		}
		else {
			if (parseInt(splittedTimeSlot[0], 10) < 10) {
				bookingTimeSlot = "0" + parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
			}
			else if (parseInt(splittedTimeSlot[0], 10) == 12) {
				bookingTimeSlot = "00" + ":" + mins + ":00";
			}
			else {
				bookingTimeSlot = parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
			}
		}

		if (route != undefined) {
			for (var t = 0; t < route.pickupTimeSlot.length; t++) {
				if (bookingTimeSlot == route.pickupTimeSlot[t].pickupTimeSlot) {

					var cancelResult = document.getElementById(cancel).parentNode.removeChild(document.getElementById(cancel));
					route.pickupTimeSlot.splice(t, 1);

				}

			}
		}
		else {
			var cancelResult = document.getElementById(cancel).parentNode.removeChild(document.getElementById(cancel));
		}


		appendRouteDetails();
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-cancelOfTime()");
	}


}
//-----------------------*********--------------------------------(save icon functionality)
function cancelOfDropTime(id) {
	try {
		var cancel = (id.closest("tr")).id;

		newSlotCancelData = document.getElementById(cancel).getElementsByTagName("input")[0].value;
		var splittedTimeSlot = newSlotCancelData.split(":");
		var mins;

		if (parseInt(splittedTimeSlot[1]) < 10) {
			mins = "0" + parseInt(splittedTimeSlot[1]);
		} else {
			mins = parseInt(splittedTimeSlot[1]);
		}

		if (splittedTimeSlot[1].includes("PM")) {

			if (parseInt(splittedTimeSlot[0], 10) + 12 == 24) {
				bookingTimeSlot = parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
			}

			else {
				splittedTimeSlotHour = parseInt(splittedTimeSlot[0], 10) + 12;
				bookingTimeSlot = splittedTimeSlotHour + ":" + mins + ":00";
			}
		}
		else {
			if (parseInt(splittedTimeSlot[0], 10) < 10) {
				bookingTimeSlot = "0" + parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
			}
			else if (parseInt(splittedTimeSlot[0], 10) == 12) {
				bookingTimeSlot = "00" + ":" + mins + ":00";
			}
			else {
				bookingTimeSlot = parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
			}
		}

		if (route != undefined) {
			for (var t = 0; t < route.dropTimeSlot.length; t++) {
				if (bookingTimeSlot == route.dropTimeSlot[t].dropTimeSlot) {

					var cancelResult = document.getElementById(cancel).parentNode.removeChild(document.getElementById(cancel));
					route.dropTimeSlot.splice(t, 1);

				}

			}
		}
		else {
			var cancelResult = document.getElementById(cancel).parentNode.removeChild(document.getElementById(cancel));
		}


		appendRouteDetails();
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-cancelOfTime()");
	}


}
var xhrSaveRouteDetails;

document.getElementById("saveButton").addEventListener('click', saveRouteDetails);

function dropPointAndTimeSlotValidate(){
			var point = document.getElementById("dis");
		if (dis.querySelectorAll('input[type="text"]').length == 0) {
			document.getElementById("dropPoint").style.borderColor = "red";
			document.getElementById("dropPoint").style.textDecoration = "none";
			dropPointEmpty.innerHTML = "<p style='color: red'>" +
				"*Required</p>";//when save clicked checks dropPoint  feild

			return false;
		}
		else {
			dropPointEmpty.innerHTML = "";
			document.getElementById("dropPoint").style.borderColor = "lightgrey";
		}
		var pickupSlot = document.getElementById("disPickup");
		if (disPickup.querySelectorAll('input[type="text"]').length == 0) {
			document.getElementById("pickupTimeSlot").style.borderColor = "red";
			document.getElementById("pickupTimeSlot").style.textDecoration = "none";
			pickupTimeSlotEmpty.innerHTML = "<p style='color: red' >" +
				"*Required</p>"; //when save clicked checks timeSlot feild

			return false;
		}
		else {
			pickupTimeSlotEmpty.innerHTML = "";
			document.getElementById("pickupTimeSlot").style.borderColor = "lightgrey";
			
		}
		
		var dropSlot = document.getElementById("disDrop");
		if (disDrop.querySelectorAll('input[type="text"]').length == 0) {
			document.getElementById("dropTimeSlot").style.borderColor = "red";
			document.getElementById("dropTimeSlot").style.textDecoration = "none";
			dropTimeSlotEmpty.innerHTML = "<p style='color: red' >" +
				"*Required</p>"; //when save clicked checks timeSlot feild

			return false;
		}
		else {
			dropTimeSlotEmpty.innerHTML = "";
			document.getElementById("dropTimeSlot").style.borderColor = "lightgrey";
			return true;
		}
}
//To validate the save details 
function validateRouteDetails() {
	try {

		if(destinationBlurFunction() && dropPointAndTimeSlotValidate()){
			
			return true;
			
		}
		else{

			return false;

	} }
	catch (e) {
		jsExceptionHandling(e, "newRoute.js-validateRouteDetails()");
	}


}

function validateRouteForEdit(){
	try {

		if(dropPointAndTimeSlotValidate()){
			
			return true;
			
		}
		else{

			return false;

	} }
	catch (e) {
		jsExceptionHandling(e, "newRoute.js-validateRouteDetails()");
	}
}
//To save new record 
var savingNewRecord = true;
var bookingDropTimeSlot;
var bookingPickupTimeSlot;
function saveRouteDetails() {
	try {
		var destination = document.getElementById("destination").value;

		var dropPoint = new Array();
		var point = document.getElementById("dis");
		var dropList = point.querySelectorAll('input[type="text"]');

		for (var i = 0; i < dropList.length; i++) {

			var eachDropPoint = { "dropPoint": dropList[i].value }

			dropPoint.push(eachDropPoint);



		}

		var pickupTimeSlot = new Array();
		var pickupSlot = document.getElementById("disPickup");
		var slotListPickup = pickupSlot.querySelectorAll('input[type="text"]');


		for (var i = 0; i < slotListPickup.length; i++) {

			var splittedTimeSlot = slotListPickup[i].value.split(":");
			var mins;

			if (parseInt(splittedTimeSlot[1]) < 10) {
				mins = "0" + parseInt(splittedTimeSlot[1]);
			} else {
				mins = parseInt(splittedTimeSlot[1]);
			}

			if (splittedTimeSlot[1].includes("PM")) {

				if (parseInt(splittedTimeSlot[0], 10) + 12 == 24) {
					bookingPickupTimeSlot = parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
				}

				else {
					splittedTimeSlotHour = parseInt(splittedTimeSlot[0], 10) + 12;
					bookingPickupTimeSlot = splittedTimeSlotHour + ":" + mins + ":00";
				}
			}
			else {
				if (parseInt(splittedTimeSlot[0], 10) < 10) {
					bookingPickupTimeSlot = "0" + parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
				}
				else if (parseInt(splittedTimeSlot[0], 10) == 12) {
					bookingPickupTimeSlot = "00" + ":" + mins + ":00";
				}
				else {
					bookingPickupTimeSlot = parseInt(splittedTimeSlot[0], 10) + ":" + mins + ":00";
				}
			}

			var eachTimeSlot = { "pickupTimeSlot": bookingPickupTimeSlot };

			pickupTimeSlot.push(eachTimeSlot);
}

			var dropsTimeSlot = new Array();
		var dropSlot = document.getElementById("disDrop");
		var slotListDrop = dropSlot.querySelectorAll('input[type="text"]');


		for (var j = 0; j < slotListDrop.length; j++) {

			var splittedDropTimeSlot = slotListDrop[j].value.split(":");
			var minutes;

			if (parseInt(splittedDropTimeSlot[1]) < 10) {
				minutes = "0" + parseInt(splittedDropTimeSlot[1]);
			} else {
				minutes = parseInt(splittedDropTimeSlot[1]);
			}

			if (splittedDropTimeSlot[1].includes("PM")) {

				if (parseInt(splittedDropTimeSlot[0], 10) + 12 == 24) {
					bookingDropTimeSlot = parseInt(splittedDropTimeSlot[0], 10) + ":" + minutes + ":00";
				}

				else {
					splittedTimeSlotHour = parseInt(splittedDropTimeSlot[0], 10) + 12;
					bookingDropTimeSlot = splittedTimeSlotHour + ":" + minutes + ":00";
				}
			}
			else {
				if (parseInt(splittedDropTimeSlot[0], 10) < 10) {
					bookingDropTimeSlot = "0" + parseInt(splittedDropTimeSlot[0], 10) + ":" + minutes + ":00";
				}
				else if (parseInt(splittedDropTimeSlot[0], 10) == 12) {
					bookingDropTimeSlot = "00" + ":" + minutes + ":00";
				}
				else {
					bookingDropTimeSlot = parseInt(splittedDropTimeSlot[0], 10) + ":" + minutes + ":00";
				}
			}

			var eachDropTimeSlot = { "dropTimeSlot": bookingDropTimeSlot };

			dropsTimeSlot.push(eachDropTimeSlot);

		}

		var data = {"destinationId": destinationId, "destination": destination, "dropPoints": dropPoint, "pickupTimeSlot": pickupTimeSlot, "dropTimeSlot": dropsTimeSlot };
		
		if (savingNewRecord) {
			if(validateRouteDetails()){
	
				xhrSaveRouteDetails = createHttpRequest("POST", pathName + "/route/saveDestination", true, "ADMIN");//To save new record
				xhrSaveRouteDetails.setRequestHeader("Content-Type", "application/json");
				xhrSaveRouteDetails.send(JSON.stringify(data));
				xhrSaveRouteDetails.onreadystatechange = saveRouteInfoProcessResponse;
	
			} 
			
		}
		else{
			if(validateRouteForEdit()){
				xhrSaveRouteDetails = createHttpRequest("PUT", pathName + "/route/updateRoute/"+destinationId, true, "ADMIN");//Tp update the destination details
				xhrSaveRouteDetails.setRequestHeader("Content-Type", "application/json");
				xhrSaveRouteDetails.send(JSON.stringify(data));

				xhrSaveRouteDetails.onreadystatechange = saveRouteInfoProcessResponse;

			}
		
		}
		
		
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-saveRouteDetails()");

	}
}

function saveRouteInfoProcessResponse() {
	try {

		if (xhrSaveRouteDetails.readyState == 4 && xhrSaveRouteDetails.status == 591) {


			document.getElementById("destination").style.borderColor = "red";
			destinationEmpty.innerHTML = "<p style='color: red'>" +
				"*Already exists</p>";

			return false;
		}

		if (xhrSaveRouteDetails.readyState == 4 && xhrSaveRouteDetails.status == 200) {
			$('#save-route-popup').modal('show');			
		}




	} catch (e) {
		
		jsExceptionHandling(e, "newRoute.js-saveRouteInfoProcessResponse()");
	}


}
//------------------**------------------------------------------------//

function funclear() {
	try {
		savingNewRecord = true;
		document.getElementById("destination").value = "";

		document.getElementById("dropPoint").value = "";

		document.getElementById("timeSlot").value = "";

		location.reload();
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-funclear()");
	}
}

/*----------------------------clear ends here--------------------------*/
//To edit the destination
var destinationId;
window.onload = function() {

	var queryParater = window.location.search;

	if ( queryParater== null || queryParater == undefined || queryParater == "") {
		return false;
	}
	else {
		savingNewRecord = false;
		destinationId = queryParater.split("=")[1];
		destinationId = destinationId.replace("%20", " ");
		getRouteDetailsInfo();

	}

}

var xhrDestinationDetails;

function getRouteDetailsInfo() {
	try {

		//To get the prefilled destination details 
		xhrDestinationDetails = createHttpRequest("GET", pathName + "/route/editDestination/" + destinationId, true, "ADMIN");

		xhrDestinationDetails.setRequestHeader("Content-Type", "application/json");
		xhrDestinationDetails.send();

		xhrDestinationDetails.onreadystatechange = destinationProcessResponse;


	} 
	catch(e) 
	{
		jsExceptionHandling(e, "newRoute.js-getRouteDetailsInfo()");
	}


}

function destinationProcessResponse() {
	try {
		if (xhrDestinationDetails.status == 200 && xhrDestinationDetails.readyState == 4) {
			route = JSON.parse(this.responseText);

			appendRouteDetails(route);

		}

	}
	catch (e) {
		jsExceptionHandling(e, "newRoute.js-destinationProcessResponse()");
	}

}


function appendRouteDetails(route) {

	try {
		if (route != undefined) {
			document.getElementById("destination").value = route.destination;
			document.getElementById("destination").disabled = true;
			document.getElementById("dis").innerHTML = "";

			for (var i = 0; i < route.dropPoints.length; i++) {

				var dynamicTextField = document.getElementById("dis");
				var dropPointDiv = document.createElement("tr");
				dropPointDiv.setAttribute("id", "row" + i);

				var tableDataElement = document.createElement("td");

				var inputCreateElement = document.createElement("INPUT");
				inputCreateElement.className = "problem";
				inputCreateElement.style = "margin-right:5%";
				inputCreateElement.setAttribute("type", "text");

				inputCreateElement.setAttribute("id", "t1" + i);

				inputCreateElement.value = route.dropPoints[i].dropPoint;
				inputCreateElement.disabled = true;
				tableDataElement.appendChild(inputCreateElement);

				var tableDataCancelElement = document.createElement("td");
				tableDataCancelElement.innerHTML = "<img class = '' src='images/close.svg' alt='cancel-icon' style='margin-left:90px;width:16px; margin-right:10px'  onclick='cancelOf(this)'/>"
				tableDataCancelElement.style = "padding-right:35%";
				tableDataCancelElement.setAttribute("id", "cancel" + (i));


				dropPointDiv.appendChild(tableDataElement);
				dropPointDiv.appendChild(tableDataCancelElement);
				dynamicTextField.appendChild(dropPointDiv);



			}
			document.getElementById("disPickup").innerHTML = "";
			for (var j = 0; j < route.pickupTimeSlot.length; j++) {
				var dynamicTextField = document.getElementById("disPickup");
				var addPickupTimeSlot = document.getElementById("pickupTimeSlot").value;


				var timeSlotDiv = document.createElement("tr");
				timeSlotDiv.setAttribute("id", "timerow" + (j));

				tableDataElement = document.createElement("td");

				inputCreateElement = document.createElement("INPUT");
				inputCreateElement.className = "problem";
				inputCreateElement.style = "margin-right:5%";
				inputCreateElement.setAttribute("type", "text");

				inputCreateElement.setAttribute("id", "t1" + (j));




				var time;
				var slotSplitted = route.pickupTimeSlot[j].pickupTimeSlot.split(":");
				slotHour = slotSplitted[0];
				if (slotHour < 12) {
					if (slotHour == 00) {
						time = "12" + ":" + slotSplitted[1] + " AM";

					}
					else {
						time = slotHour + ":" + slotSplitted[1] + " AM";

					}
				} else {
					slotHour = slotHour - 12;
					if (slotHour == 0) {
						time = "12" + ":" + slotSplitted[1] + " PM";
					}
					else if (slotHour < 10) {
						time = "0" + slotHour + ":" + slotSplitted[1] + " PM";

					}

					else {
						time = slotHour + ":" + slotSplitted[1] + " PM";
					}

				}


				inputCreateElement.value = time;
				inputCreateElement.disabled = true;
				tableDataElement.appendChild(inputCreateElement);


				dynamicList = dynamicTextField.querySelectorAll('input[type="text"]')


				for (var i = 0; i < dynamicList.length; i++) {
					if (time == dynamicList[i].value) {


						document.getElementById("pickupTimeSlot").style.borderColor = "red";
						document.getElementById("pickupTimeSlot").style.textDecoration = "none";
						pickupTimeSlotEmpty.innerHTML = "<p style='color: red' >" +
							"*Already exists</p>";

						return false;
					}
					else {
						pickupTimeSlotEmpty.innerHTML = "";
						document.getElementById("destination").style.borderColor = "lightgrey";

					}

				}


				tableDataCancelElement = document.createElement("td");
				tableDataCancelElement.innerHTML = "<img class = '' src='images/close.svg' alt='cancel-icon'  style='margin-left:90px ;width:16px;margin-right:10px' onclick='cancelOfTime(this)'/>"
				tableDataCancelElement.style = "padding-right:35%";
				tableDataCancelElement.setAttribute("id", "cancel" + (j));


				timeSlotDiv.appendChild(tableDataElement);
				timeSlotDiv.appendChild(tableDataCancelElement);
				dynamicTextField.appendChild(timeSlotDiv);


			}
			document.getElementById("disDrop").innerHTML = "";
			for (var j = 0; j < route.dropTimeSlot.length; j++) {
				var dynamicTextField = document.getElementById("disDrop");
				var addPickupTimeSlot = document.getElementById("dropTimeSlot").value;


				timeSlotDiv = document.createElement("tr");
				timeSlotDiv.setAttribute("id", "timeDropRow" + (j));

				tableDataElement = document.createElement("td");

				inputCreateElement = document.createElement("INPUT");
				inputCreateElement.className = "problem";
				inputCreateElement.style = "margin-right:5%";
				inputCreateElement.setAttribute("type", "text");

				inputCreateElement.setAttribute("id", "tdr1" + (j));




				var dropTime;
				var slotDropSplitted = route.dropTimeSlot[j].dropTimeSlot.split(":");
				var slotDropHour = slotDropSplitted[0];
				if (slotDropHour < 12) {
					if (slotDropHour == 00) {
						dropTime = "12" + ":" + slotDropSplitted[1] + " AM";

					}
					else {
						dropTime = slotDropHour + ":" + slotDropSplitted[1] + " AM";

					}
				} else {
					slotDropHour = slotDropHour - 12;
					if (slotDropHour == 0) {
						dropTime = "12" + ":" + slotDropSplitted[1] + " PM";
					}
					else if (slotDropHour < 10) {
						dropTime = "0" + slotDropHour + ":" + slotDropSplitted[1] + " PM";

					}

					else {
						dropTime = slotDropHour + ":" + slotDropSplitted[1] + " PM";
					}

				}


				inputCreateElement.value = dropTime;
				inputCreateElement.disabled = true;
				tableDataElement.appendChild(inputCreateElement);


				dynamicDropList = dynamicTextField.querySelectorAll('input[type="text"]')


				for (var i = 0; i < dynamicDropList.length; i++) {
					if (dropTime == dynamicDropList[i].value) {


						document.getElementById("dropTimeSlot").style.borderColor = "red";
						document.getElementById("dropTimeSlot").style.textDecoration = "none";
						dropTimeSlotEmpty.innerHTML = "<p style='color: red' >" +
							"*Already exists</p>";

						return false;
					}
					else {
						dropTimeSlotEmpty.innerHTML = "";
						document.getElementById("destination").style.borderColor = "lightgrey";

					}

				}


				var tableDataCancelDropElement = document.createElement("td");
				tableDataCancelDropElement.innerHTML = "<img class = '' src='images/close.svg' alt='cancel-icon'  style='margin-left:90px ;width:16px;margin-right:10px' onclick='cancelOfDropTime(this)'/>"
				tableDataCancelDropElement.style = "padding-right:35%";
				tableDataCancelDropElement.setAttribute("id", "cancelDrop" + (j));


				timeSlotDiv.appendChild(tableDataElement);
				timeSlotDiv.appendChild(tableDataCancelDropElement);
				dynamicTextField.appendChild(timeSlotDiv);


			}
		}
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-appendRouteDetails()");
	}

}


var urlSearchParameter = new URLSearchParams(window.location.search);
var destinationId = urlSearchParameter.get('destId');


document.getElementById("dropPoint").addEventListener("keyup", function(event) { //To give enter for dropPoint

	if (event.keyCode == 13) {
		dropPoint();
	}
});

document.getElementById("pickupTimeSlot").addEventListener("keyup", function(event) {//To give enter for timeSlot

	if (event.keyCode == 13) {
		pickupTimeSlot();
	}
});

document.getElementById("dropTimeSlot").addEventListener("keyup", function(event) {//To give enter for timeSlot

	if (event.keyCode == 13) {
		dropTimeSlot();
	}
});



document.getElementById("addedSuccess").addEventListener('click', function() { //Query selector to go back to routedetails screen
	window.location.href = "/admin/routedetails";
});

function routeDetails() {
	try {
		window.location.href = "/admin/routedetails";
	} catch (e) {
		jsExceptionHandling(e, "newRoute.js-routeDetails()");
	}
}

var checkDuplicateDestination;
function destinationDuplicateCheck(){
	try{
		
		xhrDestinationCheck = createHttpRequest("GET", pathName + "/route/destination/" + destination+"/"+destinationId, true, "ADMIN");
		xhrDestinationCheck.onreadystatechange = function(){
			if(xhrDestinationCheck.readyState == 4 && xhrDestinationCheck.status == 594){
				destinationDuplicate = false;
				checkDuplicateDestination = xhrDestinationCheck.responseText;
				document.getElementById("destination").style.borderColor = "red";
				destinationEmpty.innerHTML = "<p style='color: red'>" +
				            "*Already exists</p>";
		     return false;
			}
			if(xhrDestinationCheck.readyState == 4 && xhrDestinationCheck.status == 200){
				destinationDuplicate = true;
				destinationEmpty.innerHTML = "";
				document.getElementById("destination").style.borderColor = "lightgrey";
				return true;
			}
		};
		xhrDestinationCheck.send(null);
	}catch(e){
		jsExceptionHandling(e, "newRoute.js-destinationDuplicateCheck()");
	}
}