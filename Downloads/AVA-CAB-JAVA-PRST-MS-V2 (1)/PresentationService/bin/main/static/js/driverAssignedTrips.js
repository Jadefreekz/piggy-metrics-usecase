var cabNumber = localStorage.getItem('cabNumber');
var profile = JSON.parse(localStorage.getItem('profile'));
var apiCall=false;
window.onload = assignedTab(0);

var assignedTabClicked;
var inprogressTabClicked;
var completedTabClicked;



var xhrAssignedTab;
function assignedTab(value) {
	try {
		
		if(value == 1){
			location.hash = "#pills-home"
		}

	if (location.hash == "#pills-home") {
		document.querySelector(location.hash + "-tab").click();
		assignedTabClicked = true;
		inprogressTabClicked = false;
		completedTabClicked = false;
	}
	if (location.hash  == "#pills-inprogress") {
		
		let inprogress=window.location.hash;

		document.querySelector(inprogress + "-tab").click();
		assignedTabClicked = false;
		inprogressTabClicked = true;
		completedTabClicked = false;
		
	}
	if (location.hash == "#pills-completed") {
		assignedTabClicked = false;
		inprogressTabClicked = false;
		completedTabClicked = true;
		document.querySelector(location.hash + "-tab").click();
		

	}	

		if(location.hash !="#pills-inprogress" && location.hash !="#pills-completed" ){
			
		document.getElementById("daterange").style.visibility = 'hidden';
		document.getElementById("loadmore").style.visibility = 'hidden';
		let cabNumberOnProfile = document.getElementById('driver-profile2');
		cabNumberOnProfile.innerText = cabNumber;
		let driverNameOnProfile = document.getElementById('driver-profile1');
		driverNameOnProfile.innerText = profile.driverName;

		var index = 0;
		var status = "Assigned"
		xhrAssignedTab = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/cabs/" + index + "/" + status + "?cabNumber=" + cabNumber, true, "DRIVER");
		xhrAssignedTab.onreadystatechange = getAssignedTrips;
		xhrAssignedTab.send();
		}
	}
	catch (e) {
		jsExceptionHandling(e, "driverAssignedTrips.js-assignedTab()");
	}

}


function recall() {

	let location = window.location.hash;

	if (location == "#pills-home") {
		document.querySelector(location + "-tab").click();
		assignedTabClicked = true;
		inprogressTabClicked = false;
		completedTabClicked = false;
	}
	if (location == "#pills-inprogress") {

		document.querySelector(location + "-tab").click();
		assignedTabClicked = false;
		inprogressTabClicked = true;
		completedTabClicked = false;

	}
	if (location == "#pills-completed") {
		document.querySelector(location + "-tab").click();
		assignedTabClicked = false;
		inprogressTabClicked = false;
		completedTabClicked = true;
	}

}
function getAssignedTrips() {

	try {
		if (xhrAssignedTab.readyState == 4 && xhrAssignedTab.status == 200) {
			var assignedTrips = JSON.parse(this.responseText);
			displayAssignedTrips(assignedTrips);
		}
	}
	catch (e) {
		jsExceptionHandling(e, "driverAssignedTrips.js-getAssignedTrips()");
	}

}

function displayAssignedTrips(assignedTrips) {

	try {
		document.getElementById('assignedTripDetails').innerHTML = '';
		document.getElementById('tripCount').innerHTML = '';

		var assignedCountOfTrips = 0;
		for (var i = 0; i < assignedTrips.length; i++) {

			if (assignedTrips[i].status == "Assigned") {
				assignedCountOfTrips++;
			}
		}

		if (assignedCountOfTrips == 0) {
			document.getElementById('noTripCard').innerHTML = " <img src='images/emptystatescreens.svg' class='mb-4 mt-3' alt=''>" + "<h5 class=''>Your trip will assign soon!</h5>" + "<p class='font-regular mt-3'> We'll notify you when a trip is assigned." + "</p>";
			document.getElementById("noTripCard").style.display = "block";
		}
		for (var i = 0; i < assignedTrips.length; i++) {


			if (assignedTrips[i].status == "Assigned") {
				document.getElementById('noTripCard').style.display = "none";
				document.getElementById("tripCount").innerHTML = "<h5 class='font-20 font-bold' style='margin-left:15px'>" + "Assigned Trips (" + assignedCountOfTrips + ")" + "</h5>";

				var cardBorDiv = document.createElement('div');
				cardBorDiv.className = "card bor-rads";
				cardBorDiv.style = "margin-top: 7px";
				cardBorDiv.style = "top: -27px;margin-bottom: 15px;";

				var cardLookDiv = document.createElement('div');
				cardLookDiv.className = "card-look";
				var requestTypeSpan = document.createElement('span');
				requestTypeSpan.className = "badge badge-primary card-lable";
				requestTypeSpan.innerText = assignedTrips[i].requestType;
				cardLookDiv.appendChild(requestTypeSpan);
				cardBorDiv.appendChild(cardLookDiv);
				var cardRowDiv = document.createElement('div');
				cardRowDiv.className = "row mt-2";
				var cardColumnDiv = document.createElement('div');
				cardColumnDiv.className = "col-7 mt-2";
				var cardBodyRowDiv = document.createElement('div');
				cardBodyRowDiv.className = "row";
				var cardBodyColumnDiv = document.createElement('div');
				cardBodyColumnDiv.className = "col-3";

				//Travel image
				if (assignedTrips[i].requestType == "Pickup") {

					var travelInfoImage = document.createElement('img');
					travelInfoImage.style="width: 22px";
					travelInfoImage.className = "ms-4 ";
					travelInfoImage.src = "images/pickupImg.svg";
					travelInfoImage.alt = "tick";
					cardBodyColumnDiv.appendChild(travelInfoImage);

				} else {
					var travelInfoImage = document.createElement('img');
					travelInfoImage.style="width: 22px";
					travelInfoImage.className = "ms-4 ";
					travelInfoImage.src = "images/droptopickup.svg";
					travelInfoImage.alt = "tick";
					cardBodyColumnDiv.appendChild(travelInfoImage);
				}

				cardBodyRowDiv.appendChild(cardBodyColumnDiv)
				var cardColumn9Div = document.createElement('div');
				cardColumn9Div.className = "col-9 colm-border";

				/* source start*/
				var sourceDiv = document.createElement('div');
				var pickupTag = document.createElement('h3');
				pickupTag.className = "font-16 font-bold mb-0";

				if (assignedTrips[i].requestType == "Pickup") {
					pickupTag.innerText = assignedTrips[i].destination;
				} else {
					pickupTag.innerText = assignedTrips[i].source;
				}

				sourceDiv.appendChild(pickupTag);
				cardColumn9Div.appendChild(sourceDiv)

				var pickupHardcoded = document.createElement('h1');
				pickupHardcoded.className = "font-14 font-semi font-gray";
				pickupHardcoded.innerText = "Pickup";
				sourceDiv.appendChild(pickupHardcoded);
				/*source end*/

				/* destination start*/
				var destinationDiv = document.createElement('div');
				var dropTag = document.createElement('h3');
				dropTag.className = "font-16 font-bold posi-fix mb-0 ";
				if (assignedTrips[i].requestType == "Pickup") {
					dropTag.innerText = assignedTrips[i].source;
				} else {
					dropTag.innerText = assignedTrips[i].destination;
				}
				destinationDiv.appendChild(dropTag);
				sourceDiv.appendChild(destinationDiv)
				var dropHardcoded = document.createElement('h1');
				dropHardcoded.className = "font-14 font-semi font-gray";
				dropHardcoded.innerText = "Drop"
				destinationDiv.appendChild(dropHardcoded);
				cardBodyRowDiv.appendChild(cardColumn9Div);
				cardColumnDiv.appendChild(cardBodyRowDiv);
				cardRowDiv.appendChild(cardColumnDiv);
				/*destination end*/
				var cardColumn5Div = document.createElement('div');
				cardColumn5Div.className = 'col-5';

				/*Date and time of assigned cab*/
				var dateDiv = document.createElement('div');
				dateDiv.id = 'dateAndTime';
				var timeTag = document.createElement('h3');
				timeTag.className = "font-16 font-bold ms-3 mt-2";
				timeTag.innerText = includeOrExcludeSeconds(assignedTrips[i].timeSlot, 0);


				dateDiv.appendChild(timeTag);
				cardColumn5Div.appendChild(dateDiv)
				var dateOfTravelTag = document.createElement('h1');
				dateOfTravelTag.className = "font-14 font-semi ms-3 font-gray";
				let date = assignedTrips[i].dateOfTravel;
				let dateFormatted = date.split("-");
				dateOfTravelTag.innerText = dateFormatted[2] + "-" + dateFormatted[1] + "-" + dateFormatted[0];
				dateDiv.appendChild(dateOfTravelTag);
				/*Allocated seat count*/
				var allocatedSeatsDiv = document.createElement('div');
				allocatedSeatsDiv.className = "posi-fix ";

				var personsImg = document.createElement('img');
				personsImg.className = "ms-3 me-2 persons";
				personsImg.src = "images/persons.svg";
				personsImg.alt = "no.of employees";
				let allocatedSeatsCount = document.createElement('span');
				allocatedSeatsCount.id = "allocatedSeats";
				allocatedSeatsCount.innerText = assignedTrips[i].allocatedSeats;

				allocatedSeatsDiv.appendChild(personsImg);
				allocatedSeatsDiv.appendChild(allocatedSeatsCount);

				dateDiv.appendChild(allocatedSeatsDiv)
				cardRowDiv.appendChild(cardColumn5Div);
				cardBorDiv.appendChild(cardRowDiv);
				var viewTripDetailButton = document.createElement('button'); //buttonTag1
				viewTripDetailButton.id = assignedTrips[i].tripCabId;

				viewTripDetailButton.type = 'button'
				viewTripDetailButton.className = "font-semi font-16 w-100  go-back-to-trip-detail btn-primary mt-4";
				viewTripDetailButton.innerText = "View Trip Details";

				let redirect = (id) => window.location.href = "/driver/tripsheet?tripCabId=" + id;
				viewTripDetailButton.addEventListener('click', () => redirect(event.srcElement.id));
				viewTripDetailButton.innerHTML = "View Trip Detail";

				cardBorDiv.appendChild(viewTripDetailButton);
				document.getElementById('assignedTripDetails').appendChild(cardBorDiv);
			}

		}
	}
	catch (e) {
		jsExceptionHandling(e, "driverAssignedTrips.js-displayAssignedTrips()");
	}


}


//Inprogress Tab 

var xhrInProgressTab
function inProgressTab() {
	location.hash = "#pills-inprogress"
	recall();
	try {

		document.getElementById("daterange").style.visibility = 'hidden';
		document.getElementById("loadmore").style.visibility = 'hidden';
		var index = 0;
		var status = "Onprogress";
		xhrInProgressTab = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/cabs/" + index + "/" + status + "?cabNumber=" + cabNumber, true, "DRIVER");
		xhrInProgressTab.onreadystatechange = getInprogressTripDetails;
		xhrInProgressTab.send();
	}
	catch (e) {
		jsExceptionHandling(e, "driverAssignedTrips.js-inProgressTab()");
	}

}

function getInprogressTripDetails() {
	try {
		if (xhrInProgressTab.readyState == 4 && xhrInProgressTab.status == 200) {
			getInprogressTrips = JSON.parse(this.responseText);
			displayInprogressTrips(getInprogressTrips);
		}
	}
	catch (e) {
		jsExceptionHandling(e, "driverAssignedTrips.js-getInprogressTripDetails()");
	}

}

function displayInprogressTrips(inprogressTrips) {

	try {
		document.getElementById('assignedTripDetails').innerHTML = "";
		document.getElementById('tripCount').innerHTML = "";

		if (inprogressTrips.length == 0) {
			document.getElementById('noTripCard').innerHTML = " <img src='images/emptystatescreens.svg' class='mb-4 mt-3' alt=''>" + "<h5 class=''>Your trip will assign soon!</h5>" + "<p class='font-regular mt-3'> We'll notify you when a trip is assigned." + "</p>";
			document.getElementById('noTripCard').style.display = "block";
		}

		if (inprogressTrips.length > 0) {
			document.getElementById("noTripCard").innerHTML = '';


			for (var i = 0; i < inprogressTrips.length; i++) {

				var inprogressTripCount = 0;

				for (var j = 0; j < inprogressTrips.length; j++) {
					if (inprogressTrips[j].status == "Onprogress") {
						inprogressTripCount++;
					}
				}

				if (inprogressTrips[i].status == "Onprogress") {
					document.getElementById("tripCount").innerHTML = "<h5 class='font-20 font-bold' style='margin-left:15px'>" + "Inprogress (" + inprogressTripCount + ")" + "</h5>";

					var cardBorDiv = document.createElement('div');
					cardBorDiv.className = "card bor-rads";
					cardBorDiv.style = "margin-top: 7px";
					cardBorDiv.style = "top: -27px;margin-bottom: 15px";
					var cardLookDiv = document.createElement('div');
					cardLookDiv.className = "card-look";
					var requestTypeSpan = document.createElement('span');
					requestTypeSpan.className = "badge badge-primary card-lable";
					requestTypeSpan.innerText = inprogressTrips[i].requestType;
					cardLookDiv.appendChild(requestTypeSpan);
					cardBorDiv.appendChild(cardLookDiv);
					var cardRowDiv = document.createElement('div');
					cardRowDiv.className = "row mt-2";
					var cardColumnDiv = document.createElement('div');
					cardColumnDiv.className = "col-7 mt-2";
					var cardBodyRowDiv = document.createElement('div');
					cardBodyRowDiv.className = "row";
					var cardBodyColumnDiv = document.createElement('div');
					cardBodyColumnDiv.className = "col-3";

					//Travel image
					if (inprogressTrips[i].requestType == "Pickup") {

						var travelInfoImage = document.createElement('img');
						travelInfoImage.className = "ms-4  ";
						travelInfoImage.style="width: 22px";
						travelInfoImage.src = "images/pickupImg.svg";
						travelInfoImage.alt = "tick";
						cardBodyColumnDiv.appendChild(travelInfoImage);

					} else {
						var travelInfoImage = document.createElement('img');
						travelInfoImage.className = "ms-4  ";
						travelInfoImage.style="width: 22px";
						travelInfoImage.src = "images/droptopickup.svg";
						travelInfoImage.alt = "tick";
						cardBodyColumnDiv.appendChild(travelInfoImage);
					}


					cardBodyRowDiv.appendChild(cardBodyColumnDiv)
					var cardColumn9Div = document.createElement('div');
					cardColumn9Div.className = "col-9 colm-border";



					/* source start*/
					var sourceDiv = document.createElement('div');
					var pickupTag = document.createElement('h3');
					pickupTag.className = "font-16 font-bold mb-0";

					if (inprogressTrips[i].requestType == "Pickup") {
						pickupTag.innerText = inprogressTrips[i].destination;
					} else {
						pickupTag.innerText = inprogressTrips[i].source;
					}

					sourceDiv.appendChild(pickupTag);
					cardColumn9Div.appendChild(sourceDiv);


					var pickupHardcoded = document.createElement('h1');
					pickupHardcoded.className = "font-14 font-semi font-gray ";
					pickupHardcoded.innerText = "Pickup";
					sourceDiv.appendChild(pickupHardcoded);
					/*source end*/
					/* destination start*/
					var destinationDiv = document.createElement('div');

					//
					var dropTag = document.createElement('h3');
					dropTag.className = "font-16 font-bold posi-fix mb-0";
					if (inprogressTrips[i].requestType == "Pickup") {
						dropTag.innerText = inprogressTrips[i].source;
					} else {
						dropTag.innerText = inprogressTrips[i].destination;
					}
					destinationDiv.appendChild(dropTag);
					sourceDiv.appendChild(destinationDiv)
					var dropHardcoded = document.createElement('h1');
					dropHardcoded.className = "font-14 font-semi font-gray";
					dropHardcoded.innerText = "Drop"

					destinationDiv.appendChild(dropHardcoded);
					/*destination end*/
					cardBodyRowDiv.appendChild(cardColumn9Div);
					cardColumnDiv.appendChild(cardBodyRowDiv);
					cardRowDiv.appendChild(cardColumnDiv)
					var cardColumn5Div = document.createElement('div');
					cardColumn5Div.className = 'col-5';


					/*Date and time of assigned cab*/
					var dateDiv = document.createElement('div');
					dateDiv.id = 'dateAndTime';
					var timeTag = document.createElement('h3');
					timeTag.className = "font-16 font-bold ms-3 mt-2";
					timeTag.innerText = includeOrExcludeSeconds(inprogressTrips[i].timeSlot, 0);



					dateDiv.appendChild(timeTag);
					cardColumn5Div.appendChild(dateDiv)
					var dateOfTravelTag = document.createElement('h1');
					dateOfTravelTag.className = "font-14 font-semi ms-3 font-gray";
					let date = inprogressTrips[i].dateOfTravel;
					let dateFormatted = date.split("-");
					dateOfTravelTag.innerText = dateFormatted[2] + "-" + dateFormatted[1] + "-" + dateFormatted[0];
					dateDiv.appendChild(dateOfTravelTag);
					/*Allocated seat count*/
					var allocatedSeatsDiv = document.createElement('div');
					allocatedSeatsDiv.className = "posi-fix";

					var personsImg = document.createElement('img');
					personsImg.className = "ms-3 me-2 persons";
					personsImg.src = "images/persons.svg";
					personsImg.alt = "no.of employees";
					let allocatedSeatsCount = document.createElement('span');
					allocatedSeatsCount.id = "allocatedSeats";
					allocatedSeatsCount.innerText = inprogressTrips[i].allocatedSeats;

					allocatedSeatsDiv.appendChild(personsImg);
					allocatedSeatsDiv.appendChild(allocatedSeatsCount);

					dateDiv.appendChild(allocatedSeatsDiv)
					cardRowDiv.appendChild(cardColumn5Div);
					cardBorDiv.appendChild(cardRowDiv);
					var viewTripDetailButton = document.createElement('button');
					viewTripDetailButton.id = inprogressTrips[i].tripCabId;

					viewTripDetailButton.type = 'button'
					viewTripDetailButton.className = "font-semi font-16 w-100 mt-4 go-back-to-trip-detail btn-primary";

					let redirect = (id) => window.location.href = "/driver/tripsheet?tripCabId=" + id;
					viewTripDetailButton.addEventListener('click', () => redirect(event.srcElement.id));
					viewTripDetailButton.innerHTML = "Go Back To Trip";

					cardBorDiv.appendChild(viewTripDetailButton);
					document.getElementById('assignedTripDetails').appendChild(cardBorDiv);
				}

			}

		}
	}
	catch (e) {
		jsExceptionHandling(e, "driverAssignedTrips.js-displayInprogressTrips()");
	}


}

//Completed tab method
var cabNumber = localStorage.getItem('cabNumber');

var filterBO = {};
var filterValue;
var limit=10;
var completedTrips = [];
var xhrFilterSearchCount;
var filteredCount;
var value;
var index=0;

function completedTab(){
	if(apiCall==false){
		apiCall=true;
		document.getElementById("assignedTripDetails").innerHTML="";
	document.getElementById("tripCount").innerHTML="";
	try{
		location.hash="#pills-completed";
		recall();
		filterButtonClicked();
	document.getElementById("daterange").style.visibility = 'hidden';
//	document.getElementById("assignedTripDetails").innerHTML="";
//	document.getElementById("tripCount").innerHTML="";
	}
	catch (e) {
		jsExceptionHandling(e, "driverCompletedTrips.js-completedTab()");
	}
	}
	
}


function filterButtonClicked(){
	try{
		var select = document.getElementById('daterange');
	completedTrips=[];
	 value = select.options[select.selectedIndex].value;
	 index =0;
	getFilterCount(value);
	document.getElementById("assignedTripDetails").innerHTML="";
	}
	catch (e) {
		jsExceptionHandling(e, "driverCompletedTrips.js-filterButtonClicked()");
	}
	
}

function getFilterCount(value){
	try{
		filteredCount ="";

	var status="Completed";
	
	
	filterBO = { "cabNumber": cabNumber, "dateRange": value};
	
	xhrFilterSearchCount = createHttpRequest("POST", pathName + "/bookingInfoService/tripService/recordCount/filterAndTextSearch/cabs/" + status, true, "DRIVER");
	xhrFilterSearchCount.setRequestHeader("Content-Type", "application/json");
//	if(xhrFilterSearchCount.readyState==1){
			xhrFilterSearchCount.send(JSON.stringify(filterBO));
//		}
	
	xhrFilterSearchCount.onreadystatechange = function() {
		

		if (xhrFilterSearchCount.readyState == 4 && xhrFilterSearchCount.status == 200) {

			 filteredCount = JSON.parse(xhrFilterSearchCount.responseText);

			if (filteredCount == 0) {
				document.getElementById('noTripCard').innerHTML = " <img src='images/emptystatescreens.svg' class='mb-4 mt-3' alt=''>" + "<h5 class=''>No records found</h5>";
				document.getElementById("noTripCard").style.display = "block";
				document.getElementById("daterange").style.visibility = 'visible';
				document.getElementById("tripCount").innerHTML = "<h5 class='font-20 side-heading' style='margin-left:15px'>" + "Completed Trips (" + filteredCount + ")" + "</h5>";
			}
			else{
				document.getElementById("noTripCard").innerHTML="";
				document.getElementById("daterange").style.visibility = 'visible';
				getFilteredCompletedTrips(status,value,filteredCount);
			}
		}
	};
	}
	catch (e) {
		jsExceptionHandling(e, "driverCompletedTrips.js-getFilterCount()");
	}
	
}


var xhrFilterCompletedTrips;
function getFilteredCompletedTrips(status,value,filteredCount){
	
	try{
		filterBO = { "cabNumber": cabNumber, "dateRange": value};

	xhrFilterCompletedTrips = createHttpRequest("POST", pathName + "/bookingInfoService/tripService/filterAndTextSearch/cabs/" + index + "/" + status, true, "DRIVER");
	xhrFilterCompletedTrips.setRequestHeader("Content-Type", "application/json");
//	if(xhrFilterSearchCount.readyState==){
	xhrFilterCompletedTrips.send(JSON.stringify(filterBO));
//	}
	xhrFilterCompletedTrips.onreadystatechange =
		function() {
			if (xhrFilterCompletedTrips.readyState == 4 && xhrFilterCompletedTrips.status == 200) {
				let completedTripDetails = JSON.parse(xhrFilterCompletedTrips.responseText);
				
				completedTrips.push(...completedTripDetails);
				completedTripLength = completedTrips.length;
				document.getElementById("tripCount").innerHTML = "<h5 class='font-20 side-heading fw-bold' style='margin-left:15px'>" + "Completed Trips (" + completedTripLength + ")" + "</h5>";
				displayCompletedTrips(completedTrips);
				

				
			}
		};
	}
	catch (e) {
		jsExceptionHandling(e, "driverCompletedTrips.js-getFilteredCompletedTrips()");
	}	
	
}

function displayCompletedTrips(completedTrips){
	document.getElementById("assignedTripDetails").innerHTML="";
	if (filteredCount > 10) {
		document.getElementById("loadmore").style.visibility = 'visible';
		document.getElementById("loadmore").style.display="block"
	}
	if (filteredCount == completedTrips.length) {
		document.getElementById("loadmore").style.visibility = 'hidden';
	}
	
	try{
//			document.getElementById('assignedTripDetails').innerHTML="";
	for (var i = 0; i < completedTrips.length; i++) {
		
		if(completedTrips[i].status=="Completed"){
			var cardBorDiv = document.createElement('div');
			cardBorDiv.className = "card bor-rads";
			cardBorDiv.style = "margin-top: 7px";
			cardBorDiv.style = "top: -27px;margin-bottom: 15px";
			var cardLookDiv = document.createElement('div');
			cardLookDiv.className = "card-look";
			var requestTypeSpan = document.createElement('span');
			requestTypeSpan.className = "badge badge-primary card-lable";
			requestTypeSpan.innerText = completedTrips[i].requestType;
			cardLookDiv.appendChild(requestTypeSpan);
			cardBorDiv.appendChild(cardLookDiv);
			var cardRowDiv = document.createElement('div');
			cardRowDiv.className = "row mt-2";
			var cardColumnDiv = document.createElement('div');
			cardColumnDiv.className = "col-7 mt-2";
			var cardBodyRowDiv = document.createElement('div');
			cardBodyRowDiv.className = "row";
			var cardBodyColumnDiv = document.createElement('div');
			cardBodyColumnDiv.className = "col-3";
			
			//Travel image
			if(completedTrips[i].requestType=="Pickup"){
			
			var travelInfoImage = document.createElement('img');
			travelInfoImage.className = "ms-4  ";
			travelInfoImage.style="width: 23px";
			travelInfoImage.src = "images/pickupImg.svg";
			travelInfoImage.alt = "tick";
			cardBodyColumnDiv.appendChild(travelInfoImage);
			
			}else{
				var travelInfoImage = document.createElement('img');
			travelInfoImage.className = "ms-4 ";
			travelInfoImage.style="width: 22px";
			travelInfoImage.src = "images/droptopickup.svg";
			travelInfoImage.alt = "tick";
			cardBodyColumnDiv.appendChild(travelInfoImage);
			}
			
			
			cardBodyRowDiv.appendChild(cardBodyColumnDiv)
			var cardColumn9Div = document.createElement('div');
			cardColumn9Div.className = "col-9 colm-border";
			
			
			
			/* source start*/
			var sourceDiv = document.createElement('div');
			var pickupTag = document.createElement('h3');
			pickupTag.className = "font-16 font-bold mb-0";
			if(completedTrips[i].requestType=="Pickup"){
				pickupTag.innerText = completedTrips[i].destination;
			}else{
				pickupTag.innerText = completedTrips[i].source;
			}
			sourceDiv.appendChild(pickupTag);
			cardColumn9Div.appendChild(sourceDiv)
			
			
			var pickupHardcoded = document.createElement('h1');
			pickupHardcoded.className = "font-14 font-semi font-gray";
			pickupHardcoded.innerText = "Pickup";
			sourceDiv.appendChild(pickupHardcoded);
			/*source end*/
			
			
			/* destination start*/
			var destinationDiv = document.createElement('div');
			var dropTag = document.createElement('h3');
			dropTag.className = "font-16 font-bold posi-fix mb-0 ";
			if(completedTrips[i].requestType=="Pickup"){
				dropTag.innerText = completedTrips[i].source;
			}else{
				dropTag.innerText = completedTrips[i].destination;
			}			
			destinationDiv.appendChild(dropTag);
			sourceDiv.appendChild(destinationDiv)
			var dropHardcoded = document.createElement('h1');
			dropHardcoded.className = "font-14 font-semi font-gray";
			dropHardcoded.innerText = "Drop"
			destinationDiv.appendChild(dropHardcoded);
			
			/*destination end*/
			cardBodyRowDiv.appendChild(cardColumn9Div);
			cardColumnDiv.appendChild(cardBodyRowDiv);
			cardRowDiv.appendChild(cardColumnDiv)
			var cardColumn5Div = document.createElement('div');
			cardColumn5Div.className = 'col-5';


			/*Date and time of assigned cab*/
			var dateDiv = document.createElement('div');
			dateDiv.id = 'dateAndTime';
			var timeTag = document.createElement('h3');
			timeTag.className = "font-16 font-bold ms-3 mt-2";
			timeTag.innerText = includeOrExcludeSeconds(completedTrips[i].timeSlot, 0);
			dateDiv.appendChild(timeTag);
			cardColumn5Div.appendChild(dateDiv)
			
			var dateOfTravelTag = document.createElement('h1');
			dateOfTravelTag.className = "font-14 font-semi ms-3 font-gray";
			let date = completedTrips[i].dateOfTravel;
			let dateFormatted = date.split("-");
			dateOfTravelTag.innerText = dateFormatted[2] + "-" + dateFormatted[1] + "-" + dateFormatted[0];
			dateDiv.appendChild(dateOfTravelTag);
			
			/*Allocated seat count*/
			var allocatedSeatsDiv = document.createElement('div');
			allocatedSeatsDiv.className = "posi-fix";
			var personsImg = document.createElement('img');
			personsImg.className = "ms-3 me-2 persons";
			personsImg.src = "images/persons.svg";
			personsImg.alt = "no.of employees";
			let allocatedSeatsCount = document.createElement('span');
			allocatedSeatsCount.id = "allocatedSeats";
			allocatedSeatsCount.innerText = completedTrips[i].allocatedSeats;
			allocatedSeatsDiv.appendChild(personsImg);
			allocatedSeatsDiv.appendChild(allocatedSeatsCount);
			dateDiv.appendChild(allocatedSeatsDiv)
			cardRowDiv.appendChild(cardColumn5Div);
			cardBorDiv.appendChild(cardRowDiv);
			
			var viewTripDetailButton = document.createElement('button');
			viewTripDetailButton.id = completedTrips[i].tripCabId;

			viewTripDetailButton.type = 'button'
			viewTripDetailButton.className = "font-semi font-16 w-100 mt-4 go-back-to-trip-detail btn-primary";
			viewTripDetailButton.innerText = "View Trip Details";

			let redirect = (id) => window.location.href = "/driver/tripsheet?tripCabId=" + id;
			viewTripDetailButton.addEventListener('click', () => redirect(event.srcElement.id));
			viewTripDetailButton.innerHTML = "View Trip Detail";

			cardBorDiv.appendChild(viewTripDetailButton);
			document.getElementById('assignedTripDetails').appendChild(cardBorDiv);
			
		}
		}
		apiCall=false;
	}
	catch (e) {
		jsExceptionHandling(e, "driverCompletedTrips.js-displayCompletedTrips()");
	}

}

function loadmoreButtonClicked(){
	try{
		index++;
		getFilterCount(value);
	}
	catch (e) {
		jsExceptionHandling(e, "driverCompletedTrips.js-loadmoreButtonClicked()");
	}
}
