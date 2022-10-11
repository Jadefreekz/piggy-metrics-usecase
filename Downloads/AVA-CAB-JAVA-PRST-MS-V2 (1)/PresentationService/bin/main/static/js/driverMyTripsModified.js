var cabNumber = localStorage.getItem('cabNumber');
var profile = JSON.parse(localStorage.getItem('profile'));
var driverId=profile.driverId;
var startButton = document.getElementById('startButton');
var tripErrorMessage = document.getElementById('TripErrorMessage');
var employeeCount=0;
var dropCount=0;
startButton.disabled = true;//--------------------------------------------------------------validation
var endButton = document.getElementById('endButton');
var noOneShowedButton = document.getElementById('noOneShowedButton');

var pickButton = document.getElementById('pickupIcon');
var bookingRequests;
var tripDetails;
var requestType;
var tabType;

let cabNumberOnProfile = document.getElementById('driver-profile2');
	cabNumberOnProfile.innerText = cabNumber;
let driverNameOnProfile = document.getElementById('driver-profile1');
	driverNameOnProfile.innerText = profile.driverName;


window.onload = function() {
	findIfQueryExists();

}

var xhrTripDetails;
function findIfQueryExists() {
	
	try{
		document.getElementById('TripDetails').innerHTML = "";
	document.getElementById('EmployeeDetails').innerHTML = "";
	var urlParams = new URLSearchParams(window.location.search);
	tripCabId = urlParams.get('tripCabId');


	xhrTripDetails = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/tripSheetInfo/" + tripCabId, true, "DRIVER");
	xhrTripDetails.onreadystatechange = getTripDetails;
	xhrTripDetails.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-findIfQueryExists()");
	}
	

}

function getTripDetails() {

	try{
		if (xhrTripDetails.readyState == 4 && (xhrTripDetails.status == 200 || xhrTripDetails.status == 666)) {
		var viewTripDetails = JSON.parse(this.responseText);
		
		if(viewTripDetails.requestType=="Pickup"){
			validateStartTime(viewTripDetails);//--------------------------------------------------------------validation
		}
		prefillTripDetails(viewTripDetails);
		
		tabType=viewTripDetails.status;

	}
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-getTripDetails()");
	}
	
}
//start Trip validation starts here//--------------------------------------------------------------validation
function validateStartTime(viewTripDetails) {

	try{
		var xhrTime;
	var url = pathName + "/bookingInfoService/bookingRequest/serverDateTime";
	xhrTime = createHttpRequest("GET", url, false, "DRIVER");
	xhrTime.onreadystatechange = responseBookingTime;
	xhrTime.send(null);

	function responseBookingTime() {
		if (xhrTime.readyState == 4 && xhrTime.status == 200) {
			serverTime = xhrTime.responseText;
			var date = viewTripDetails.dateOfTravel;
			var dateArray = date.split("-");
			var dateOfTravel = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];
			var timeOfTrip = dateOfTravel + " " + viewTripDetails.timeSlot;

			var startTime = new Date(timeOfTrip);
			var endTime = new Date(serverTime);
			
			var timeDifferenceInMs = endTime - startTime;

			var minimunSeconds = 900000;
			if (Math.abs(timeDifferenceInMs) < minimunSeconds) {
				startButton.disabled = false;
			}
			
			if(serverTime > timeOfTrip ){
				startButton.disabled = false;
			}
		}

	}
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-validateStartTime()");
	}

	
}
//start Trip validation ends here//--------------------------------------------------------------validation
function prefillTripDetails(viewTripDetails) {

	
	try{
		var tripColumnDiv = document.createElement('div');
	tripColumnDiv.className = "col-md-12 ";

	var tripCardDiv = document.createElement('div');
	tripCardDiv.className = "card bor-rads  pb-3";
	tripCardDiv.style="margin-top: -46px";

	var requestTypeDiv = document.createElement('div');
	requestTypeDiv.className = "card-look";
	var requestTypeSpan = document.createElement('span');
	requestTypeSpan.style="float:left";
	requestTypeSpan.className = "badge badge-primary card-lable";
	requestTypeSpan.innerText = viewTripDetails.requestType;
	requestTypeDiv.appendChild(requestTypeSpan);
	
	
	var tripCardRow = document.createElement('div');
	tripCardRow.className = "row mt-2";

	var tripCardColumn = document.createElement('div');
	tripCardColumn.className = "col-7 mt-2";

	var tripRowBody = document.createElement('div');
	tripRowBody.className = "row";


	var pickOrDropImageDiv = document.createElement('div');
	pickOrDropImageDiv.className = "col-3";
	var travelInfoImage = document.createElement('img');

	if (viewTripDetails.requestType == "Pickup") {
		travelInfoImage.className = "ms-4 ";
		travelInfoImage.style="width: 23px";
		travelInfoImage.alt = "tick";
		travelInfoImage.src = "images/pickupImg.svg";
	} else {
		travelInfoImage.src = "images/droptopickup.svg";
		travelInfoImage.className = "ms-4 ";
		travelInfoImage.style="width: 22px";
		travelInfoImage.alt = "tick";
	}

	pickOrDropImageDiv.appendChild(travelInfoImage);



	var classColumnBorder = document.createElement('div');
	classColumnBorder.className = "col-9 colm-border";
	var sourceDiv = document.createElement('div');

	var pickLocation = document.createElement('h3');
	pickLocation.className = "font-16 font-semi mb-0";
	var pickText = document.createElement('h1');
	pickText.className = "font-14 font-semi font-gray";
	pickText.innerText = "Pickup";

	var destinationDiv = document.createElement('div');
	var dropLocation = document.createElement('h3');
	dropLocation.className = "font-16 font-semi posi-fix mb-0";
	var dropText = document.createElement('h1');
	dropText.className = "font-14 font-semi font-gray";
	dropText.innerText = "Drop";

	if (viewTripDetails.requestType == "Pickup") {
		pickLocation.innerText = viewTripDetails.destination;
		dropLocation.innerText = viewTripDetails.source;
	} else {
		pickLocation.innerText = viewTripDetails.source;
		dropLocation.innerText = viewTripDetails.destination;
	}

	sourceDiv.appendChild(pickLocation);
	sourceDiv.appendChild(pickText);

	destinationDiv.appendChild(dropLocation);
	destinationDiv.appendChild(dropText);

	classColumnBorder.appendChild(sourceDiv);
	classColumnBorder.appendChild(destinationDiv);


	var rightColumn = document.createElement('div');
	rightColumn.className = "col-5";

	var timeDiv = document.createElement('div');
	var timeSlotDiv = document.createElement('h3');
	timeSlotDiv.className = "font-16 font-semi ms-3 mt-2";
	timeSlotDiv.innerText = includeOrExcludeSeconds(viewTripDetails.timeSlot, 0);
	var dateOfTravel = document.createElement('h1');
	dateOfTravel.style="margin-left: 16px;"
	dateOfTravel.className = "font-14 font-semi font-gray";
	let date = viewTripDetails.dateOfTravel;
	let dateFormatted = date.split("-");
	dateOfTravel.innerText = dateFormatted[2] + "-" + dateFormatted[1] + "-" + dateFormatted[0];

	var allocatedSeatsDiv = document.createElement('div');
	allocatedSeatsDiv.className = "posi-fix ";
	let totalSeatsImage = document.createElement('img');
	totalSeatsImage.className = "ms-3 me-2 persons";
	totalSeatsImage.src = "images/persons.svg";
	totalSeatsImage.alt = "passengers";
	allocatedSeatsDiv.appendChild(totalSeatsImage);

	var allocatedSeats = document.createElement('span');
	allocatedSeats.innerText = viewTripDetails.allocatedSeats;

	//	right columns appended here
	allocatedSeatsDiv.appendChild(allocatedSeats);
	timeDiv.appendChild(timeSlotDiv);
	timeDiv.appendChild(dateOfTravel);

	rightColumn.appendChild(timeDiv);
	rightColumn.appendChild(allocatedSeatsDiv);

	//	left columns appended here
	tripRowBody.appendChild(pickOrDropImageDiv);
	tripRowBody.appendChild(classColumnBorder);


	tripCardColumn.appendChild(tripRowBody);
	tripCardRow.appendChild(tripCardColumn);
	tripCardRow.appendChild(rightColumn);

	tripCardDiv.appendChild(requestTypeDiv);
	tripCardDiv.appendChild(tripCardRow);

	tripColumnDiv.appendChild(tripCardDiv);



	document.getElementById('TripDetails').appendChild(tripColumnDiv);


	//creating Employee cards
	tripDetails = viewTripDetails;
	bookingRequests = viewTripDetails.bookingRequest;
	requestType = viewTripDetails.requestType;
	for (let i = 0; i < bookingRequests.length; i++) {

		//Completed Trip startes here

		let employeeCardRowDiv = document.createElement('div');
		employeeCardRowDiv.className = "row";
		employeeCardRowDiv.id = "employeeCardRow" + i;
		employeeCardRowDiv.style = "margin-top: 15px;";

		let employeeCardColumnDiv = document.createElement('div');
		employeeCardColumnDiv.className = "col-md-12 ";

		let employeeCardBorRadsDiv = document.createElement('div');
		employeeCardBorRadsDiv.className = "card bor-rads ";

		let employeeCardBodyDiv = document.createElement('div');
		employeeCardBodyDiv.className = "card-body";


		let employeeNameInCard = document.createElement('h4');
		employeeNameInCard.className = "card-title font-bold font-20 mb-3";
		employeeNameInCard.innerText = bookingRequests[i].employeeName;

		let address = document.createElement('h5');
		address.className = "font-look font-regular font-18 font-gray mb-3";
		address.innerText = "Address";

		let employeeAddressInCard = document.createElement('p');
		employeeAddressInCard.className = "card-text font-semi font-18";
		
		if(requestType=="Pickup"){
			employeeAddressInCard.innerText = bookingRequests[i].location + ", " + bookingRequests[i].dropPoint;
		}else{
			employeeAddressInCard.innerText = bookingRequests[i].dropPoint + ", " + bookingRequests[i].destination;
		}
		

		// Icons create starts here

		let iconRowDiv = document.createElement('div');
		iconRowDiv.className = "row";
		iconRowDiv.id = "iconRow" + i;

		let iconColumnDiv = document.createElement('div');
		iconColumnDiv.className = "col-md-12 d-flex py-2 px-3";
		iconColumnDiv.id = "iconColumn" + i;
		
		//new div
		let iconSubRow= document.createElement('div');
		iconSubRow.className="row";
    	iconSubRow.style="justify-content: right";
		iconSubRow.id = "iconSubRow" + i;
		
		let LocationIconSubColumn= document.createElement('div');
		LocationIconSubColumn.className="col-3";
		LocationIconSubColumn.id = "LocationIconSubColumn" + i;
		
		//Location Icon
		let locationIcon = document.createElement('button');
		locationIcon.type = 'button';
		locationIcon.className = "btn w-100 btn-grad-location btn-primary";
		locationIcon.id = "locationIcon" + i;
		let locationImg = document.createElement('img');
		locationImg.className = "location-look";
		locationImg.src = "images/location.svg";
		locationImg.alt = "location";
		locationIcon.appendChild(locationImg);
		LocationIconSubColumn.appendChild(locationIcon);
		iconSubRow.appendChild(LocationIconSubColumn);
		
		let callIconSubColumn= document.createElement('div');
		callIconSubColumn.className="col-3";
		callIconSubColumn.id = "callIconSubColumn" + i;

		//Call Icon
		let callIcon = document.createElement('button');
		callIcon.type = 'button';
		callIcon.className = "btn w-100 btn-grad-call btn-secondary";
		callIcon.id = "callIcon" + i;
		let callImg = document.createElement('img');
		callImg.className = "location-look";
		callImg.src = "images/call-icon.svg";
		callImg.alt = "call";
		callIcon.appendChild(callImg);
		let number = bookingRequests[i].phoneNumber;
		callIcon.onclick = () => callButtonClicked(number, callIcon.id);
		callIconSubColumn.appendChild(callIcon);
		iconSubRow.appendChild(callIconSubColumn);
		
		let blockIconSubColumn= document.createElement('div');
		blockIconSubColumn.className="col-3";
		blockIconSubColumn.id = "blockIconSubColumn" + i;

		let blockIcon = document.createElement('button');
		blockIcon.id = "blockIcon" + i;
		blockIcon.type = 'button';
		blockIcon.className = "btn w-100 btn-grad-block btn-success";
		let blockImg = document.createElement('img');
		blockImg.id = "blockImageId" + i;
		blockImg.className = "location-look";
		blockImg.src = "images/block.svg";
		blockImg.alt = "block";
		blockIcon.appendChild(blockImg);
		//
		let bookingNum = bookingRequests[i].bookingId;
		blockIcon.onclick = () => noShowIconClicked(bookingNum, pickupIcon.id);
		blockIconSubColumn.appendChild(blockIcon);
		iconSubRow.appendChild(blockIconSubColumn);
		
		let pickupSubColumn= document.createElement('div');
		pickupSubColumn.className="col-3";
		pickupSubColumn.id = "pickupSubColumn" + i;
		
		//Pickup Icon
		let pickupIcon = document.createElement('button');
		pickupIcon.type = 'button';
		pickupIcon.className = "btn w-100 btn-grad-pickup btn-success";
		pickupIcon.id = "pickupIcon" + i;
		let pickupImg = document.createElement('img');
		pickupImg.className = "location-look";
		pickupImg.src = "images/pickup.svg";
		pickupImg.alt = "pickup";
		pickupIcon.appendChild(pickupImg);
		let bookingId = bookingRequests[i].bookingId;
		pickupIcon.onclick = () => pickupIconClicked(bookingId, pickupIcon.id);
		pickupSubColumn.appendChild(pickupIcon);
		iconSubRow.appendChild(pickupSubColumn);
		
		let undoSubColumn= document.createElement('div');
		undoSubColumn.className="col-3";
		undoSubColumn.style="margin-left: 257px !important";
		undoSubColumn.id = "undoSubColumn" + i;

		//Undo
		let undoIcon = document.createElement('button');
		undoIcon.id = "undoIcon" + i;
		undoIcon.type = 'button';
		undoIcon.className = "btn w-100 btn-grad-back btn-success";
		let undoImg = document.createElement('img');
		undoImg.className = "location-look";
		undoImg.src = "images/undo.svg";
		undoImg.alt = "undo";
		undoIcon.appendChild(undoImg);

		let bookingNumber = bookingRequests[i].bookingId;
		undoIcon.onclick = () => undoIconClicked(bookingNumber, undoIcon.id);
		undoSubColumn.appendChild(undoIcon);
		iconSubRow.appendChild(undoSubColumn);
		
		let messageSubColumn= document.createElement('div');
		messageSubColumn.className="col-3";
		messageSubColumn.id = "messageSubColumn" + i;
		//message Icon
		let messageIcon = document.createElement('button');
		messageIcon.id = "messageIcon" + i;
		messageIcon.type = 'button';
		messageIcon.className = "btn w-100 btn-grad-message btn-success";
		messageIcon.id = "messageIcon" + i;
		let messageImg = document.createElement('img');
		messageImg.className = "location-look";
		messageImg.src = "images/message.svg";
		messageImg.alt = "message";
		messageIcon.appendChild(messageImg);
		messageSubColumn.appendChild(messageIcon);
		iconSubRow.appendChild(messageSubColumn);
		


		let dropSubColumn= document.createElement('div');
		dropSubColumn.className="col-3";
		dropSubColumn.id = "dropSubColumn" + i;
		//drop Icon
		let dropIcon = document.createElement('button');
		dropIcon.type = 'button';
		dropIcon.className = "btn w-100 btn-grad-location btn-success";
		dropIcon.id = "dropIcon" + i;
		let dropImg = document.createElement('img');
		dropImg.className = "location-look";
		dropImg.src = "images/Drop.svg";
		dropImg.alt = "drop";
		dropIcon.appendChild(dropImg);
		let bookingRequestId = bookingRequests[i].bookingId;
		dropIcon.onclick = () => dropIconClicked(bookingRequestId, dropIcon.id);
		dropSubColumn.appendChild(dropIcon);
		iconSubRow.appendChild(dropSubColumn);
		
		
		iconColumnDiv.appendChild(iconSubRow);


		//tag names
		let employeeWarnStatus = document.createElement('div');
		employeeWarnStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right me-3";
		employeeWarnStatus.id = "warned" + i;
		let noshowImg = document.createElement('img');
		noshowImg.className = "me-1";
		noshowImg.src = "images/warn.png";
		noshowImg.alt = "warn";
		noshowImg.style = "width: 22px";
		employeeWarnStatus.appendChild(noshowImg);
		let noShowText = document.createElement('span');
		noShowText.style = "color:#dc3545";
		noShowText.innerText = "Not Shown";
		employeeWarnStatus.appendChild(noShowText);

		iconRowDiv.appendChild(iconColumnDiv);

		let employeeDroppedStatus = document.createElement('div');
		employeeDroppedStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right me-3";
		employeeDroppedStatus.id = "dropped" + i;
		let droppedImg = document.createElement('img');
		droppedImg.className = "me-1";
		droppedImg.src = "images/tick.svg";
		droppedImg.alt = "tick";
		employeeDroppedStatus.appendChild(droppedImg);
		let droppedText = document.createElement('span');
		droppedText.innerText = "Dropped";
		employeeDroppedStatus.appendChild(droppedText);

		let employeePickedStatus = document.createElement('div');
		employeePickedStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right me-3";
		employeePickedStatus.id = "picked" + i;
		let pickImg = document.createElement('img');
		pickImg.className = "me-1";
		pickImg.src = "images/tick.svg";
		pickImg.alt = "tick";
		employeePickedStatus.appendChild(pickImg);
		let pickText = document.createElement('span');
		pickText.innerText = "Picked";
		employeePickedStatus.appendChild(pickText);


		employeeCardBodyDiv.appendChild(employeeWarnStatus);
		employeeCardBodyDiv.appendChild(employeeDroppedStatus);
		employeeCardBodyDiv.appendChild(employeePickedStatus);

		employeeCardBodyDiv.appendChild(employeeNameInCard);
		employeeCardBodyDiv.appendChild(address);
		employeeCardBodyDiv.appendChild(employeeAddressInCard);
		employeeCardBodyDiv.appendChild(iconRowDiv);

		employeeCardBorRadsDiv.appendChild(employeeCardBodyDiv);
		employeeCardColumnDiv.appendChild(employeeCardBorRadsDiv);
		employeeCardRowDiv.appendChild(employeeCardColumnDiv);

		document.getElementById('EmployeeDetails').appendChild(employeeCardRowDiv);


		//Assigned and drop
		if (bookingRequests[i].status == "Assigned" && tripDetails.requestType == "Drop" && tripDetails.status == "Assigned") {

			undoIcon.className = "displayNone";
			messageIcon.className = "displayNone";
			dropIcon.className = "displayNone";
			employeeWarnStatus.className = "displayNone";
			employeeDroppedStatus.className = "displayNone";
			employeePickedStatus.className = "displayNone";

			startButton.style.display = "none";
			endButton.style.display = "none";
			noOneShowedButton.style.display = "block";
			countCheck();
		}
		//Assigned and booking request drop(ongoing)
		if ((bookingRequests[i].status == "Ongoing" || bookingRequests[i].status == "Noshow") && tripDetails.requestType == "Drop" && tripDetails.status == "Assigned") {

			undoIcon.className = "btn w-100 btn-grad-back btn-success displayBlock";
			undoIcon.onclick = () => undoIconClicked(bookingId, undoIcon.id, "Assigned");
			messageIcon.className = "displayNone";
			dropIcon.className = "displayNone";

			if (bookingRequests[i].status == "Ongoing") {
				employeePickedStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
				employeeWarnStatus.className = "displayNone"
			} else if (bookingRequests[i].status == "Noshow") {
				employeeWarnStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
				employeePickedStatus.className = " displayNone"
			}


			employeeDroppedStatus.className = "displayNone";

			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			blockIcon.className = "displayNone";
			pickupIcon.className = "displayNone";
			messageIcon.className = "displayNone";

			startButton.style.display = "block";
			startButton.disabled = true;
			endButton.style.display = "none";
			noOneShowedButton.style.display = "none";
			//before the trip started
			if(bookingRequests[i].status=="Ongoing" || bookingRequests[i].status == "Noshow"){
				employeeCount++;
			}
			
			countCheck();
		}
		//Onprogresss and drop
		if (bookingRequests[i].status == "Ongoing" && tripDetails.requestType == "Drop" && tripDetails.status == "Onprogress") {

			dropIcon.className = "btn  btn-grad-location btn-success  displayBlock";
			undoIcon.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			blockIcon.className = "displayNone";
			pickupIcon.className = "displayNone";
			messageIcon.className = "displayNone";
			employeeWarnStatus.className = "displayNone";
			employeeDroppedStatus.className = "displayNone";
			employeePickedStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";

			startButton.style.display = "none";
			endButton.style.display = "block";
			noOneShowedButton.style.display = "none";
			endButton.disabled= true;
			
			
			
			countCheck();
		}
		//Assigned and Pickup
		if (bookingRequests[i].status == "Assigned" && tripDetails.requestType == "Pickup" && tripDetails.status == "Assigned") {

			undoIcon.className = "displayNone";
			messageIcon.className = "displayNone";
			dropIcon.className = "displayNone";
			employeeWarnStatus.className = "displayNone";
			employeeDroppedStatus.className = "displayNone";
			employeePickedStatus.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			blockIcon.className = "displayNone";
			pickupIcon.className = "displayNone";

			startButton.style.display = "block";
			endButton.style.display = "none";
			noOneShowedButton.style.display = "none";
		}
		//Onprogresss and Pickup
		if (bookingRequests[i].status == "Assigned" && tripDetails.requestType == "Pickup" && tripDetails.status == "Onprogress") {

			undoIcon.className = "displayNone";
			dropIcon.className = "displayNone";
			messageIcon.className = "displayNone";
			employeeWarnStatus.className = "displayNone";
			employeeDroppedStatus.className = "displayNone";
			employeePickedStatus.className = "displayNone";
			pickupIcon.className = "btn w-100 btn-grad-pickup btn-success displayBlock";

			startButton.style.display = "none";
			endButton.style.display = "block";
			noOneShowedButton.style.display = "none";
			
						countCheck();

			

		}
		//Onprogresss and Pickup
		if (bookingRequests[i].status == "Ongoing" && tripDetails.requestType == "Pickup" && tripDetails.status == "Onprogress") {

			undoIcon.className = "btn w-100 btn-grad-back btn-success displayBlock";
			undoIcon.onclick = () => undoIconClicked(bookingId, undoIcon.id, "Assigned");

			dropIcon.className = "displayNone";
			messageIcon.className = "displayNone";
			employeeWarnStatus.className = "displayNone";
			employeeDroppedStatus.className = "displayNone";
			employeePickedStatus.className = "displayNone";
			pickupIcon.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			blockIcon.className = "displayNone";

			employeePickedStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";

			startButton.style.display = "none";
			endButton.style.display = "block";
			endButton.disabled = true;
			noOneShowedButton.style.display = "none";
			
			if (bookingRequests[i].status == "Ongoing" || bookingRequests[i].status == "Noshow") {
				employeeCount++;
			}
			countCheck();

		}
		//Onprogresss and Pickup and Noshow
		if (bookingRequests[i].status == "Noshow" && tripDetails.requestType == "Pickup" && tripDetails.status == "Onprogress") {

			undoIcon.className = "btn w-100 btn-grad-back btn-success displayBlock";
			undoIcon.onclick = () => undoIconClicked(bookingId, undoIcon.id, "Assigned");

			dropIcon.className = "displayNone";
			messageIcon.className = "displayNone";
			employeeWarnStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-rightdisplayBlock";
			employeeDroppedStatus.className = "displayNone";
			employeePickedStatus.className = "displayNone";
			pickupIcon.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			blockIcon.className = "displayNone";

			employeePickedStatus.className = "displayNone";

			startButton.style.display = "none";
			endButton.style.display = "block";
			endButton.disabled = true;
			noOneShowedButton.style.display = "none";
			
			employeeCount++;
			countCheck();

		}
		//Onprogresss and Drop (reached)
		if (bookingRequests[i].status == "Reached" && tripDetails.requestType == "Drop" && tripDetails.status == "Onprogress") {

			undoIcon.className = "btn w-100 btn-grad-back btn-success displayBlock";
			undoIcon.onclick = () => undoIconClicked(bookingId, undoIcon.id, "Ongoing");
			dropIcon.className = "displayNone";
			messageIcon.className = "displayNone";
			employeeWarnStatus.className = "displayNone";
			employeeDroppedStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
			employeePickedStatus.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			blockIcon.className = "displayNone";
			pickupIcon.className = "displayNone";

			startButton.style.display = "none";
			endButton.style.display = "block";
			noOneShowedButton.style.display = "none";
			
			//after the trip started
			if(bookingRequests[i].status=="Reached" || bookingRequests[i].status == "Noshow"){
				dropCount++;
			}

		}
		//Onprogresss and Drop (Noshow)
		if (bookingRequests[i].status == "Noshow" && tripDetails.requestType == "Drop" && tripDetails.status == "Onprogress") {

			undoIcon.className = "displayNone";
			dropIcon.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			pickupIcon.className = "displayNone";
			blockIcon.className = "displayNone";
			messageIcon.className = "displayNone";

			employeeWarnStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
			employeePickedStatus.className = "displayNone";
			employeeDroppedStatus.className = "displayNone";

			startButton.style.display = "none";
			endButton.style.display = "block";
			noOneShowedButton.style.display = "none";
			
			if ( bookingRequests[i].status == "Noshow") {
				dropCount++;
			}

		}
		//Completed and Reached
		if (bookingRequests[i].status == "Reached" && tripDetails.status == "Completed") {

			undoIcon.className = "displayNone";
			dropIcon.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			pickupIcon.className = "displayNone";
			blockIcon.className = "displayNone";
			messageIcon.className = "displayNone";

			employeeDroppedStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
			employeePickedStatus.className = "displayNone";
			employeeWarnStatus.className = "displayNone";
			startButton.style.display = "none";
			endButton.style.display = "none";
			noOneShowedButton.style.display = "none";

		}
		//Completed and Noshow
		if (bookingRequests[i].status == "Noshow" && tripDetails.status == "Completed") {

			undoIcon.className = "displayNone";
			dropIcon.className = "displayNone";
			locationIcon.className = "displayNone";
			callIcon.className = "displayNone";
			pickupIcon.className = "displayNone";
			blockIcon.className = "displayNone";
			messageIcon.className = "displayNone";

			employeeWarnStatus.className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
			employeePickedStatus.className = "displayNone";
			employeeDroppedStatus.className = "displayNone";
			startButton.style.display = "none";
			endButton.style.display = "none";
			noOneShowedButton.style.display = "none";
			
			if (bookingRequests[i].status == "Ongoing" || bookingRequests[i].status == "Noshow") {
				employeeCount++;
			}
			
			
			

		}
	}
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-prefillTripDetails()");
	}

}

function countCheck(){
	if(tripDetails.requestType=="Drop" && tripDetails.status=="Assigned"){
		if (employeeCount == 0) {
			noOneShowedButton.style.display = "block";
			endButton.style.display = "none";
			startButton.style.display = "none";
		}
		if (employeeCount > 0) {
			noOneShowedButton.style.display = "none";
			endButton.style.display = "none";
			startButton.style.display = "block";
			startButton.disabled = true;
		}
		if (employeeCount == bookingRequests.length) {
			startButton.disabled = false;
		}
	}
	if(tripDetails.requestType=="Drop" && tripDetails.status=="Onprogress"){
		
		if (dropCount == 0) {
			noOneShowedButton.style.display = "none";
			endButton.style.display = "block";
			startButton.style.display = "none";
			endButton.disabled = true;
		}
		if(dropCount>0){
			noOneShowedButton.style.display = "none";
			endButton.style.display = "block";
			startButton.style.display = "none";
			endButton.disabled = true;
		}
		if(dropCount==bookingRequests.length){
			endButton.disabled = false;
		}
	}
	if(tripDetails.requestType=="Pickup" && tripDetails.status=="Onprogress"){
		if(employeeCount==0){
			noOneShowedButton.style.display="none";
			startButton.style.display="none";
			endButton.style.display = "block";
			endButton.disabled = true;
		}
		if (employeeCount > 0) {
			noOneShowedButton.style.display = "none";
			startButton.style.display = "none";
			endButton.style.display = "block";
			endButton.disabled = true;
		}
		if (employeeCount == bookingRequests.length) {
			endButton.disabled = false;
		}
	}
}

// Buttons 
function startTripButtonClicked() {

	try{
		var status = "Onprogress";


	var url = pathName + "/bookingInfoService/tripService/updateTripCabInfo/" + tripCabId + "?status=" + status;
	xhr = createHttpRequest("PUT", url, true, "DRIVER");
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {

			var data = JSON.parse(this.responseText);

			startButton.style.display = "none";
			endButton.style.display = "block";
			endButton.disabled = true;
			window.location.reload();

		}
		
		else if(xhr.readyState == 4 && xhr.status == 651){
			tripErrorMessage.style.display="block";
		}
		
	};
	xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-startTripButtonClicked()");
	}
	
}
//End Trip
function endTripButtonClicked() {

	try{
		 var status = "Completed";

		var url = pathName + "/bookingInfoService/tripService/updateTripCabInfo/" + tripCabId + "?status=" + status;
		xhr = createHttpRequest("PUT", url, true, "DRIVER");
		xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {
			var data = JSON.parse(this.responseText);
			$("#success").modal('toggle');
			}
		};
		xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-endTripButtonClicked()");
	}

}
function endtripBtn() {
	window.location.href = "/driver/dashboard"
}

//No one showed
function noOneShowedUpButtonClicked() {

	try{
		var noOneShowedUp = true;
	var status = "Cancelled";


	var url = pathName + "/bookingInfoService/tripService/updateTripCabInfo/" + tripCabId + "?status=" + status + "&noOneShowedUp=" + noOneShowedUp;
	xhr = createHttpRequest("PUT", url, true, "DRIVER");
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {
			var data = JSON.parse(this.responseText);
			$("#noShowModal").modal('hide');
			window.location.href = "/driver/dashboard"
		}
		else if(xhr.readyState == 4 && xhr.status == 651){
			tripErrorMessage.style.display="block";
		}
	};
	xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-noOneShowedUpButtonClicked()");
	}

}

// Icons functions

//call function
function callButtonClicked(phoneNumber, id) {
	try{
		window.open('tel:' + phoneNumber);
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-callButtonClicked()");
	}
	
}

//pickup function
function pickupIconClicked(bookingId, id) {
	try{
		var status = "Ongoing";

	var url = pathName + "/bookingInfoService/bookingRequest/updateTripStatus/" + bookingId + "?status=" + status;
	xhr = createHttpRequest("PUT", url, true, "DRIVER");
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {

			var data = JSON.parse(this.responseText);
			// change the no show btn ---> start trip
			

			document.getElementById(id).className = "displayNone";
			const str = id.slice(-1);
			document.getElementById("locationIcon" + str).className = "displayNone";
			document.getElementById("callIcon" + str).className = "displayNone";
			document.getElementById("blockIcon" + str).className = "displayNone";
			document.getElementById("dropIcon" + str).className = "displayNone";
			document.getElementById("messageIcon" + str).className = " displayNone ";

			document.getElementById("undoIcon" + str).className = "btn w-100 btn-grad-back btn-success displayBlock";
			document.getElementById("undoIcon" + str).onclick = () => undoIconClicked(bookingId, id, "Assigned");
			document.getElementById("picked" + str).className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock ";
			document.getElementById("warned" + str).className = " displayNone ";
			document.getElementById("dropped" + str).className = " displayNone ";
			tripErrorMessage.style.display="none";
			
			employeeCount++;
			countCheck();

		}
	};
	xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-pickupIconClicked()");
	}
}


//Drop icon clicked
function dropIconClicked(bookingId, id) {
	try{
		var status = "Reached";

	var url = pathName + "/bookingInfoService/bookingRequest/updateTripStatus/" + bookingId + "?status=" + status;
	xhr = createHttpRequest("PUT", url, true, "DRIVER");
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {

			var data = JSON.parse(this.responseText);
			
			document.getElementById(id).className = "displayNone";
			const str = id.slice(-1);
			document.getElementById("undoIcon" + str).className = "btn w-100 btn-grad-back btn-success displayBlock";
			document.getElementById("undoIcon" + str).onclick = () => undoIconClicked(bookingId, id, "Ongoing");
			document.getElementById("dropped" + str).className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";

			document.getElementById("locationIcon" + str).className = "displayNone";
			document.getElementById("callIcon" + str).className = "displayNone";
			document.getElementById("blockIcon" + str).className = "displayNone";
			document.getElementById("dropIcon" + str).className = "displayNone";

			document.getElementById("picked" + str).className = "displayNone";
			document.getElementById("warned" + str).className = " displayNone ";
			
			dropCount++;
			countCheck();
			
		}
	};
	xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-dropIconClicked()");
	}
	
}
//no show function
function noShowIconClicked(bookingId, id) {

	try{
		var status = "Noshow";

	var url = pathName + "/bookingInfoService/bookingRequest/updateTripStatus/" + bookingId + "?status=" + status;
	xhr = createHttpRequest("PUT", url, true, "DRIVER");
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {

			var data = JSON.parse(this.responseText);

			document.getElementById(id).className = "displayNone";
			const str = id.slice(-1);
			document.getElementById("locationIcon" + str).className = "displayNone";
			document.getElementById("callIcon" + str).className = "displayNone";
			document.getElementById("pickupIcon" + str).className = "displayNone";
			document.getElementById("blockIcon" + str).className = "displayNone";
			document.getElementById("undoIcon" + str).className = "btn w-100 btn-grad-back btn-success displayBlock";
			document.getElementById("undoIcon" + str).onclick = () => undoIconClicked(bookingId, id, "Assigned");

			document.getElementById("warned" + str).className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock ";
			tripErrorMessage.style.display="none";
			
			employeeCount++;
			countCheck();

		}
	};
	xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-noShowIconClicked()");
	}
}

//Undo function
function undoIconClicked(bookingId, id, status) {
	try{
		//	var status = "Assigned";
	var url = pathName + "/bookingInfoService/bookingRequest/updateTripStatus/" + bookingId + "?status=" + status + "&requestType=" + requestType;
	xhr = createHttpRequest("PUT", url, true, "DRIVER");
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {

			var data = JSON.parse(this.responseText);

			const str = id.slice(-1);
			document.getElementById("undoIcon" + str).className = "displayNone";
			tripErrorMessage.style.display="none";

			if (tripDetails.status == "Assigned") {
				document.getElementById("pickupIcon" + str).className = " btn w-100 btn-grad-pickup btn-success displayBlock";
				document.getElementById("locationIcon" + str).className = "btn w-100 btn-grad-location btn-primary displayBlock";
				document.getElementById("callIcon" + str).className = "btn w-100 btn-grad-call btn-secondary displayBlock";
				document.getElementById("blockIcon" + str).className = "btn w-100 btn-grad-block btn-success displayBlock";
				document.getElementById("picked" + str).className = "displayNone";
				document.getElementById("undoIcon" + str).className = "displayNone";
				document.getElementById("dropIcon" + str).className = "displayNone";
				document.getElementById("warned" + str).className = "displayNone";
				
				employeeCount--;
				countCheck();

			}
			else if (tripDetails.status == "Onprogress" && tripDetails.requestType == "Pickup") {
				document.getElementById("pickupIcon" + str).className = "btn w-100 btn-grad-location btn-primary displayBlock";
				document.getElementById("locationIcon" + str).className = "displayNone";
				document.getElementById("callIcon" + str).className = "displayNone";
				document.getElementById("blockIcon" + str).className = "displayNone";
				document.getElementById("picked" + str).className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
				document.getElementById("undoIcon" + str).className = "displayNone";

				if (tripDetails.requestType == "Pickup") {
					document.getElementById("pickupIcon" + str).className = "btn w-100 btn-grad-pickup btn-success displayBlock";
					document.getElementById("locationIcon" + str).className = "btn w-100  btn-grad-location btn-primary displayBlock";
					document.getElementById("callIcon" + str).className = "btn w-100 btn-grad-call btn-secondary displayBlock";
					document.getElementById("blockIcon" + str).className = "btn w-100 btn-grad-block btn-success displayBlock";
					document.getElementById("picked" + str).className = "displayNone";
				} else {
					document.getElementById("dropIcon" + str).className = "btn w-100 btn-grad-location btn-success displayBlock";
					dropCount--;
					countCheck();
				}
				document.getElementById("warned" + str).className = "displayNone";
				document.getElementById("dropped" + str).className = "displayNone";
				
				employeeCount--;
				countCheck();
				
			}

			else if (tripDetails.status == "Onprogress" && tripDetails.requestType == "Drop") {
				document.getElementById("pickupIcon" + str).className = "displayNone";
				document.getElementById("locationIcon" + str).className = "displayNone";
				document.getElementById("callIcon" + str).className = "displayNone";
				document.getElementById("blockIcon" + str).className = "displayNone";
				document.getElementById("picked" + str).className = "d-flex justify-content-end font-bold font-16 font-green float-right displayBlock";
				document.getElementById("undoIcon" + str).className = "displayNone";

				if (tripDetails.requestType == "Pickup") {
					document.getElementById("pickupIcon" + str).className = "btn w-100 btn-grad-pickup btn-success displayBlock";
					document.getElementById("locationIcon" + str).className = "btn  w-100 btn-grad-location btn-primary displayBlock";
					document.getElementById("callIcon" + str).className = "btn w-100 btn-grad-call btn-secondary displayBlock";
					document.getElementById("messageIcon" + str).className = "btn w-100 btn-grad-message btn-success displayBlock";
					document.getElementById("picked" + str).className = "displayNone";
				} else {
					document.getElementById("dropIcon" + str).className = "btn  btn-grad-location btn-success displayBlock";
					dropCount--;
					countCheck();
				}
				document.getElementById("warned" + str).className = "displayNone";
				document.getElementById("dropped" + str).className = "displayNone";
				employeeCount--;
				countCheck();
			}
		}
	};
	xhr.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverMyTripsModified.js-undoIconClicked()");
	}

}


function backFunction(){
	if(tabType=="Assigned"){
		window.location.href="/driver/dashboard#pills-home"
	}
	else{
			tabType=="Onprogress"?window.location.href="/driver/dashboard#pills-inprogress":window.location.href="/driver/dashboard#pills-completed";
	}
	
}
