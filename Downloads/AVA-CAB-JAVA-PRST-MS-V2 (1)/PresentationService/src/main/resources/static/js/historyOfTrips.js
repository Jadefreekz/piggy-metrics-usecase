var status = "Completed";
var index = 0;
var searchApplied = false;
var filterApplied = false;
var xhrCountAss;
var countAss;
var pages;
var limit;
var errorFilter = document.getElementById("empty-check");
var noRecordFound = "<h5 class= 'noRecordFound'>No Record Found</h5>";
var xhr;
var xhrFilterSearchCount;
var xhrFilterSearchDetails;
var xhrGetSuggestionDetailsInExcelFormat;
var obj;
var filterBO = {};
var formatDate;
	var cabNum;
	var from;
	var to;
	var search;
var requestTypeSet = new Set();
window.onload = getTotalCount();

function getTotalCount() {
try{
	xhrCountAss = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/recordCount/cabs/" + status, true, "ADMIN");
	xhrCountAss.onreadystatechange = function() {
		if (xhrCountAss.readyState == 4 && xhrCountAss.status == 200) {
			countAss = JSON.parse(xhrCountAss.responseText);

			if (countAss == 0) {
				document.getElementById("noRecordHistory").innerHTML = noRecordFound;
				
			} else {
				document.getElementById("noRecordHistory").innerHTML = "";
				limit = xhrCountAss.getResponseHeader("limit");
				pages = Math.ceil(countAss / limit);
				createPagination(pages, 1);
				
				
			}
		}
	};
	xhrCountAss.send(null);
	}catch(e){
		jsExceptionHandling(e, "historyOfTrips.js-getTotalCount()");
	}

}
var counter = 0;

function getTripSheet(index) {
	try{
	filter = false;
	xhr = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/cabs/" + index + "/" + status, true, "ADMIN");
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200) {

			var arr = JSON.parse(this.responseText);
			displayCompletedTrips(arr);
			var countSpan = document.getElementById("totalrecord");
		countSpan.innerHTML = "#Records: "+ $('#cab-body tr').length + " out of " + countAss;
		}
	};
	xhr.send(null);
	}catch(e){
		jsExceptionHandling(e, "historyOfTrips.js-getTripSheet()");
	}

}

var countTr = 0;
function displayCompletedTrips(data) {
	try{
	document.getElementById("cab-body").innerHTML = "";
	var tbody = document.getElementById("cab-body");

	var rowLength = data.length;
	for (var i = 0; i < rowLength; i++) {

		// creating row and data
		var trow = document.createElement('tr');
		trow.className = "row-bg-style";       // addingStyle class
		trow.id = "History"+countTr++;
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
		var request = document.createElement('td');
		request.className = "spacing";
		requestTypeSet.add(data[i].requestType);
		var dateOfTravel = document.createElement('td');
		dateOfTravel.className = "spacing";
		var timeSlot = document.createElement('td');
		timeSlot.className = "spacing";
		var actionButton = document.createElement('td');
		actionButton.className = "spacing";
		var tripCabId = document.createElement('td');
		tripCabId.className = "spacing";
		tripCabId.style.display = "none";
		var status = document.createElement('td');
		status.className = "spacing";
		status.style.display = "none";
	
		cabNumber.innerText = data[i].cabNumber;
		driverName.innerText = data[i].driverName;
		driverNumber.innerText = data[i].driverNumber;
		source.innerText = data[i].source;
		destination.innerText = data[i].destination;
		request.innerText = data[i].requestType;
		var date = data[i].dateOfTravel.split("\-");
		var day = date[2] + "/" + date[1] + "/" + date[0];
		dateOfTravel.innerText = day;

		var slot = timeFormatTo12Hr(data[i].timeSlot, 0);
		timeSlot.innerHTML = slot;
		status.innerText = data[i].status;
		if (status.innerText == "Cancelled") {

		} else {
			actionButton.innerHTML = "<a onclick='actionBtn(this)' title='View' class='align-img'  ><span class = 'span-color' onclick = 'actionButtonClicked(this)'>View Details</span></a>";
		}
		tripCabId.innerText = data[i].tripCabId;

		trow.appendChild(cabNumber);
		trow.appendChild(driverName);
		trow.appendChild(driverNumber);
		trow.appendChild(source);
		trow.appendChild(destination);
		trow.appendChild(request);
		trow.appendChild(dateOfTravel);
		trow.appendChild(timeSlot);
		trow.appendChild(actionButton);
		trow.appendChild(tripCabId);
		document.getElementById("cab-body").appendChild(trow);
		
		
	}

		}catch(e){
			jsExceptionHandling(e, "historyOfTrips.js-displayCompletedTrips()");
		}
}

function actionBtn(obj) {
try{
	var action = obj.closest("tr").cells[9].innerText;
	var requestType = obj.closest("tr").cells[5].innerText;
	window.location.href = "/admin/history/trip?tripCabId=" + action;
	}catch(e){
		jsExceptionHandling(e, "historyOfTrips.js-actionBtn()");
	}
}

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
			} else {
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
			jsExceptionHandling(e, "historyOfTrips.js-sortTable()");
	}
}

//Search applied
document.getElementById('searchText').addEventListener('keyup', function(event) {
	skip = 0;
	filterApplied = true;
	searchApplied = true;
	$('#table-body').empty();

	getHistoryOfTripsCountByFilterAndSearch();
});

// Filter applied
document.getElementById('applyButton').addEventListener('click', function() {
	skip = 0;
	filterApplied = true;

	$('#table-body').empty();
	emptyFieldValidation();
	
});
var filteredRequest;
function getHistoryOfTripsCountByFilterAndSearch() {
try{
	var cabNum;
	var from;
	var to;
	var search;
	var formatDate;
	
	var filterBO = {};

	if (document.getElementById("cabnum").value != "") {
		cabNum = document.getElementById('cabnum').value;
	} else {
		cabNum = null;
	}
	if (document.getElementById("type").value != "" && document.getElementById("type").value != undefined && document.getElementById("type").selectedIndex != 0
	&& document.getElementById("type").value != "Select") {
		filteredRequest = document.getElementById('type').value;
	} else {
		filteredRequest = null;
	}
	if (document.getElementById("fromDate").value != "") {
		from = document.getElementById('fromDate').value + "T00:00:00";
	} else {
		from = null;
	}
	if (document.getElementById("toDate").value != "") {
		to = document.getElementById('toDate').value;
	} else {
		to = null;
	}
	if (document.getElementById("searchText").value != "") {
		search = document.getElementById('searchText').value.trim();
	} else {
		search = null;
	}
	filterBO = { "cabNumber": cabNum, "from": from, "to": to, "searchText": search, "requestType":filteredRequest };

	xhrFilterSearchCount = createHttpRequest("POST", pathName + "/bookingInfoService/tripService/recordCount/filterAndTextSearch/cabs/" + status, true, "ADMIN");
	xhrFilterSearchCount.setRequestHeader("Content-Type", "application/json");
	xhrFilterSearchCount.send(JSON.stringify(filterBO));
	xhrFilterSearchCount.onreadystatechange = function() {

		if (xhrFilterSearchCount.readyState == 4 && xhrFilterSearchCount.status == 200) {

			obj = JSON.parse(xhrFilterSearchCount.responseText);
			pages = Math.ceil(obj / limit);

			if (obj == 0) {
				document.getElementById("noRecordHistory").innerHTML = noRecordFound;
				document.getElementById("cab-body").style.display = "none";
				createPagination(pages, 1);

			} else {
				 
               document.getElementById("noRecordHistory").innerHTML = "";
			   document.getElementById("cab-body").style.display = "table-row-group";
			   createPagination(pages, 1);
			}
		}
	};
	}catch(e){
		jsExceptionHandling(e, "historyOfTrips.js-getHistoryOfTripsCountByFilterAndSearch()");
	}
}

function getHistoryOfTripsByFilterAndSearch(index) {
try{
	filterApplied = true;
	searchApplied = true;
	skip = 0;
	var filterBtn = document.getElementById('applyButton');

	filterBtn.setAttribute('src', 'images/VectorFilter.svg');


	if (document.getElementById("cabnum").value != "") {
		cabNum = document.getElementById('cabnum').value;
	} else {
		cabNum = null;
	}
	if (document.getElementById("type").value != "" && document.getElementById("type").value != undefined && document.getElementById("type").selectedIndex != 0
	&& document.getElementById("type").value != "Select") {
		filteredRequest = document.getElementById('type').value;
	} else {
		filteredRequest = null;
	}
	if (document.getElementById("fromDate").value != "") {
		from = document.getElementById('fromDate').value + "T00:00:00";
	} else {
		from = null;
	}

	if (document.getElementById("toDate").value != "") {

		to = document.getElementById('toDate').value;
	} else {

		to = null;
	}
	if (document.getElementById("searchText").value != "") {

		search = document.getElementById('searchText').value.trim();

	} else {
		search = null;
	}

	filterBO = { "cabNumber": cabNum, "from": from, "to": to, "searchText": search, "requestType":filteredRequest};
	xhrFilterSearchDetails = createHttpRequest("POST", pathName + "/bookingInfoService/tripService/filterAndTextSearch/cabs/" + index + "/" + status, true, "ADMIN");
	xhrFilterSearchDetails.setRequestHeader("Content-Type", "application/json");
	xhrFilterSearchDetails.send(JSON.stringify(filterBO));
	xhrFilterSearchDetails.onreadystatechange =
		function() {

			if (xhrFilterSearchDetails.readyState == 4 && xhrFilterSearchDetails.status == 200) {

				var arr = JSON.parse(xhrFilterSearchDetails.responseText);

				displayCompletedTrips(arr);
				var countSpan = document.getElementById("totalrecord");
		countSpan.innerHTML = $('#cab-body tr').length + " records out of " + obj;
			}

		};
		}catch(e){
			jsExceptionHandling(e, "historyOfTrips.js-getHistoryOfTripsByFilterAndSearch()");
		}
}

// CLose button clicked
document.getElementById('close').addEventListener('click', clear);
function clear() {
	try{
	document.getElementById("filter").classList.remove("show");

	errorFilter.innerHTML = "";
	document.getElementById('cabnum').classList.add("border-filter-style1");
	document.getElementById('cabnum').style.borderColor = "lightgrey";
	document.getElementById('type').classList.add("border-filter-style1");
	document.getElementById('type').style.borderColor = "lightgrey";
	document.getElementById('fromDate').classList.add("border-filter-style1");
	document.getElementById('fromDate').style.borderColor = "lightgrey";
	document.getElementById('toDate').classList.add("border-filter-style1");
	document.getElementById('toDate').style.borderColor = "lightgrey";
	}catch(e){
		jsExceptionHandling(e, "historyOfTrips.js-clear()");
	}
}

//Cancel button clicked
var cancel = document.getElementById("cancelButton");  // CancelButton to get All AssignedCab
cancel.addEventListener('click', function() {
	document.getElementById("filter").classList.remove("show");
	document.getElementById('cab-body').style.display = "table-row-group";
	document.getElementById("cabnum").value = "";  // Clear the filter
	document.getElementById("fromDate").value = "";
	document.getElementById("toDate").value = "";
	errorFilter.innerHTML = "";
	document.getElementById('cabnum').classList.add("border-filter-style1");
	document.getElementById('cabnum').style.borderColor = "lightgrey";
	document.getElementById('type').classList.add("border-filter-style1");
	document.getElementById('type').style.borderColor = "lightgrey";
	document.getElementById('fromDate').classList.add("border-filter-style1");
	document.getElementById('fromDate').style.borderColor = "lightgrey";
	document.getElementById('toDate').classList.add("border-filter-style1");
	document.getElementById('toDate').style.borderColor = "lightgrey";
	filterApplied = false;
	skip = 0;
	getTotalCount();
});

//Empty check validation for filter
function emptyFieldValidation() {
	try{
	var cabNum = document.getElementById('cabnum').value;
	var from = document.getElementById('fromDate').value;
	var to = document.getElementById('toDate').value;
	var requestType = document.getElementById("type");

	if (cabNum == "" && from == "" && to == ""&&(requestType.selectedIndex ==0 || requestType.value=="Select")) {

		document.getElementById('cabnum').classList.remove("border-filter-style1");
		document.getElementById('cabnum').style.borderColor = "red";
		document.getElementById('type').classList.remove("border-filter-style1");
		document.getElementById('type').style.borderColor = "red";
		document.getElementById('fromDate').classList.remove("border-filter-style1");
		document.getElementById('fromDate').style.borderColor = "red";
		document.getElementById('toDate').classList.remove("border-filter-style1");
		document.getElementById('toDate').style.borderColor = "red";

		errorFilter.innerHTML = "<p style='color: red'>" +
			"Fill atleast one field to filter the records</p>";

		return false;
	}

	else {

		errorFilter.innerHTML = "";
		document.getElementById('cabnum').style.borderColor = "lightgrey";
		document.getElementById('type').style.borderColor = "lightgrey";
		document.getElementById('fromDate').style.borderColor = "lightgrey";
		document.getElementById('toDate').style.borderColor = "lightgrey";

		document.getElementById("advFilter").classList.remove("show");

		$('.advanced-filter').removeClass('show');
	}
	getHistoryOfTripsCountByFilterAndSearch();
	}catch(e){
		jsExceptionHandling(e, "historyOfTrips.js-emptyFieldValidation()");
	}
}



//Export to Excel
function exportToExcel() {

var excel;
try{
	
	if((searchApplied && filterApplied) || (searchApplied) || (filterApplied)){
		filterBO = { "cabNumber": cabNum, "from": from, "to": to, "searchText": search };
		xhrGetSuggestionDetailsInExcelFormat = createHttpRequest("POST", pathName + "/bookingInfoService/tripService/exportFilteredTrips/"+status, true, "ADMIN");
		xhrGetSuggestionDetailsInExcelFormat.setRequestHeader("content-Type","application/json")
		xhrGetSuggestionDetailsInExcelFormat.send(JSON.stringify(filterBO));
		xhrGetSuggestionDetailsInExcelFormat.onreadystatechange = function(){
			
		if (xhrGetSuggestionDetailsInExcelFormat.readyState == 4 && xhrGetSuggestionDetailsInExcelFormat.status == 200){
			excel = xhrGetSuggestionDetailsInExcelFormat.responseText;
	
			const csvBlob=new Blob([excel],{type:"text/csv"});
			const blobURL=URL.createObjectURL(csvBlob);
			const anchorElement=document.createElement('a');
			anchorElement.href=blobURL;
			anchorElement.download="TripHistory-" +(new Date().toLocaleDateString())+".csv";
			anchorElement.click();
		}
		}

	}
	else{
	xhrGetSuggestionDetailsInExcelFormat = createHttpRequest("GET", pathName + "/bookingInfoService/tripService/export/excel/", true, "ADMIN");
	xhrGetSuggestionDetailsInExcelFormat.onreadystatechange = function() {
		if (xhrGetSuggestionDetailsInExcelFormat.readyState == 4 && xhrGetSuggestionDetailsInExcelFormat.status == 200) {
			
			excel = xhrGetSuggestionDetailsInExcelFormat.responseText;
			
			const csvBlob=new Blob([excel],{type:"text/csv"});
			const blobURL=URL.createObjectURL(csvBlob);
			const anchorElement=document.createElement('a');
			anchorElement.href=blobURL;
			anchorElement.download="TripHistory-" +(new Date().toLocaleDateString())+".csv";
			anchorElement.click();

		}
	}
	xhrGetSuggestionDetailsInExcelFormat.send();
	}
	}catch(e){
			jsExceptionHandling(e, "historyOfTrips.js-exportToExcel()");
	}
}

function filterRequestType(){
	
	var requestTypeList = document.getElementById("type");
	var typeLength = requestTypeList.options.length;
	
	for (i = typeLength - 1; i > 0; i--) {
        // To avoid the selected values repeatation
        requestTypeList.options[i] = null;
    } 
    const requestTypeIterator = requestTypeSet.values();

    for (var j = 0; j < requestTypeSet.size; j++) {
        var filterRequest = document.createElement("option");
        filterRequest.innerText = requestTypeIterator.next().value;
        document.getElementById("type").options.add(filterRequest);
    }
}


