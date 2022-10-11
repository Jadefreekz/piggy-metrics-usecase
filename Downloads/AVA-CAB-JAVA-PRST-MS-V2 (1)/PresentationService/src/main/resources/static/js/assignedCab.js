var status = "Assigned";
var xhrAssigned;
var skip = 0;
var searchApplied = false;
var filterApplied = false;
var countAss;
var assignedCabPageIndex = 0;
var limit;
var xhrCountAssigned;
var errorFilter = document.getElementById("filter-empty-check");
var noRecordFound = "<h5 class= noRecordFound>No Record Found</h5>";
var todaysRequestClicked;
var assignedCabsClicked;
var manageCabsClicked;
var manageDriversClicked;
var bookingTimeSlot;

window.onload = assignedCabTab();

function  assignedCabTab()
{
	searchApplied = false;
	filterApplied = false;
	$("#cab-body").empty();
	getDestination();
	getSource();
	tabNavigatin();
	
	if(document.getElementById('assignCabsDrop').checked == true){
		getTotalCountAssigned("Drop");
	}
	else if(document.getElementById('assignCabsPickup').checked == true){
		getTotalCountAssigned("Pickup");
	}
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
function tabNavigatin(){
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

var assignedCab = document.getElementById("pills-assigned-tab");  // AssignedCab NavId
assignedCab.addEventListener('click', function() {
	location.href = "/admin/dashboard#pills-assigned";
	var radioButtonSelected = document.getElementById('assignCabsDrop');
	radioButtonSelected.checked = true;
	$("#cab-body").empty();
	getTotalCountAssigned('Drop');
});
var request;
function getTotalCountAssigned(requestType) {
try{
	request = requestType;
	
	if(request == "Pickup"){
			$(window).scrollTop(0);
			$("#cab-body").empty();
			assignedCabPageIndex =0;
			getDestination();
			var sourceLabel = document.getElementById('assignedCabSource');
			sourceLabel.innerHTML = "Destination";
			var destinationLabel = document.getElementById('assignedCabDestination');
			destinationLabel.innerHTML = "Source";
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
			
		}
		else if(request == "Drop"){
			$(window).scrollTop(0);
			$("#cab-body").empty();
			assignedCabPageIndex =0;
			getDestination();
			var sourceLabel = document.getElementById('assignedCabSource');
			sourceLabel.innerHTML = "Source";
			var destinationLabel = document.getElementById('assignedCabDestination');
			destinationLabel.innerHTML = "Destination";
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
	var xhrCountAssigned = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/recordCount/cabs/" + status+"?requestType="+request, true, "ADMIN");
	xhrCountAssigned.onreadystatechange = function() {
		if (xhrCountAssigned.readyState == 4 && xhrCountAssigned.status == 200) {
			countAss = JSON.parse(xhrCountAssigned.responseText);
			document.getElementById("topCountAssignedCabs").innerHTML = " (" + countAss + ")";
			limit = xhrCountAssigned.getResponseHeader("limit");
			if (countAss == 0) {
				var loadMoreIcon = document.getElementById('loadMoreAssigned');
				loadMoreIcon.style.display = 'none';
				document.getElementById("noRecordAssignedCab").innerHTML = noRecordFound;
				document.getElementById("cab-body").style.display="none";
		      
			}
			else {
				$("#cab-body").empty();
				document.getElementById("noRecordAssignedCab").innerHTML ="";
				document.getElementById("cab-body").style.display="table-row-group";
				getAssignedCabs(assignedCabPageIndex, request);
			}
		}
	};
	xhrCountAssigned.send(null);
	}
	catch(e){
			jsExceptionHandling(e, "assignCab.js-getTotalCountAssigned()");
	}
}

// getAssignedCab Function -->Starts
function getAssignedCabs(pgIndex, request) {
	try{
	xhrAssigned = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/cabs/" + pgIndex + "/" + status+"?requestType="+request, true, "ADMIN");
	xhrAssigned.onreadystatechange = function () {
	if (xhrAssigned.readyState == 4 && xhrAssigned.status == 200) {

		var arr = JSON.parse(xhrAssigned.responseText);
		//$("#cab-body").empty();
		displayAssignedCabs(arr);
		if ($('#cab-body tr').length == countAss) {
				var loadMoreIcon = document.getElementById('loadMoreAssigned');
				loadMoreIcon.style.display = 'none';	
			}else{
				var loadMoreIcon = document.getElementById('loadMoreAssigned');
				loadMoreIcon.style.display = 'block';	
			}
		 var countSpan = document.getElementById("count");
		 countSpan.innerHTML = $('#cab-body tr').length + " out of " + countAss;
		 document.getElementById("topCountAssignedCabs").innerHTML = " (" + countAss + ")";
	}
};
	xhrAssigned.send(null);
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-getAssignedCabs()");
	}
}

var countTr = 0;
//Function to display all AssignedCabs 
function displayAssignedCabs(arr) {
try{
	
	for (var i = 0; i < arr.length; i++) {
		
		// creating row and data
		var trow = document.createElement('tr');
		trow.className = "row-bg-style";       // addingStyle class
		trow.id = "AssignedCabs"+countTr++;
		var cabNumber = document.createElement('td');
		cabNumber.className = "spacing";
		var driverName = document.createElement('td');
		driverName.className = "spacing";
		var driverNumber = document.createElement('td');
		driverNumber.className = "spacing";
		var source = document.createElement('td');
		source.className = "spacing";
		var destination = document.createElement('td');
		destination.className = "spacing";
		var dateOfTravel = document.createElement('td');
		dateOfTravel.className = "spacing";
		var timeSlot = document.createElement('td');
		timeSlot.className = "spacing";
		var actionButton = document.createElement('td');
		actionButton.className = "spacing";
		var tripCabId = document.createElement('td');
		tripCabId.className = "spacing";
		tripCabId.style.display = "none";
		var requestType = document.createElement('td');
		requestType.className = "spacing";
		requestType.style.display = "none";

		cabNumber.innerText = arr[i].cabNumber;
		driverName.innerText = arr[i].driverName;
		driverNumber.innerText = arr[i].driverNumber;
		source.innerText = arr[i].source;
		destination.innerText = arr[i].destination;
		requestType.innerText = arr[i].requestType;

		var date = arr[i].dateOfTravel.split("\-");
		var day = date[2] + "/" + date[1] + "/" + date[0];
		dateOfTravel.innerText = day;

		var slot = timeFormatTo12Hr(arr[i].timeSlot, 0);
		timeSlot.innerHTML = slot;

		actionButton.innerHTML = "<a onclick='actionBtn(this)' title='View' class='align-img'  ><span class = 'span-color'>View Details</span></a>";
		tripCabId.innerText = arr[i].tripCabId;
		status.innerText=arr[i].status;
		trow.appendChild(cabNumber);
		trow.appendChild(driverName);
		trow.appendChild(driverNumber);
		trow.appendChild(source);
		trow.appendChild(destination);
		trow.appendChild(dateOfTravel);
		trow.appendChild(timeSlot);
		trow.appendChild(actionButton);
		trow.appendChild(tripCabId);
		trow.appendChild(requestType);
		document.getElementById("cab-body").appendChild(trow);


	}
	if(assignedCabsClicked==true){
		 var countSpan = document.getElementById("count");
		 countSpan.innerHTML = $('#cab-body tr').length + " out of " + countAss;
	
		
	}
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-displayAssignedCabs()");
	}
}

//scroll event

//window.addEventListener('scroll', () => {
//	if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
	document.getElementById("loadMoreAssigned").addEventListener('click', function(){
		//var location;
		if (location.hash == "#pills-assigned") {
			if (request == "Drop") {
				if ($('#cab-body tr').length != countAss) {

					assignedCabPageIndex++;
					if (filterApplied == false && searchApplied == false) {
						getAssignedCabs(assignedCabPageIndex, request);
					} else {
						getBySearchAndFilter(assignedCabPageIndex, request);
					}
				}
			}
			if (request == "Pickup") {
				if ($('#cab-body tr').length != countAss) {
					assignedCabPageIndex++;
					if (filterApplied == false && searchApplied == false) {
						getAssignedCabs(assignedCabPageIndex, request);
					} else {
						getBySearchAndFilter(assignedCabPageIndex, request);
					}
				}
			}
			
		}
	})
//})

document.getElementById("ScrollUp").addEventListener("click", function() {
	$(window).scrollTop(0);
});

// Sort the table
function sortTable(tdNum, type) {
try{
	var rows, switching, i, x, y, shouldSwitch;
	tBody = document.getElementById("cab-body");
	switching = true;
	while (switching) {
		switching = false;
		rows = tBody.rows;
		for (i = 0; i < (rows.length); i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("TD")[tdNum];
			y = rows[i + 1].getElementsByTagName("TD")[tdNum];
			if (type == "a") {
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
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-displayAssignedCabs()");
	}
}



var destinations;
var xhrDestination;

var timeSlotSet = new Set();
function getDestination() {
try{

	xhrDestination = createHttpRequest("GET", pathName + "/route/getAllDestination", true, "ADMIN");
	xhrDestination.onreadystatechange = function() {

		if (xhrDestination.readyState == 4 && xhrDestination.status == 200) {
			var destlist = document.getElementById("Destination");
			var length = destlist.options.length;
			for (var i = length - 1; i > 0; i--) {
				destlist.options[i] = null;
			}

			destinations = JSON.parse(xhrDestination.responseText);

			for (var i = 0; i < destinations.length; i++) {

				var des = document.createElement("option");
				des.innerHTML = destinations[i].destination;
				document.getElementById("Destination").options.add(des);
				
				if(request == 'Drop'){
					for(var j = 0; j < destinations[i].dropTimeSlot.length; j++){
						var dropSlot = destinations[i].dropTimeSlot[j].dropTimeSlot;
						var dropTimeSlotAdd = timeFormatTo12Hr(dropSlot, 0);
						timeSlotSet.add(dropTimeSlotAdd);
					}
				}else{
					for(var k = 0; k < destinations[i].pickupTimeSlot.length; k++){
						var pickupSlot = destinations[i].pickupTimeSlot[k].pickupTimeSlot;
						var pickupTimeSlotAdd = timeFormatTo12Hr(pickupSlot, 0);
						timeSlotSet.add(pickupTimeSlotAdd);
					}
				}
				
				filterTimeSlot();
			}
		}
	};
	xhrDestination.send(null);
	}catch(e){
			jsExceptionHandling(e, "assignCab.js-getDestination()");
	}
}

function filterTimeSlot() {

	try {
		
		var length = document.getElementById("timeslot").options.length;
		for (var i = length - 1; i > 0; i--) {
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


//To get Source
var xhrSource;
function getSource() {
try{

    xhrSource = createHttpRequest("GET", pathName + "/route/getSource", true, "ADMIN");
	xhrSource.onreadystatechange = function() {
		if (xhrSource.readyState == 4 && xhrSource.status == 200) {

			var sourcelist = document.getElementById("Source");
			var length = sourcelist.options.length;
			for (i = length - 1; i > 0; i--) {
				sourcelist.options[i] = null;
			}
			var arr = JSON.parse(xhrSource.responseText);

			for (var i = 0; i < arr.length; i++) {

				var op = document.createElement("option");
				op.innerHTML = arr[i];
				document.getElementById("Source").options.add(op);
			}
		}
	};
	xhrSource.send(null);
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-getSource()");
	}
}

 
//Cancel button clicked
var cancel = document.getElementById("cancelButton");  // CancelButton to get All AssignedCab
cancel.addEventListener('click', function() {

	document.getElementById("noRecordAssignedCab").innerHTML = "";
	document.getElementById("Destination").selectedIndex = 0;  // Clear the filter
	document.getElementById("Source").selectedIndex = 0;
	document.getElementById("timeslot").selectedIndex = 0;
	filterApplied = false;
	var filter = document.getElementById("filterbtn");
	filter.setAttribute('src', 'images/Vector.svg');
	$("#cab-body").empty();
	skip = 0;
	getTotalCountAssigned(request);
	errorFilter.innerHTML = "";
	document.getElementById('Source').classList.add("style-select1");
	document.getElementById('Destination').classList.add("style-select1");
	document.getElementById('timeslot').classList.add("style-select1");
});

//Search Text filled
var xhrSearch;
document.getElementById("searchTab-AssignedCabsSearch").addEventListener("keyup", function(event) {

	filterApplied  = true;
	searchApplied = true;
	skip = 0;
	assignedCabPageIndex =  0;
	$("#cab-body").empty();
	getTotalCountAssignedFilterAndSearch(request);
});

//Apply button clicked
var xhrFilterCount;
document.getElementById('ApplyButtonAssignedCabs').addEventListener('click', function() {
	emptyFieldValidation();
	skip = 0;
	assignedCabPageIndex = 0;
	filterApplied = true;
	$("#cab-body").empty();
	
});

//Get Filtered and searched count
var minute;
var splittedTimeSlotHour;

function getTotalCountAssignedFilterAndSearch(request) {
	try{
	var src;
	var dest;
	var timeSlot;
	var srchText;
	var filterBO = {};
	if (document.getElementById("Source").value != "Select Source" && document.getElementById("Source").value != "Select Destination") {
		src = document.getElementById("Source").value;
	}
	else {
		src = null;
	}
	if (document.getElementById("Destination").value != "Select Destination" && document.getElementById("Destination").value != "Select Source") {
		dest = document.getElementById("Destination").value;
	}
	else {
		dest = null;
	}
	if (document.getElementById("timeslot").value != "Select Time Slot") {
		timeSlot = document.getElementById("timeslot").value;
		var splittedTimeSlot = timeSlot.split(":");
    	minute = splittedTimeSlot[1].split(" ")[0];

    if (splittedTimeSlot[1].includes("PM")) {
        if (Number(splittedTimeSlot[0]) + 12 == 24) {
            bookingTimeSlot = "12" + ":" + minute + ":00";
        } else {
            splittedTimeSlotHour = Number(splittedTimeSlot[0]) + 12;
            bookingTimeSlot = splittedTimeSlotHour + ":" + minute+ ":00";
        }
    } else {
        seconds = splittedTimeSlot[1].split(" ");
        if (Number(splittedTimeSlot[0]) == 12) {
            bookingTimeSlot = "00" + ":" + minute+ ":00";
        } else if (Number(splittedTimeSlot[0]) < 10) {
            bookingTimeSlot = "0" + Number(splittedTimeSlot[0]) + ":" + minute+ ":00";
        } else {
            bookingTimeSlot = Number(splittedTimeSlot[0]) + ":" + minute+ ":00";
        }
    }     
	}
	else {
		timeSlot = null;
	}
	if (document.getElementById("searchTab-AssignedCabsSearch").value != "") {
		srchText = document.getElementById("searchTab-AssignedCabsSearch").value.trim();
	}
	else {
		srchText = null;
	}
	filterBO = { "source": src, "destination": dest, "timeSlot": bookingTimeSlot, "searchText": srchText };

	xhrFilterCount = createHttpRequest("POST", pathName + "/bookingInfoService/tripService/recordCount/filterAndTextSearch/cabs/" + status+"?requestType="+request, true, "ADMIN");
	xhrFilterCount.onreadystatechange = function processResponseCountAssFilter() {
		
		if (xhrFilterCount.readyState == 4 && xhrFilterCount.status == 200) {
			countAss = JSON.parse(xhrFilterCount.responseText);
			if (countAss == 0) {
				var loadMoreIcon = document.getElementById('loadMoreAssigned');
				loadMoreIcon.style.display = 'none';
				document.getElementById("noRecordAssignedCab").innerHTML = noRecordFound;
				document.getElementById("cab-body").style.display="none";
				
		        var countSpan = document.getElementById("count");
		        countSpan.innerHTML = $('#cab-body tr').length + " out of " + countAss;
		        document.getElementById("topCountAssignedCabs").innerHTML = " (" + countAss + ")";
			}
			else {
				document.getElementById("cab-body").style.display="table-row-group";
				document.getElementById("noRecordAssignedCab").innerHTML = "";
				$("#cab-body").empty();
				getBySearchAndFilter(assignedCabPageIndex, request);
			}
		}
	};
	xhrFilterCount.setRequestHeader("Content-Type", "application/json");
	filterCount = xhrFilterCount.send(JSON.stringify(filterBO));
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-getTotalCountAssignedFilterAndSearch()");
	}
}


function getBySearchAndFilter(pgIndex, request) {
try{
	filterApplied = false;
	searchApplied = true;
	skip = 0;
	var src;
	var dest;
	var timeSlot;
	var srchText;
	var filterBO = {};
	if (document.getElementById("Source").value != "Select Source" && document.getElementById("Source").value != "Select Destination") {
		src = document.getElementById("Source").value;
	}
	else {
		src = null;
	}
	if (document.getElementById("Destination").value != "Select Destination" && document.getElementById("Destination").value != "Select Source") {
		dest = document.getElementById("Destination").value;
	}
	else {
		dest = null;
	}
	if (document.getElementById("timeslot").value != "Select Time Slot") {
		timeSlot = document.getElementById("timeslot").value;
		var splittedTimeSlot = timeSlot.split(":");
    	 minute = splittedTimeSlot[1].split(" ")[0];

    if (splittedTimeSlot[1].includes("PM")) {
        if (Number(splittedTimeSlot[0]) + 12 == 24) {
            bookingTimeSlot = "12" + ":" + minute + ":00";
        } else {
            splittedTimeSlotHour = Number(splittedTimeSlot[0]) + 12;
            bookingTimeSlot = splittedTimeSlotHour + ":" + minute+ ":00";
        }
    } else {
        seconds = splittedTimeSlot[1].split(" ");
        if (Number(splittedTimeSlot[0]) == 12) {
            bookingTimeSlot = "00" + ":" + minute+ ":00";
        } else if (Number(splittedTimeSlot[0]) < 10) {
            bookingTimeSlot = "0" + Number(splittedTimeSlot[0]) + ":" + minute+ ":00";
        } else {
            bookingTimeSlot = Number(splittedTimeSlot[0]) + ":" + minute+ ":00";
        }
    }     
	}
	else {
		timeSlot = null;
	}
	if (document.getElementById("searchTab-AssignedCabsSearch").value != "") {
		srchText = document.getElementById("searchTab-AssignedCabsSearch").value.trim();
	}
	else {
		srchText = null;
	}
	filterBO = { "source": src, "destination": dest, "timeSlot": bookingTimeSlot, "searchText": srchText };
	xhrSearch = createHttpRequest("POST", pathName + "/bookingInfoService/tripService/filterAndTextSearch/cabs/" + pgIndex + "/" + status+"?requestType="+request, true, "ADMIN");
	xhrSearch.setRequestHeader("Content-Type", "application/json");
	xhrSearch.send(JSON.stringify(filterBO));
	xhrSearch.onreadystatechange = function(event) {
		event.preventDefault();
		
		if (xhrSearch.readyState == 4 && xhrSearch.status == 200) {
			var arr = JSON.parse(xhrSearch.responseText);
			displayAssignedCabs(arr);
			if ($('#cab-body tr').length == countAss) {
				var loadMoreIcon = document.getElementById('loadMoreAssigned');
				loadMoreIcon.style.display = 'none';	
			}else{
				var loadMoreIcon = document.getElementById('loadMoreAssigned');
				loadMoreIcon.style.display = 'block';	
			}
		    var countSpan = document.getElementById("count");
		    countSpan.innerHTML = $('#cab-body tr').length + " out of " + countAss;
		    document.getElementById("topCountAssignedCabs").innerHTML = " (" + countAss + ")";
		}
	};
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-getBySearchAndFilter()");
	}
}

// Action button clicked
function actionBtn(obj) {
	try{
	var tr = obj.closest("tr").id;
	var action = document.getElementById(tr).cells[8].innerText;
	if(request == "Drop"){
			window.location.href = "/admin/tripsheet?tripcabId=" + action;

	}else{
			window.location.href = "/admin/tripsheet-pickup?tripcabId=" + action;
	}
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-actionBtn()");
	}
}

//Empty check validation for filter
function emptyFieldValidation() {
	try{
	var destination = document.getElementById('Destination').value;
	var source = document.getElementById('Source').value;
	var timeSlot = document.getElementById('timeslot').value;

	if ((destination == "Select Destination" || destination == "Select Source") && (source == "Select Source" || source == "Select Destination") && timeSlot == "Select Time Slot") {

		document.getElementById('Source').classList.remove("style-select1");
		document.getElementById('Source').style.borderColor = "red";
		document.getElementById('Destination').classList.remove("style-select1");
		document.getElementById('Destination').style.borderColor = "red";
		document.getElementById('timeslot').classList.remove("style-select1");
		document.getElementById('timeslot').style.borderColor = "red";

		errorFilter.innerHTML = "<p style='color: red'>" +
			"Fill atleast one field to filter the records</p>";
			$('.advanced-filter').addClass('show');
		return false;
	}

	else {
		$("#cab-body").empty();

		errorFilter.innerHTML = "";
		document.getElementById('Destination').style.borderColor = "lightgrey";
		document.getElementById('Source').style.borderColor = "lightgrey";
		document.getElementById('timeslot').style.borderColor = "lightgrey";
		document.getElementById("filter-search-assignToCab").classList.remove("show");
		$('.advanced-filter').removeClass('show');
	}
	getTotalCountAssignedFilterAndSearch(request);
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-emptyFieldValidation()");
	}
}

//Close button clicked in the filter
function filterClearButton() {
	try{
	errorFilter.innerHTML = "";
	document.getElementById('Source').classList.add("style-select1");
	document.getElementById('Destination').classList.add("style-select1");
	document.getElementById('timeslot').classList.add("style-select1");
	}catch(e){
		jsExceptionHandling(e, "assignCab.js-filterClearButton()");
	}
}
