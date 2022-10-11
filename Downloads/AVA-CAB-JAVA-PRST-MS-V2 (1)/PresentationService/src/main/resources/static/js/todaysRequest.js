
var index = 0;
var selected = 0;
var checkedCount = 0;
var destination;
var timeSlots;
var filterApplied = false;
var searchApplied = false;
var checkWindowLoad = false;
var countofAssignedCabs;
var requestCount;
var travelingDate;
var empDetailId;
var sourceId;
var destinationId;
var xhrGetAllRequestCount;
var xhrGetAllRequests;
var xhrGetAllSources;
var xhrGetAllDestinations;
var xhrFilter;
var xhrFilterRequestDetails;
var xhrSearch;
var xhrCabModel;
var filterResponsCount;
var setIntervalOperation;
var cabModelDropdownError = document.getElementById("cabModelDropdownError");
var cabNumberDropdownError = document.getElementById("cabNumberDropdownError");
var assignedToCabError = document.getElementById("assignedToCabError");
var noRecordFound = "<h5 class=noRecordsFound>No Records Found </h5>";
var emptyErrorFilter = document.getElementById("filter-empty-check");
var dropPointSet = new Set();
var timeSlotSet = new Set();


function cabModelDropdownBlurFunction() {

	try {
		if (document.getElementById("cab-model").selectedIndex == 0) {
			document.getElementById("cab-model").style.borderColor = "red";
			cabModelDropdownError.innerHTML = "<p style='color: red'>" +
				"Cab model can't be empty</p>";
			return false;
		}
		else {
			cabModelDropdownError.innerHTML = "";
			document.getElementById("cab-model").style.borderColor = "lightgrey";
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-cabModelDropdownBlurFunction()");
	}

}

function cabNumberOnBlurFunction() {

	try {
		if (document.getElementById("cab-number").selectedIndex == 0) {
			document.getElementById("cab-number").style.borderColor = "red";
			cabNumberDropdownError.innerHTML = "<p style='color: red'>" +
				"Cab number can't be empty</p>";
			return false;
		}
		else {
			cabNumberDropdownError.innerHTML = "";
			document.getElementById("cab-number").style.borderColor = "lightgrey";
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-cabNumberOnBlurFunction()");
	}

}
//Changing this onload
//window.onload = todaysRequestTabSelected();
window.onload = function(){
	todaysRequestTabSelected();
	setIntervalOperation =  setInterval(
			releodFunction, 480000);
}

function todaysRequestTabSelected(){
	
try{	
	filterApplied = false;
	searchApplied = false;
	$("#tableBody").empty();
	getAllSource();
	recall();
	if(document.getElementById('flexRadioDefault1').checked == true){
		getTodaysRequests("Drop");
	}
	else if(document.getElementById('flexRadioDefault2').checked == true){
		getTodaysRequests("Pickup");
	}
	
	var selectCount=document.getElementById("selector");
	selectCount.innerHTML=checkedCount;
	var hidePickup = document.getElementById('pickup-time');
	hidePickup.style.display = "none";
	var hidePickupLabel = document.getElementById('pickup-label');
	hidePickupLabel.style.display = "none";
	var assignPickupButton = document.getElementById('assign-btn-pickup');
	assignPickupButton.style.display = "none";
	var sourceFilter = document.getElementById('sourceFilter');
	sourceFilter.innerHTML = "Source";
	var destFilter = document.getElementById('destinationFilter');
	destFilter.innerHTML = "Destination";
	var pickupFilter = document.getElementById('dropPointFilter');
	pickupFilter.innerHTML = "Drop Point";
	var sourceHolder = document.getElementById('sourcePlaceHolder');
	sourceHolder.innerHTML = "Select Source";
	var destHolder = document.getElementById('destinationPlaceHolder');
	destHolder.innerHTML = "Select Destination";
	var pickupHolder = document.getElementById('dropPlaceHolder');
	pickupHolder.innerHTML = "Select Drop Point";

	
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-todaysRequestTabSelected()");
	}
}


var manageDriversClicked;
var manageCabsClicked;
var assignedCabsClicked;
var todaysRequestClicked;


function recall() {
	try {
		var location = window.location.hash;



		if (location == "#pills-managedriver") {

			document.querySelector(location + "-tab").click();
			//If the location is in manage drivers all other tabs will be false and displays manage drivers screen
			todaysRequestClicked = false;
			assignedCabsClicked = false;
			manageCabsClicked = false;
			manageDriversClicked = true;

		}

		if (location == "#pills-managecab") {

			document.querySelector(location + "-tab").click();
			//If the location is in manage cabs all other tabs will be false
			todaysRequestClicked = false;
			assignedCabsClicked = false;
			manageCabsClicked = true;
			manageDriversClicked = false;

		}

		if (location == "#pills-assigned") {

			document.querySelector(location + "-tab").click();
			//If the location is in assigned cabs all other tabs will be false
			todaysRequestClicked = false;
			assignedCabsClicked = true;
			manageCabsClicked = false;
			manageDriversClicked = false;
			var radioButtonSelected = document.getElementById('assignCabsDrop');
	radioButtonSelected.checked = true;

		}

		if (location == "#pills-request") {

			document.querySelector(location + "-tab").click();
			//If the location is in todays requests all other tabs will be false
			todaysRequestClicked = true;
			assignedCabsClicked = false;
			manageCabsClicked = false;
			manageDriversClicked = false;
			var radioButtonSelectedTodayReq = document.getElementById('flexRadioDefault1');
			radioButtonSelectedTodayReq.checked = true;

		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-recall()");
	}
}

// todays request tab clicked

document.getElementById("pills-request-tab").addEventListener('click', function() {
	try {
		location.href = "/admin/dashboard#pills-request";

		if (!filterApplied) {
			var radioButtonSelected = document.getElementById('flexRadioDefault1');
			radioButtonSelected.checked = true;
			$('#tableBody').empty();
			getTodaysRequests('Drop');
		}

	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-addEventListener(click(pills-todaysrequest-tab))");
	}
});

var request;
// get total number of count
function getTodaysRequests(requestType){
	try{
		request = requestType;
		if(request == "Pickup"){
			getAllDestination();
			$(window).scrollTop(0);
			$("#tableBody").empty();
			index = 0;
			var checkBoxSelected = document.getElementById('flexCheckChecked');
			checkBoxSelected.checked = false;
			var hidePickup = document.getElementById('pickup-time');
			hidePickup.style.display = "block";
			var hidePickupLabel = document.getElementById('pickup-label');
			hidePickupLabel.style.display = "block";
			var assignButton = document.getElementById('assign-btn-pickup');
			assignButton.style.display = "block";
			var assignDropButton = document.getElementById('assign-btn');
			assignDropButton.style.display = "none";
			var sourceLabel = document.getElementById('todaysRequestSource');
			sourceLabel.innerHTML = "Destination";
			var destinationLabel = document.getElementById('todaysRequestDestination');
			destinationLabel.innerHTML = "Source";
			var dropPointLabel = document.getElementById('todaysDropPoint');
			dropPointLabel.innerHTML = "Pickup Point";
			var sourceFilter = document.getElementById('sourceFilter');
			sourceFilter.innerHTML = "Destination";
			var destFilter = document.getElementById('destinationFilter');
			destFilter.innerHTML = "Source";
			var pickupFilter = document.getElementById('dropPointFilter');
			pickupFilter.innerHTML = "Pickup Point";
			var sourceHolder = document.getElementById('sourcePlaceHolder');
			sourceHolder.innerHTML = "Select Destination";
			var destHolder = document.getElementById('destinationPlaceHolder');
			destHolder.innerHTML = "Select Source";
			var pickupHolder = document.getElementById('dropPlaceHolder');
			pickupHolder.innerHTML = "Select Pickup Point";
			var locationThead = document.getElementById("locationThead");
			locationThead.style.display = "block";
		}
		else if(request == "Drop"){
			getAllDestination();
			$(window).scrollTop(0);
			$("#tableBody").empty();
			index = 0;
			var checkBoxSelected = document.getElementById('flexCheckChecked');
			checkBoxSelected.checked = false;
			var hidePickup = document.getElementById('pickup-time');
			hidePickup.style.display = "none";
			var hidePickupLabel = document.getElementById('pickup-label');
			hidePickupLabel.style.display = "none";
			var assignButton = document.getElementById('assign-btn-pickup');
			assignButton.style.display = "none";
			var assignDropButton = document.getElementById('assign-btn');
			assignDropButton.style.display = "block";
			var sourceLabel = document.getElementById('todaysRequestSource');
			sourceLabel.innerHTML = "Source";
			var destinationLabel = document.getElementById('todaysRequestDestination');
			destinationLabel.innerHTML = "Destination";
			var dropPointLabel = document.getElementById('todaysDropPoint');
			dropPointLabel.innerHTML = "Drop Point";
			var sourceFilter = document.getElementById('sourceFilter');
			sourceFilter.innerHTML = "Source";
			var destFilter = document.getElementById('destinationFilter');
			destFilter.innerHTML = "Destination";
			var pickupFilter = document.getElementById('dropPointFilter');
			pickupFilter.innerHTML = "Drop Point";
			var sourceHolder = document.getElementById('sourcePlaceHolder');
			sourceHolder.innerHTML = "Select Source";
			var destHolder = document.getElementById('destinationPlaceHolder');
			destHolder.innerHTML = "Select Destination";
			var pickupHolder = document.getElementById('dropPlaceHolder');
			pickupHolder.innerHTML = "Select Drop Point";
			var locationThead = document.getElementById("locationThead");
			locationThead.style.display = "none";
		}
	var url=pathName+"/bookingInfoService/bookingRequest/todaysrequest/requestCount/"+requestType;
	xhrGetAllRequestCount=createHttpRequest("GET",url, true,"ADMIN"); 
    xhrGetAllRequestCount.onreadystatechange = todaysRequestResponseCount;
    xhrGetAllRequestCount.send(null);	
    }
    catch(e){
		jsExceptionHandling(e, "todaysRequest.js-getTodaysRequests()");
	}
}

function todaysRequestResponseCount() {

	try {
		if (xhrGetAllRequestCount.readyState == 4 && xhrGetAllRequestCount.status == 200) {
			requestCount = JSON.parse(xhrGetAllRequestCount.responseText);
			if (requestCount == 0) {
				var loadMoreIcon = document.getElementById('loadMore');
				loadMoreIcon.style.display = 'none';
				document.getElementById("noRecordTodaysRequest").innerHTML = noRecordFound;
				document.getElementById("tableBody").style.display = "none";


				document.getElementById("topCount").innerHTML = " (" + requestCount + ")";

			}
			else {
				
				document.getElementById("noRecordTodaysRequest").innerHTML="";	
				document.getElementById('tableBody').style.display="table-row-group";
			
				todaysRequestResponse(index, request);

			}
		}
		

	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-todaysRequestResponseCount()");
	}
}


function todaysRequestResponse(index, request){
	
	try{
	var url=pathName+"/bookingInfoService/bookingRequest/todaysRequest/userRequests/"+index+"/"+request;
	xhrGetAllRequests=createHttpRequest("GET",url, true,"ADMIN");
	xhrGetAllRequests.onreadystatechange = todaysRequestResponseDetail;
    xhrGetAllRequests.send(null);	
    }
    catch(e){
		jsExceptionHandling(e, "todaysRequest.js-todaysRequestResponse(index)");
	}
}

function todaysRequestResponseDetail() {
	try {

		if (xhrGetAllRequests.readyState == 4 && xhrGetAllRequests.status == 200) {
			var responseRequest = JSON.parse(xhrGetAllRequests.responseText);
			dynamicTable(responseRequest);
			if ($('#tableBody tr').length == requestCount) {
				var loadMoreIcon = document.getElementById('loadMore');
				loadMoreIcon.style.display = 'none';	
			}else{
				var loadMoreIcon = document.getElementById('loadMore');
				loadMoreIcon.style.display = 'block';	
			}
			document.getElementById("topCount").innerHTML = " (" + requestCount + ")";
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-todaysRequestResponseDetail()");
	}
}	
	
function dynamicTable(responseRequest){
			
	var counter = 0;
		for(var i=0;i<responseRequest.length;i++)
            {
                 counter++;
                var trow=document.createElement('tr');
                trow.className="row-bg-style";
                trow.id="row-id";
                
                
                

                var checkBox=document.createElement('td');
                checkBox.className="spacing";
                checkBox.innerHTML=

                    "<input class='form-check-input check' type='checkbox' value='' name='plan' id='flex-check' onclick='selectedRecordCount()'>"+ 
                    " <label class='form-check-label' for='flexCheckChecked'></label>";
               
				empDetailId = document.createElement('td');
				empDetailId.className = "spacing";
				empDetailId.id = "empDetId";
				empDetailId.innerHTML = responseRequest[i].employeeDetailId;
				empDetailId.style.display = "none";
				

                var empId=document.createElement('td');
                empId.className="spacing";
                empId.id="empId";
                empId.innerHTML=responseRequest[i].employeeId;
                
                

                var empName=document.createElement('td');
                empName.className="spacing";
                empName.id="empName";
                empName.innerHTML=responseRequest[i].employeeName;

				var employeeContactNumber = document.createElement('td');
				employeeContactNumber.className="spacing";
				employeeContactNumber.id = "phNumber";
				employeeContactNumber.innerHTML = responseRequest[i].phoneNumber;
				
				sourceId = document.createElement('td');
				sourceId.className = "spacing";
				sourceId.id = "srcId";
				sourceId.innerHTML = responseRequest[i].sourceId;
				sourceId.style.display = "none";
				
                var source=document.createElement('td');
                source.className="spacing";
                source.id="src";
                source.innerHTML=responseRequest[i].source;

				destinationId = document.createElement('td');
				destinationId.className = "spacing";
				destinationId.id = "destId";
				destinationId.innerHTML = responseRequest[i].destinationId;
				destinationId.style.display = "none";
				
                var destination=document.createElement('td');
                destination.className="spacing";
                destination.id="dest";
                destination.innerHTML=responseRequest[i].destination;

                var dropPoint=document.createElement('td');
                dropPoint.className="spacing";
                dropPoint.id="dpPt";
                dropPoint.innerHTML=responseRequest[i].dropPoint;

      			var bookingTime=document.createElement('td');
                bookingTime.className="spacing";
                bookingTime.id="bookTime";
                var bookingTimeSlot = responseRequest[i].bookingTime;
                bookingTime.innerHTML = timeFormatTo12Hr(bookingTimeSlot,1);
                bookingTime.style.display="none";
                
                var bookTimeNoSec=document.createElement('td');
                bookTimeNoSec.className="spacing";
                bookTimeNoSec.id="bookTimeNoSec";
                var noSecBookingTime = responseRequest[i].bookingTime;
                bookTimeNoSec.innerHTML = timeFormatTo12Hr(noSecBookingTime,0);

 


                var timeSlot = document.createElement('td');
                timeSlot.className = "spacing";
                timeSlot.id = "timeSlot";
                var formatedTimeSlot = responseRequest[i].timeSlot;
                timeSlot.innerHTML = timeFormatTo12Hr(formatedTimeSlot,1);
                timeSlot.style.display="none";
                
                 var timeSlotNoSec = document.createElement('td');
                timeSlotNoSec.className = "spacing";
                timeSlotNoSec.id = "timeSlotNoSec";
                var noSecTimeSlot = responseRequest[i].timeSlot;
                timeSlotNoSec.innerHTML = timeFormatTo12Hr(noSecTimeSlot,0);
                

 

                var bookingId=document.createElement('td');
                bookingId.style.display = "none";
                bookingId.id="bookingId";
                bookingId.innerHTML=responseRequest[i].bookingId;

				dateOfTravel=document.createElement('td');
				dateOfTravel.className = "spacing";
				dateOfTravel.id="dateOfTravel";
				var date = responseRequest[i].dateOfTravel.split("\-");
				var day = date[2] + "/" + date[1] + "/" + date[0];
				dateOfTravel.innerText = day;
 				travelingDate=responseRequest[i].dateOfTravel;
 				
                trow.appendChild(checkBox);
                trow.appendChild(empId);
                trow.appendChild(empDetailId);

                trow.appendChild(empName);
                trow.appendChild(employeeContactNumber);
                trow.appendChild(sourceId);
                trow.appendChild(source);
                trow.appendChild(destinationId);
                trow.appendChild(destination);
                trow.appendChild(dropPoint);
                if(request == "Pickup"){
					var location  = document.createElement('td');
					location.className = "spacing locationTooltip text-nowrap";
					location.title = responseRequest[i].location;
					location.id = "location"+counter;
					location.innerHTML = responseRequest[i].location;
					trow.appendChild(location);
				
				}

                trow.appendChild(bookingTime);
                trow.appendChild(bookTimeNoSec);
                trow.appendChild(timeSlot);
                trow.appendChild(timeSlotNoSec);
                trow.appendChild(bookingId);
                trow.appendChild(dateOfTravel);
                          
                document.getElementById("tableBody").appendChild(trow);

            }

		 if(checkWindowLoad==true)
		    {
			
		    document.getElementById("topCountAssignedCabs").innerHTML=" ("+countofAssignedCabs+")"; 
		    checkWindowLoad=false;

            }

     }

 // for scroll  

//window.addEventListener('scroll', () => {
//	if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
	
	document.getElementById("loadMore").addEventListener('click', function(){
		if (request == "Drop") {

			if ($('#tableBody tr').length != requestCount) {
				
				index++;
				if (filterApplied == false && searchApplied == false) {

					todaysRequestResponse(index, request);
				}
				else {
					filterTodaysRequest(index, request);
				}

			}

		}


		if (request == "Pickup") {
			if ($('#tableBody tr').length != requestCount) {
				index++;
				if (filterApplied == false && searchApplied == false) {

					todaysRequestResponse(index, request);

				} else {
					filterTodaysRequest(index, request);
				}
			}

		}
//		else {
//			index = 0;
//		}
	})
		
//	}
//})

document.getElementById("ScrollUp").addEventListener("click", function() {
	try {
		$(window).scrollTop(0);
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-addEventListener(click(ScrollUp))");
	}

});

// To load Source details for filters


function getAllSource() {
	try {
		var url = pathName + "/route/getSource";
		xhrGetAllSources = createHttpRequest("GET", url, true, "ADMIN");
		xhrGetAllSources.onreadystatechange = fetchSourceList;
		xhrGetAllSources.send(null);
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-getAllSource()");
	}
}

function fetchSourceList() {
	try {
		if (xhrGetAllSources.readyState == 4 && xhrGetAllSources.status == 200) {
			// to clear the list of sources
			var length = document.getElementById("Source").options.length;
			for (i = length - 1; i > 0; i--) {
				document.getElementById("Source").options[i] = null;
			}


			var listOfSources = JSON.parse(xhrGetAllSources.responseText);

			// to append the list of sources
			for (var i = 0; i < listOfSources.length; i++) {

				var opt = document.createElement("option");
				opt.innerHTML = listOfSources[i].source;
				document.getElementById("Source").appendChild(opt);
			}

		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-fetchSourceList()");
	}
}




// To load Destination Details for filters

function getAllDestination() {
	try {
		var url = pathName + "/route/getAllDestination";
		xhrGetAllDestinations = createHttpRequest("GET", url, true, "ADMIN");
		xhrGetAllDestinations.onreadystatechange = fetchDestinationList;
		xhrGetAllDestinations.send(null);
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-getAllDestination()");
	}

}

function fetchDestinationList() {

	try {
		if (xhrGetAllDestinations.readyState == 4 && xhrGetAllDestinations.status == 200) {
			var length = document.getElementById("Destination").options.length;
			for (i = length - 1; i > 0; i--) {
				document.getElementById("Destination").options[i] = null;
			}

			var listOfDestinations = JSON.parse(xhrGetAllDestinations.responseText);

			for (var i = 0; i < listOfDestinations.length; i++) {
				var destinationOpt = document.createElement("option");
				destinationOpt.innerHTML = listOfDestinations[i].destination;
				document.getElementById("Destination").appendChild(destinationOpt);
				if(request == 'Drop'){
					for (var j = 0; j < listOfDestinations[i].dropTimeSlot.length; j++) {
	
						var dropSlot = listOfDestinations[i].dropTimeSlot[j].dropTimeSlot;
						var dropTimeSlotAdd = timeFormatTo12Hr(dropSlot, 0);
						timeSlotSet.add(dropTimeSlotAdd);
	
					}
				}
				else if(request == 'Pickup'){
					for (var j = 0; j < listOfDestinations[i].pickupTimeSlot.length; j++) {

						var pickupSlot = listOfDestinations[i].pickupTimeSlot[j].pickupTimeSlot;
						var pickupTimeSlotAdd = timeFormatTo12Hr(pickupSlot, 0);
						timeSlotSet.add(pickupTimeSlotAdd);

					}
				}

				for (var j = 0; j < listOfDestinations[i].dropPoints.length; j++) {

					dropPointSet.add(listOfDestinations[i].dropPoints[j].dropPoint);
				}

			}

			filterDropPointSet();
			filterTimeSlot();
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-fetchDestinationList()");
	}
}


// on click of destination in filter append a time slot and drop points
function onSelectOfDestination() {

	try {

		var selectedDestination = document.querySelector('#Destination').value;

		if (xhrGetAllDestinations.readyState == 4 && xhrGetAllDestinations.status == 200) {

			var lengthTime = document.getElementById('timeslot').options.length;
			for (var i = lengthTime - 1; i > 0; i--) {
				document.getElementById("timeslot").options[i] = null;
			}
			
			
			timeSlotSet.clear();
			
			var lengthDrop = document.getElementById('droppoint').options.length;
			for (var i = lengthDrop - 1; i > 0; i--) {
				document.getElementById("droppoint").options[i] = null;
			}

			var listOfDestinations = JSON.parse(xhrGetAllDestinations.responseText);



			for (var i = 0; i < listOfDestinations.length; i++) {
				if (listOfDestinations[i].destination == selectedDestination) {

				if(request == 'Drop'){
					for (var j = 0; j < listOfDestinations[i].dropTimeSlot.length; j++) {
						var dropSlot = listOfDestinations[i].dropTimeSlot[j].dropTimeSlot;
						var dropTimeSlotAdd = timeFormatTo12Hr(dropSlot, 0);
						timeSlotSet.add(dropTimeSlotAdd);
					}
					
				}
				else if(request == 'Pickup'){
					for (var j = 0; j < listOfDestinations[i].pickupTimeSlot.length; j++) {
						var pickupSlot = listOfDestinations[i].pickupTimeSlot[j].pickupTimeSlot;
						var pickupTimeSlotAdd = timeFormatTo12Hr(pickupSlot, 0);
						timeSlotSet.add(pickupTimeSlotAdd);

					}
				}
				filterTimeSlot();

					for (var j = 0; j < listOfDestinations[i].dropPoints.length; j++) {

						var opt = document.createElement("option");
						opt.innerHTML = listOfDestinations[i].dropPoints[j].dropPoint;

						document.getElementById("droppoint").appendChild(opt);
					}
				}
			}
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-onSelectOfDestination()");
	}
}




function filterTimeSlot() {

	try {
		
		var length = document.getElementById("timeslot").options.length;
		for (i = length - 1; i > 0; i--) {
			document.getElementById("timeslot").options[i] = null;
		}

		const timeSlotIterator = timeSlotSet.values();

		for (var j = 0; j < timeSlotSet.size; j++) {
			var filtertimeSlot = document.createElement("option");
			filtertimeSlot.innerText = timeSlotIterator.next().value;
			document.getElementById("timeslot").options.add(filtertimeSlot);
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-filterTimeSlot()");
	}
}




function filterDropPointSet() {

	try {

		var length = document.getElementById("droppoint").options.length;
		for (i = length - 1; i > 0; i--) {
			document.getElementById("droppoint").options[i] = null;
		}

		const dropPointIterator = dropPointSet.values();

		for (var j = 0; j < dropPointSet.size; j++) {
			var filterDropPoint = document.createElement("option");
			filterDropPoint.innerText = dropPointIterator.next().value;
			document.getElementById("droppoint").options.add(filterDropPoint);
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-filterDropPointSet()");
	}

}


// filter apply button clicked

function applyFilterButtonClicked() {
	try {
		var validate = checkEmptyField();

		if (validate) {
			$("#tableBody").empty();
			filterApplied = true;
			filterApply(request);
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-applyFilterButtonClicked()");
	}
}


function filterApply(request) {

	try {
		if (document.getElementById("Source").value == "" || document.getElementById("Source").value == undefined || document.getElementById("Source").selectedIndex == 0) {
			filterSource = null;
		} else {
			filterSource = document.getElementById("Source").value;
		}
		if (document.getElementById("Destination").value == "" || document.getElementById("Destination").value == undefined || document.getElementById("Destination").selectedIndex == 0) {
			filterDestination = null;
		} else {
			filterDestination = document.getElementById("Destination").value;
		}
		if (document.getElementById("droppoint").value == "" || document.getElementById("droppoint").value == undefined || document.getElementById("droppoint").selectedIndex == 0) {
			filterDropPoint = null;
		} else {
			filterDropPoint = document.getElementById("droppoint").value;
		}
		if (document.getElementById("timeslot").value == "" || document.getElementById("timeslot").value == undefined || document.getElementById("timeslot").selectedIndex == 0) {
			bookingTimeSlot = null;
		} else {
			filterTime = document.getElementById("timeslot").value;

			var splittedTimeSlot = filterTime.split(":");
			minute = splittedTimeSlot[1].split(" ")[0];

			if (splittedTimeSlot[1].includes("PM")) {
				if (Number(splittedTimeSlot[0]) + 12 == 24) {
					bookingTimeSlot = "12" + ":" + minute + ":00";
				} else {
					splittedTimeSlotHour = Number(splittedTimeSlot[0]) + 12;
					bookingTimeSlot = splittedTimeSlotHour + ":" + minute + ":00";
				}
			} else {
				seconds = splittedTimeSlot[1].split(" ");
				if (Number(splittedTimeSlot[0]) == 12) {
					bookingTimeSlot = "00" + ":" + minute + ":00";
				} else if (Number(splittedTimeSlot[0]) < 10) {
					bookingTimeSlot = "0" + Number(splittedTimeSlot[0]) + ":" + minute + ":00";
				} else {
					bookingTimeSlot = Number(splittedTimeSlot[0]) + ":" + minute + ":00";
				}
			}

		}

		if (document.getElementById("searchTab-TodaysRequestSearch").value == "" || document.getElementById("searchTab-TodaysRequestSearch").value == undefined || document.getElementById("searchTab-TodaysRequestSearch").selectedIndex == 0) {
			searchText = null;
		} else {
			searchText = document.getElementById("searchTab-TodaysRequestSearch").value;
		}


		var filterCountData = { "source": filterSource, "destination": filterDestination, "dropPoint": filterDropPoint, "timeSlot": bookingTimeSlot, "searchText": searchText };

		var url = pathName + "/bookingInfoService/bookingRequest/todaysrequest/filterCount/"+request;
		xhrFilter = createHttpRequest("POST", url, true, "ADMIN");
		xhrFilter.setRequestHeader("Content-Type", "application/json");
		xhrFilter.send(JSON.stringify(filterCountData));

		xhrFilter.onreadystatechange = filterCountResponse;
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-filterApply()");
	}

}

function filterCountResponse() {
	try {
		if (xhrFilter.readyState == 4 && xhrFilter.status == 200) {
			filterResponsCount = JSON.parse(xhrFilter.responseText);
			var loadMoreIcon = document.getElementById('loadMore');
			if (filterResponsCount == 0) {
				
				loadMoreIcon.style.display = 'none';
				document.getElementById("noRecordTodaysRequest").innerHTML = noRecordFound;
				document.getElementById("tableBody").style.display = "none";


				document.getElementById("topCount").innerHTML = " (" + filterResponsCount + ")";

			} else {
				
				document.getElementById("noRecordTodaysRequest").innerHTML = "";

				document.getElementById('tableBody').style.display = "table-row-group";
				
				$("#tableBody").empty();
				filterTodaysRequest(index, request);
			}
		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-filterCountResponse()");
	}
}




function filterTodaysRequest(index, request) {

	try {
		var filterData = { "source": filterSource, "destination": filterDestination, "dropPoint": filterDropPoint, "timeSlot": bookingTimeSlot, "searchText": searchText };

		var url = pathName + "/bookingInfoService/bookingRequest/todaysrequest/filter/" + index+"/"+request;
		xhrFilterRequestDetails = createHttpRequest("POST", url, true, "ADMIN");
		xhrFilterRequestDetails.setRequestHeader("Content-Type", "application/json");
		xhrFilterRequestDetails.send(JSON.stringify(filterData));

		xhrFilterRequestDetails.onreadystatechange = filterResponse;
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-filterTodaysRequest(index, request)");
	}
}

function filterResponse() {
	try {
		if (xhrFilterRequestDetails.readyState == 4 && xhrFilterRequestDetails.status == 200) {
			var filterRequestDetails = JSON.parse(xhrFilterRequestDetails.responseText);
			dynamicTable(filterRequestDetails);

			if ($('#tableBody tr').length == filterResponsCount) {
				var loadMoreIcon = document.getElementById('loadMore');
				loadMoreIcon.style.display = 'none';	
			}else{
				var loadMoreIcon = document.getElementById('loadMore');
				loadMoreIcon.style.display = 'block';	
			}
			document.getElementById("topCount").innerHTML = " (" + filterResponsCount + ")";


		}
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-filterResponse()");
	}
}



// filter Cancel button clicked
var cancel = document.getElementById("cancelAssignButton");  // CancelButton to get All AssignedCab
cancel.addEventListener('click', function() {

	try {
		document.getElementById("noRecordTodaysRequest").innerHTML = "";
		document.getElementById("Destination").selectedIndex = 0;  // Clear the filter
		document.getElementById("Source").selectedIndex = 0;
		document.getElementById("timeslot").selectedIndex = 0;
		document.getElementById("droppoint").selectedIndex = 0;
		filterApplied = false;

		$("#cab-body").empty();
		todaysRequestTabSelected();
		document.getElementById('tableBody').style.display = "table-row-group";


		errorFilter.innerHTML = "";
		document.getElementById('Source').classList.add("style-select1");
		document.getElementById('Destination').classList.add("style-select1");
		document.getElementById('timeslot').classList.add("style-select1");
		document.getElementById('droppoint').classList.add("style-select1");
	}
	catch (e) {
		jsExceptionHandling(e, "todaysRequest.js-addEventListener(click(cancelAssignButton))");
	}
});



// filter close button clicled
function filterCloseButtonClicked() {

	alertRemove();
}


function alertRemove() {
	emptyErrorFilter.innerHTML = "";

	document.getElementById("Source").classList.add("style-select1");

	document.getElementById("Destination").classList.add("style-select1");

	document.getElementById("droppoint").classList.add("style-select1");

	document.getElementById("timeslot").classList.add("style-select1");

}


// search employee name and id
document.getElementById("searchTab-TodaysRequestSearch").addEventListener('keyup', function(event) {
	$("#tableBody").empty();
	filterApply(request);

});


//search empty check
function searchTextEmptyCheck() {
	if ((document.getElementById("searchTab-TodaysRequestSearch").value == "" || document.getElementById("searchTab-TodaysRequestSearch").value == undefined)) {
		todaysRequestTabSelected();
	}
}

//blur function

var cabModelDropdownError = document.getElementById("cabModelDropdownError");
var cabNumberDropdownError = document.getElementById("cabNumberDropdownError");
var assignedToCabError = document.getElementById("assignedToCabError");

function cabModelDropdownBlurFunction() {

	if (document.getElementById("cab-model").selectedIndex == 0) {
		document.getElementById("cab-model").style.borderColor = "red";
		cabModelDropdownError.innerHTML = "<p style='color: red'>" +
			"Cab model can't be empty</p>";
		return false;
	}
	else {
		cabModelDropdownError.innerHTML = "";
		document.getElementById("cab-model").style.borderColor = "lightgrey";
	}

}

function cabNumberOnBlurFunction() {

	if (document.getElementById("cab-number").selectedIndex == 0) {
		document.getElementById("cab-number").style.borderColor = "red";
		cabNumberDropdownError.innerHTML = "<p style='color: red'>" +
			"Cab number can't be empty</p>";
		return false;
	}
	else {
		cabNumberDropdownError.innerHTML = "";
		document.getElementById("cab-number").style.borderColor = "lightgrey";
	}

}




function assignedToCabBlurFunction() {

	if (selectedRequest.length == 0) {
		document.getElementById("assign-to-cab-button").style.borderColor = "red";
		assignedToCabError.style.display = "block";

		assignedToCabError.innerHTML = "<p style='color: red'>" + "Select Employee</p>";
		$("#assign-to-cab").modal("hide");

		return false;
	}
	else {
		assignedToCabError.innerHTML = "";
		document.getElementById("assign-to-cab-button").style.borderColor = "lightgrey";
	}

}

//To pass the checked value row information
var selectedSrc;
var selectedDest;
var selectedTimeSlot;
var checkedValue;
var date;
var dateOfTravel;
var currentDate;
var xhrChecked;
var selectedRequest;
var id;
var name;
var dropPt;
var bookingId;
var selectedSrcId;
var selectedDestId;
var employeeDetailId;
var submitBtn = document.getElementById("assign-to-cab-button");

function assignToCabButtonClicked() {
	
	//jawahar added
	cabModelDropdownError.innerHTML="";
	document.getElementById("cab-model").style.borderColor = "lightgrey";
	cabNumberDropdownError.innerHTML="";
	document.getElementById("cab-number").style.borderColor = "lightgrey";
	//jawahar added

	selected = 0;
	document.getElementById("flexCheckChecked").checked = false;


	var table = document.getElementById("tableBody");

	var tableRowCount = table.rows.length;

	selectedRequest = new Array();
	var defTimeSlot = null;

	for (var i = 0; i < tableRowCount; i++) {

		checkedValue = table.rows[i].querySelector('input[type=checkbox][name=plan]:checked');

		if (checkedValue) {


			employeeDetailId = table.rows[i].cells.empDetId.innerText;
			id = table.rows[i].cells.empId.innerText;
			name = table.rows[i].cells.empName.innerText;
			selectedSrcId = table.rows[i].cells.srcId.innerText;
			selectedSrc = table.rows[i].cells.src.innerText;
			selectedDestId = table.rows[i].cells.destId.innerText;
			selectedDest = table.rows[i].cells.dest.innerText;
			dropPt = table.rows[i].cells.dpPt.innerText;
			bookingId = table.rows[i].cells.bookingId.innerText;


			var timeSlotSelected = table.rows[i].cells.timeSlot.innerText;
			var timeSlot;
			if (timeSlotSelected != 0) {

				timeSlot = minutesValidation(timeSlotSelected);

			}
			selectedTimeSlot = timeSlot;


			if (defTimeSlot != null) {

				if (defTimeSlot != selectedTimeSlot) {

					document.getElementById("assign-to-cab-button").style.borderColor = "red";

					assignedToCabError.innerHTML = "<p style='color: red'>" + "Different timeslot</p>";
					document.getElementById("assignedToCabError").style.display = "block";
					document.getElementById("assign-to-cab-button").setAttribute("data-bs-target", "none");
					
					return false;
				}
				
			}

			defDest = selectedDest;
			defTimeSlot = selectedTimeSlot;
			var plan = {
				"employeeDetailId": employeeDetailId, "employeeId": id, "employeeName": name, "sourceId": selectedSrcId, "source": selectedSrc, "destinationId": selectedDestId, "destination": selectedDest,
				"dropPoint": dropPt, "timeSlot": selectedTimeSlot, "bookingId": bookingId, "requestType":request
			};
			selectedRequest.push(plan);

			selected = selected + 1;
			destination = selectedDest;
			timeSlots = selectedTimeSlot;


		}
		else {
			continue;
		}

	}

	if (selectedRequest.length == 0) {
		assignedToCabBlurFunction();


		document.getElementById("assign-to-cab-button").setAttribute("data-target", "none");

		return false;
	}

	else {
	
		document.getElementById("assign-to-cab-button").setAttribute("data-target", "#assign-to-cab");
		assignClicked();
	}

}

function minutesValidation(timeSlotSelected){
	var splittedTimeSlot;
	var splittedTimeSlotHour;
	var timeSlot;
	splittedTimeSlot = timeSlotSelected.split(":");
	var seconds = splittedTimeSlot[2].split(" ")[0];
	if(splittedTimeSlot[2].includes('PM')){
		if (Number(splittedTimeSlot[0]) + 12 == 24) {
			timeSlot = "12" + ":" + (Number(splittedTimeSlot[1])==0 ? "00":splittedTimeSlot[1]) + ":" + seconds;
		}else{
			splittedTimeSlotHour = Number(splittedTimeSlot[0]) + 12;
			timeSlot = Number(splittedTimeSlotHour) + ":" + (Number(splittedTimeSlot[1])==0 ? "00":splittedTimeSlot[1]) + ":" + seconds;
		}
	}else{
		
		if(splittedTimeSlot[0] == 12){
			timeSlot = "00" + ":" + (Number(splittedTimeSlot[1])==0 ? "00":splittedTimeSlot[1]) + ":" + seconds;

		}else{

			timeSlot = (Number(splittedTimeSlot[0])<10 ? "0"+Number(splittedTimeSlot[0]):Number(splittedTimeSlot[0])) + ":" + (Number(splittedTimeSlot[1])==0 ? "00":splittedTimeSlot[1]) + ":" + seconds;
		}
	}
	
	return timeSlot;
}
// Function  to get all cabmodel and reset the other fields


//document.getElementById("assign-to-cab-button").addEventListener('click', function() {

function assignClicked(){

var url = pathName + "/bookingInfoService/bookingRequest/getAllCabModels";
	xhrCabModel = createHttpRequest("GET", url, true, "ADMIN");

	document.getElementById("cab-number").selectedIndex = 0;
	document.getElementById("cab-driver-name").value = null;
	document.getElementById("cab-driver-number").value = null;
	document.getElementById("total-seats").innerText = "Available No. Of Seats :";
	document.getElementById("allocated-seats").innerText = "Allocated No. Of Seats :";
	document.getElementById("remaining-seats").innerText = "Remaining No. Of Seats :";
	xhrCabModel.onreadystatechange = processResponse;
	xhrCabModel.send(null);
	$("#cab-driver-name").prop("readonly", true);
	$("#cab-driver-number").prop("readonly", true);
	$("#total-seats").prop("readonly", true);


}

var cabModels;

function processResponse() {

	if (xhrCabModel.readyState == 4 && xhrCabModel.status == 200) {
		var cabModelList = document.getElementById("cab-model");
		var length = cabModelList.options.length;

		for (i = length - 1; i > 0; i--) {
			cabModelList.options[i] = null;
		}

		cabModels = JSON.parse(xhrCabModel.responseText);

		for (var i = 0; i < cabModels.length; i++) {

			var opt = document.createElement("option");

			opt.innerHTML = cabModels[i];
			document.getElementById("cab-model").options.add(opt);

		}

	}

}


// on select of cab model
var xhrCabNumber;

document.getElementById("cab-model").addEventListener('change', function() {



	event.preventDefault();
	document.getElementById("cab-driver-name").value = null;
	document.getElementById("cab-driver-number").value = null;
	document.getElementById("total-seats").innerText = "Available No. Of Seats :";
	document.getElementById("allocated-seats").innerText = "Allocated No. Of Seats :";
	document.getElementById("remaining-seats").innerText = "Remaining No. Of Seats :";

	var selectedCabModel = document.querySelector('#cab-model').value;

	var url = pathName + "/bookingInfoService/bookingRequest/todaysrequest/cabNumber/" + selectedCabModel + "/" + selected + "/" + timeSlots+"/"+request;
	xhrCabNumber = createHttpRequest("GET", url, true, "ADMIN");
	xhrCabNumber.onreadystatechange = processResponseChange;
	xhrCabNumber.send(null);



});

var cabNumbers;

function processResponseChange() {


	if (xhrCabNumber.readyState == 4 && xhrCabNumber.status == 200) {


		var cabNumberList = document.getElementById("cab-number");
		var length = cabNumberList.options.length;

		for (i = length - 1; i > 0; i--) {
			cabNumberList.options[i] = null;
		}

		cabNumbers = JSON.parse(xhrCabNumber.responseText);


		for (var i = 0; i < cabNumbers.length; i++) {




			var cabNumberOption = document.createElement("option");
			cabNumberOption.innerHTML = cabNumbers[i].cabNumber;
			cabNumberOption.value = cabNumbers[i].cabInfoId;
			document.getElementById("cab-number").options.add(cabNumberOption);

		}

	}


}

//---------------------------------------------------------------------------------------------------------------//


//  on select of cab number and To auto fill the driver details and seat details

var xhrDetails = new XMLHttpRequest();
var selectedCabNumber;
document.getElementById("cab-number").addEventListener('change', function() {
	selectedCabNumber = document.querySelector('#cab-number').value;
	
	for(let eachCabInfo of cabNumbers) {
		
		if (eachCabInfo.cabInfoId == selectedCabNumber) {

			document.getElementById("cab-driver-name").name = eachCabInfo.driverId;
			document.getElementById("cab-driver-name").value = eachCabInfo.driverName;
			document.getElementById("cab-driver-number").value = eachCabInfo.driverNumber;


			document.getElementById("total-seats").innerText = "Available No. Of Seats : " + eachCabInfo.totalSeats;
			document.getElementById("allocated-seats").innerText = "Allocated No. Of Seats : " + eachCabInfo.allocatedSeats;
			document.getElementById("remaining-seats").innerText = "Remaining No. Of Seats : " + eachCabInfo.remainingSeats;

		}
		
	}
	
	

});
function processResponseChangeCabNum() {


	var cabNumbers1 = JSON.parse(xhrDetails.responseText);

	for (var i = 0; i < cabNumbers1.length; i++) {

		if ((cabNumbers1[i].cabInfoId) == selectedCabNumber) {

			document.getElementById("cab-driver-name").name = cabNumbers1[i].driverId;
			document.getElementById("cab-driver-name").value = cabNumbers1[i].driverName;
			document.getElementById("cab-driver-number").value = cabNumbers1[i].driverNumber;


			document.getElementById("total-seats").innerText = "Available No. Of Seats : " + cabNumbers1[i].totalSeats;
			document.getElementById("allocated-seats").innerText = "Allocated No. Of Seats : " + cabNumbers1[i].allocatedSeats;
			document.getElementById("remaining-seats").innerText = "Remaining No. Of Seats : " + cabNumbers1[i].remainingSeats;

		}

	}


}


// empty check

function checkEmptyField() {

	var filterSource = document.getElementById("Source");
	var filterDestination = document.getElementById("Destination");
	var filterDropPoint = document.getElementById("droppoint");
	var filterTimeSlot = document.getElementById("timeslot");

	if ((filterSource.selectedIndex == 0 || filterSource.value == "Select") && (filterDestination.selectedIndex == 0 || filterDestination.value == "Select") &&
		(filterDropPoint.selectedIndex == 0 || filterDropPoint.value == "Select") && (filterTimeSlot.selectedIndex == 0 || filterTimeSlot.value == "Select")) {
		filterSource.classList.remove("style-select1");
		filterSource.style.borderColor = "red";

		filterDestination.classList.remove("style-select1");
		filterDestination.style.borderColor = "red";

		filterDropPoint.classList.remove("style-select1");
		filterDropPoint.style.borderColor = "red";

		filterTimeSlot.classList.remove("style-select1");
		filterTimeSlot.style.borderColor = "red";

		emptyErrorFilter.innerHTML = "<p style='color: red'>" +
			"Fill atleast one field to filter the records</p>";

		return false;

	}
	else {

		emptyErrorFilter.innerHTML = "";

		filterSource.classList.add("style-select1");
		filterSource.style.borderColor = "lightgrey";

		filterDestination.classList.add("style-select1");
		filterDestination.style.borderColor = "lightgrey";

		filterDropPoint.classList.add("style-select1");
		filterDropPoint.style.borderColor = "lightgrey";

		filterTimeSlot.classList.add("style-select1");
		filterTimeSlot.style.borderColor = "lightgrey";

		document.getElementById("FilterDiv").classList.remove("show");

		return true;
	}

}

// assign button clicked

var xhrAssign;

var select;


function assignButtonClicked() {

	if (document.getElementById("cab-model").selectedIndex == 0) {
		cabModelDropdownBlurFunction();

		document.getElementById("assign-btn").setAttribute("data-dismiss", "none");
		return false;
	}

	else if (document.getElementById("cab-number").selectedIndex == 0) {
		cabNumberOnBlurFunction();

		document.getElementById("assign-btn").setAttribute("data-dismiss", "none");

		return false;
	}

	else {
		document.getElementById("assign-btn").setAttribute("data-dismiss", "modal");
	}

	var cabInfoId = document.querySelector('#cab-number').value;
	var cabNum = $('#cab-number option:selected').text();
	var cabModel = document.getElementById("cab-model").value;
	var driverId = document.getElementById("cab-driver-name").name;
	
 	var driverName=document.querySelector('#cab-driver-name').value;
 	
    var driverNumber= document.querySelector("#cab-driver-number").value;
    
    var totalSeats= parseInt(document.querySelector("#total-seats").innerText.split(": ")[1]);

    var trip = {"cabInfoId":cabInfoId, "cabModel":cabModel, "cabNumber":cabNum, "driverId":driverId, "driverName":driverName,"driverNumber":driverNumber, "sourceId":selectedSrcId, "source":selectedSrc, "destinationId":selectedDestId, "destination":selectedDest,
        "dateOfTravel":travelingDate,"timeSlot":selectedTimeSlot,"totalSeats":totalSeats,"allocatedSeats":selected, "empList":selectedRequest, "requestType": request};

	var url = pathName + "/bookingInfoService/tripService/save/assignedTrip";

	xhrAssign = createHttpRequest("POST", url, true, "ADMIN");

	xhrAssign.onreadystatechange = processResponseAssigned;

	xhrAssign.setRequestHeader("Content-Type", "application/json");

	xhrAssign.send(JSON.stringify(trip));

}

function assignPickupButtonClicked(){
	
	if (document.getElementById("cab-model").selectedIndex == 0) {
		cabModelDropdownBlurFunction();

		document.getElementById("assign-btn-pickup").setAttribute("data-dismiss", "none");
		return false;
	}

	else if (document.getElementById("cab-number").selectedIndex == 0) {
		cabNumberOnBlurFunction();

		document.getElementById("assign-btn-pickup").setAttribute("data-dismiss", "none");

		return false;
	}

	else {
		document.getElementById("assign-btn-pickup").setAttribute("data-dismiss", "modal");
	}
	var cabInfoId = document.querySelector('#cab-number').value;
	var cabNum = $('#cab-number option:selected').text();
	var cabModel = document.getElementById("cab-model").value;
	var driverId = document.getElementById("cab-driver-name").name;
	
 	var driverName=document.querySelector('#cab-driver-name').value;
 	
    var driverNumber= document.querySelector("#cab-driver-number").value;
    
    var totalSeats= parseInt(document.querySelector("#total-seats").innerText.split(": ")[1]);
    
    var pickupTime = document.getElementById("pickup-time").value;
       
    var trip = {"cabInfoId":cabInfoId, "cabModel":cabModel, "cabNumber":cabNum, "driverId":driverId, "driverName":driverName,"driverNumber":driverNumber, "sourceId":selectedSrcId, "source":selectedSrc, "destinationId":selectedDestId, "destination":selectedDest,
        "dateOfTravel":travelingDate,"timeSlot":selectedTimeSlot,"totalSeats":totalSeats,"allocatedSeats":selected, "empList":selectedRequest, "requestType": request, "changedPickupTime": pickupTime == "" ? selectedTimeSlot : pickupTime};

	var url = pathName + "/bookingInfoService/tripService/save/assignedTrip";

	xhrAssign = createHttpRequest("POST", url, true, "ADMIN");

	xhrAssign.onreadystatechange = processResponseAssigned;

	xhrAssign.setRequestHeader("Content-Type", "application/json");

	xhrAssign.send(JSON.stringify(trip));
}

function processResponseAssigned() {



	if (xhrAssign.readyState == 4 && xhrAssign.status == 650) {
		var response = xhrAssign.responseText;

		$('#todays-request-popup').modal('show');

		window.reload();

		deleteRow();
		selected = 0;
		getTotalCount();
		count = count - select;


		getTotalCountOfAssignedCabs();
		document.getElementById("topCount").innerHTML = " (" + count + ")";


	}
	if (xhrAssign.readyState == 4 && xhrAssign.status == 700) {
		var response = xhrAssign.responseText;

		$('#todays-request-cancelled-popup').modal('show');
		document.getElementById("alreadyCancelled").innerText = response;
		window.reload();


		selected = 0;
	}
	selected = 0;

}

function deleteRow() {


	$('input:checked').each(function() {
		$(this).closest('tr').remove();
	});

}

//--------------------------------------------------------------------------------------------------------------------------------------------//
// Sort the table
function sortTableTodaysRequest(tdNum, orderType) {

	var rows, switching, i, x, y, shouldSwitch;
	tBody = document.getElementById("tableBody");
	switching = true;
	while (switching) {
		switching = false;
		rows = tBody.rows;
		for (i = 0; i < (rows.length) - 1; i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("td")[tdNum];
			y = rows[i + 1].getElementsByTagName("td")[tdNum];
			if (orderType == "a") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			}
			else {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
	}
}

//--------------------------------------------------------------------------------------------------------------------------------------------//
// check all OR select all

document.getElementById("flexCheckChecked").addEventListener("click", function() {

	if (document.getElementById("flexCheckChecked").checked == true) {
		var checkBoxCount = document.getElementsByName('plan');
		var i = 0;
		for (i; i < checkBoxCount.length; i++) {
			if (checkBoxCount[i].type == 'checkbox')
				checkBoxCount[i].checked = true;

		}

	}
	if (document.getElementById("flexCheckChecked").checked == false) {
		var checkBoxCount = document.getElementsByName('plan');
		var i = 0;
		for (i; i < checkBoxCount.length; i++) {
			if (checkBoxCount[i].type == 'checkbox')
				checkBoxCount[i].checked = false;

		}

	}

	selectedRecordCount();

});

function selectedRecordCount() {

	var checkBoxCount = document.getElementsByName('plan');
	var j = 0; var k = 0;
	for (k; k < checkBoxCount.length; k++) {
		if (checkBoxCount[k].type == 'checkbox' && checkBoxCount[k].checked == true) {
			j = j + 1;
		}

	}
	var selectCount = document.getElementById("selector");
	selectCount.innerHTML = j;
	if (j != 0) {
		document.getElementById("assignedToCabError").style.display = "none";
		document.getElementById("assign-to-cab-button").style.borderColor = "lightgrey";
	}
}

function releodFunction(){
	if(index <=1){
		index = 0;
		todaysRequestTabSelected();
	}
}
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === 'visible') {
		setIntervalOperation =  setInterval(
			releodFunction, 480000);
	}else{
		clearInterval(setIntervalOperation);
	}
});
