var xhrComplaintsCount;
var xhrComplaintsDetails;
var xhrFilterSearchCount;
var limit;
var pages;
window.onload = Complaint();
var dropPointSet = new Set();
var timeSlotSet = new Set();
var destXhr;
var objCount;
var filterBO = {};
var destination;
var dropPoint;
var timeSlot;
var source;
var search;
var index = 0;
var filterBo;

var noRecordFound = "<h5 class=noRecordsFound>No Records Found </h5>";
//On reload to get the count, list of source and list of destination from the db
function Complaint() {
	try {
		getComplaintsCount();
		getAllSource();
		getAllDestination();
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-Complaint()");
	}
}

//To get the int count 
function getComplaintsCount() {
	try {

		xhrComplaintsCount = createHttpRequest("GET", pathName + "/complaints/complaintsCount", true, "ADMIN");
		xhrComplaintsCount.onreadystatechange = getTotalNoOfRecords;
		xhrComplaintsCount.send();
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getComplaintsCount()");
	}
}
var count;
function getTotalNoOfRecords() {

	try {

		if (xhrComplaintsCount.readyState == 4 && xhrComplaintsCount.status == 200) {

			limit = xhrComplaintsCount.getResponseHeader("limit");
			count = JSON.parse(xhrComplaintsCount.responseText);

			pages = Math.ceil(count / limit);//To get the pageLimit

			if (pages == 0) {//If pagelimit ==0
				document.getElementById("noValueFound").innerHTML = noRecordFound;
			}
			else {
				createPagination(pages, 1);//else reaches pagination
			}

		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getTotalNoOfRecords()");
	}
}
var obj;

function getUserComplaints(pageIndex) {//To get the list of complaints 

	try {
		xhrComplaintsDetails = createHttpRequest("GET", pathName + "/complaints/complaintspageIndexCount/" + pageIndex, true, "ADMIN");
		xhrComplaintsDetails.onreadystatechange = function() {

			if (xhrComplaintsDetails.readyState == 4 && xhrComplaintsDetails.status == 200) {
				obj = JSON.parse(xhrComplaintsDetails.responseText);
				dynamicPageCreation(obj);

				var countSpan = document.getElementById("count");
				countSpan.innerHTML = "#Records  :" + $('#table-body tr').length + " out of " + count;
				document.getElementById("record").appendChild(countSpan);
			}
		}
		xhrComplaintsDetails.send();
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getUserComplaints()");
	}
}
function createPagination(pages, pageIndex) {
	try {

		if (filterApplied == true) {//If filteration is applied get the filter pageInded
			getFilterRequest(filterBo, pageIndex - 1);
		}
		else {                         //else goes to getAllComplaints pageIndex count
			getUserComplaints(pageIndex - 1);        //Calls the method getUserComplaints details. When index 1 is clicked, then performs index-1 = 0 and loads the first set of records

		}


		let str = '<ul class = "ul-tag">';

		let active;
		let previousButton = pageIndex - 1;
		let nextButton = pageIndex + 1;


		if (pageIndex > 1) {        //When index is > 1 then, shows the previous arrow

			str += '<li class="page-item " ><a class="page-link pagination-border" onclick="createPagination(pages, ' + (pageIndex - 1) + ')"><img src="images/pagination-prev-arrow.svg"  /></a></li>';



		}
		if (pages < 6) {             //Sets the active page and increments the pages based on the total records and limit
			for (let p = 1; p <= pages; p++) {
				active = pageIndex == p ? "active" : "no";
				str += '<li class="' + active + '" ><a class="page-link pagination-border a-tag" onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
			}
		}

		else {
			if (pageIndex > 2) {         //Sets 1 as active 
				str += '<li class="page-item "><a class="page-link pagination-border" onclick="createPagination(pages, 1)">1</a></li>';
				if (pageIndex > 3) {
					str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (pageIndex - 2) + ')">...</a></li>';
				}
			}


			if (pageIndex === 1) {         //Conditions for where the ... should be displayed before the next
				nextButton += 2;
			} else if (pageIndex === 2) {        //Conditions for where the ... should be displayed after the previous
				nextButton += 1;
			}

			if (pageIndex === pages) {
				previousButton -= 2;
			} else if (pageIndex === pages - 1) {
				previousButton -= 1;
			}

			for (let p = previousButton; p <= nextButton; p++) {
				if (p === 0) {
					p += 1;
				}
				if (p > pages) {
					continue
				}
				active = pageIndex == p ? "active" : "no";
				str += '<li class="page-item  ' + active + '"><a class="page-link pagination-border" onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
			}

			if (pageIndex < pages - 1) {
				if (pageIndex < pages - 2) {
					str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (pageIndex + 2) + ')">...</a></li>';
				}
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, pages)">' + pages + '</a></li>';
			}
		}
		if (pageIndex < pages) {
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, ' + (pageIndex + 1) + ')"><img src="images/pagination-next-arrow.svg" alt="page-arrow"  /></a></li>';
		}
		str += '</ul>';

		document.getElementById('complaintPagination').innerHTML = str;
		return str;
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-createPagination()");
	}

}

//To get the list of source in the filters
function getAllSource() {
	try {
		var sourceXhr;

		sourceXhr = createHttpRequest("GET", pathName + "/route/getSource", true, "ADMIN");
		sourceXhr.send();
		sourceXhr.onreadystatechange = function() {



			if (sourceXhr.readyState == 4 && sourceXhr.status == 200) {

				var sources = JSON.parse(this.responseText);

				var clearSource = document.getElementById("Source");
				var srcLength = clearSource.options.length;

				for (i = srcLength - 1; i > 0; i--) {
					clearSource.options[i] = null;
				}



				for (var i = 0; i < sources.length; i++) {



					var opt = document.createElement("option");




					opt.innerHTML = sources[i].source;



					document.getElementById("Source").options.add(opt);



				}

			}


		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getAllSource()");
	}
}


//To get the list of destination in the filteration
var destinations;

function getAllDestination() {

	//destXhr;
	try {
		destXhr = createHttpRequest("GET", pathName + "/route/getAllDestination", true, "ADMIN");
		destXhr.send(null);
		destXhr.onreadystatechange = function() {


			if (destXhr.readyState == 4 && destXhr.status == 200) {

				destinations = JSON.parse(this.responseText);

				var clearDest = document.getElementById("Destination");
				var destLength = clearDest.options.length;

				for (i = destLength - 1; i > 0; i--) {
					clearDest.options[i] = null;
				}
				for (var i = 0; i < destinations.length; i++) {

					var opt = document.createElement("option");

					opt.innerHTML = destinations[i].destination;
					document.getElementById("Destination").options.add(opt);

					for (var j = 0; j < destinations[i].pickupTimeSlot.length; j++) {

						var getAllDestinations = destinations[i].pickupTimeSlot[j].pickupTimeSlot;
						var timeSlotAdd = timeFormatTo12Hr(getAllDestinations, 0);
						timeSlotSet.add(timeSlotAdd);

					}
					for (var j = 0; j < destinations[i].dropTimeSlot.length; j++) {

						var getAllDestinations = destinations[i].dropTimeSlot[j].dropTimeSlot;
						var timeSlotAdd = timeFormatTo12Hr(getAllDestinations, 0);
						timeSlotSet.add(timeSlotAdd);

					}
					for (var j = 0; j < destinations[i].dropPoints.length; j++) {

						dropPointSet.add(destinations[i].dropPoints[j].dropPoint);
					}

				}
			}

			filterDropPointSet();
			filterTimeSlot();
		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getAllDestination()");
	}
}


//To get the list of timeSlot from the db in the filteration 
function filterTimeSlot() {
	try {
		const timeSlotIterator = timeSlotSet.values();



		for (var j = 0; j < timeSlotSet.size; j++) {
			var filtertimeSlot = document.createElement("option");
			filtertimeSlot.innerText = timeSlotIterator.next().value;
			document.getElementById("Timeslot").options.add(filtertimeSlot);
		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-filterTimeSlot()");
	}
}

//To get the list of dropPoint from the db in the fileration
function filterDropPointSet() {
	try {

		const dropPointIterator = dropPointSet.values();



		for (var j = 0; j < dropPointSet.size; j++) {
			var filterDropPoint = document.createElement("option");
			filterDropPoint.innerText = dropPointIterator.next().value;
			document.getElementById("Droppoint").options.add(filterDropPoint);
		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-filterDropPointSet()");
	}

}




function OnClickOfDestination() {
	try {
		var selectedDestination = document.querySelector('#Destination').value;//On click of destination 

		if (destXhr.readyState == 4 && destXhr.status == 200) {

			var length1 = document.getElementById('Timeslot').options.length;//To get the timeSlot based on destination filters
			for (var i = length1 - 1; i > 0; i--) {
				document.getElementById("Timeslot").options[i] = null;
			}

			timeSlotSet.clear();

			var length2 = document.getElementById('Droppoint').options.length;//To get the dropPoint based on destination filters
			for (var i = length2 - 1; i > 0; i--) {
				document.getElementById("Droppoint").options[i] = null;
			}



			var destinations = JSON.parse(destXhr.responseText);





			for (var i = 0; i < destinations.length; i++) {
				if (destinations[i].destination == selectedDestination) {

					for (var j = 0; j < destinations[i].pickupTimeSlot.length; j++) {

						var getAllDestinations = destinations[i].pickupTimeSlot[j].pickupTimeSlot;
						var timeSlotAdd = timeFormatTo12Hr(getAllDestinations, 0);
						timeSlotSet.add(timeSlotAdd);

					}
					for (var j = 0; j < destinations[i].dropTimeSlot.length; j++) {

						var getAllDestinations = destinations[i].dropTimeSlot[j].dropTimeSlot;
						var timeSlotAdd = timeFormatTo12Hr(getAllDestinations, 0);
						timeSlotSet.add(timeSlotAdd);

					}

					filterTimeSlot();

					for (var j = 0; j < destinations[i].dropPoints.length; j++) {

						var opt = document.createElement("option");
						opt.innerHTML = destinations[i].dropPoints[j].dropPoint;

						document.getElementById("Droppoint").appendChild(opt);//Append the dropPoint values in the filters
					}
					
					return;
				}
			}
		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-OnClickOfDestination()");
	}

}

//Search starts here
var searchApplied = false;
var filterApplied = false;
var skip = 0;

document.getElementById("searchtab").addEventListener('keyup', function(event) {


	var filter = document.getElementById('ApplyButton');
	filter.setAttribute('src', 'images/VectorFilter.svg');
	filterApplied = true;
	skip = 0;
	$('#table-body').empty();
	getFilteredRequestCount(filterBO);



})
//filters starts here
document.getElementById('ApplyButton').addEventListener('click', function() {

	skip = 0;
	filterApplied = true;

	checkEmptyFields();


});

//To check empty fields//
var errorFilter = document.getElementById("empty-check");

function checkEmptyFields() {

	try {
		var source = document.getElementById('Source');
		var destination = document.getElementById('Destination');
		var dropPoint = document.getElementById('Droppoint');
		var timeSlot = document.getElementById('Timeslot');



		if (source.value == 0 && destination.value == 0 && dropPoint.value == "Select Drop Point" && timeSlot.value == 0) {
			source.classList.remove("style-select1");
			source.style.borderColor = "red";
			destination.classList.remove("style-select1");
			destination.style.borderColor = "red";
			dropPoint.classList.remove("style-select1");
			dropPoint.style.borderColor = "red";
			timeSlot.classList.remove("style-select1");
			timeSlot.style.borderColor = "red";
			document.getElementById("filterShow").classList.add("show");
            
			errorFilter.innerHTML = "<p style='color: red'>" +
				"Fill atleast one field to filter the records</p>";
			return false;
		}
		else {
			errorFilter.innerHTML = "";
			source.classList.remove("style-select1");
			source.style.borderColor = "lightgrey";
			destination.classList.remove("style-select1");
			destination.style.borderColor = "lightgrey";
			dropPoint.classList.remove("style-select1");
			dropPoint.style.borderColor = "lightgrey";
			timeSlot.classList.remove("style-select1");
			timeSlot.style.borderColor = "lightgrey";
			document.getElementById("filterShow").classList.remove("show");
			getFilteredRequestCount(filterBO);

		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-checkEmptyFields()");
	}
}

//To get the record count on filter and search//

function getFilteredRequestCount(filterBO) {

	try {
		if (document.getElementById("Source").value == "" || document.getElementById("Source").value == 0 || document.getElementById("Source").selectedIndex == 0) {
			source = null;
		}
		else {
			source = document.getElementById('Source').value;
		}
		if (document.getElementById("Destination").value == "" || document.getElementById("Destination").value == 0 || document.getElementById("Destination").selectedIndex == 0) {
			destination = null;
		}
		else {
			destination = document.getElementById('Destination').value;
		}
		if (document.getElementById("Droppoint").value == "" || document.getElementById("Droppoint").value == 0 || document.getElementById("Droppoint").selectedIndex == 0) {
			dropPoint = null;
		}
		else {
			dropPoint = document.getElementById('Droppoint').value;
		}
		if (document.getElementById("Timeslot").value == "" || document.getElementById("Timeslot").value == 0 || document.getElementById("Timeslot").selectedIndex == 0) {
			bookingTimeSlot = null;
		}
		else {
			timeSlot = document.getElementById('Timeslot').value;

			var splittedTimeSlot = timeSlot.split(":");
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
		if (document.getElementById("searchtab").value == "" || document.getElementById("searchtab").value == 0 || document.getElementById("searchtab").selectedIndex == 0) {

			search = null;
		}
		else {
			search = document.getElementById('searchtab').value;
		}


		filterBO = { "source": source, "destination": destination, "dropPoint": dropPoint, "timeSlot": bookingTimeSlot, "search": search };
		xhrFilterSearchCount = createHttpRequest("POST", pathName + "/complaints/getComplaints/getFilteredCount", true, "ADMIN");
		xhrFilterSearchCount.setRequestHeader("Content-Type", "application/json");
		xhrFilterSearchCount.send(JSON.stringify(filterBO));
		xhrFilterSearchCount.onreadystatechange = function() {
			if (xhrFilterSearchCount.readyState == 4 && xhrFilterSearchCount.status == 200) {
				objCount = JSON.parse(xhrFilterSearchCount.responseText);
				pages = Math.ceil(objCount / limit);
				if (objCount == 0) {


					document.getElementById("noValueFound").innerHTML = noRecordFound;
					document.getElementById("table-body").style.display = "none";
					createPagination(pages, 1);


				}

				else {

					document.getElementById("noValueFound").innerHTML = "";
					document.getElementById("table-body").style.display = "table-row-group";
					createPagination(pages, 1);
				}
			}
		};
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getAdminComplaintsCount()");
	}
}
//To get the details on filter and search//
var xhrFilterSearchDetails;
function getFilterRequest(filterBo, index) {
	try {
		filterApplied = true;
		skip = 0;

		var filterBtn = document.getElementById('ApplyButton');
		filterBtn.setAttribute('src', 'images/Vector.svg');


		filterBO = { "source": source, "destination": destination, "dropPoint": dropPoint, "timeSlot": bookingTimeSlot, "search": search };

		xhrFilterSearchDetails = createHttpRequest("POST", pathName + "/complaints/getFilterCountPageIndex/" + index, true, "ADMIN");
		xhrFilterSearchDetails.setRequestHeader("Content-Type", "application/json");
		xhrFilterSearchDetails.send(JSON.stringify(filterBO));
		xhrFilterSearchDetails.onreadystatechange = processResponseAdminComplaints;
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getAdminFilterComplaintsPageIndex()");
	}
}

//Filters cancel button clicked
function filtercancelButtonClicked() {
	try {
		window.location.reload();
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-cancelButtonClicked()");
	}
}
//On click of filterClose button (x) symbol
function filterCloseButton() {
	try {
		
		document.getElementById("filterShow").classList.remove("show");
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-filterCloseButton()");
	}
}

//To get the filterPageIndex count
function processResponseAdminComplaints() {
	try {
		if (xhrFilterSearchDetails.readyState == 4 && xhrFilterSearchDetails.status == 200) {
			obj = JSON.parse(xhrFilterSearchDetails.responseText);
			dynamicPageCreation(obj);
			var countSpan = document.getElementById("count");
			countSpan.innerHTML = "#Records  :" + $('#table-body tr').length + " out of " + objCount;
			document.getElementById("record").appendChild(countSpan);
		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-getAdminFilterComplaintsPageIndex()");
	}
}

var xhrRemarks;
var curId;
data = {}


function checkEmptyFeildValidation(curId) {
	try{
	var remarksError = document.getElementById("emptyCheckRemarks"+curId);

	var remarks = document.getElementById('remarks' + curId);

	if (remarks.value== "") {
		remarks.classList.remove("style-select1");
		remarks.style.borderColor = "red";
        remarksError.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		document.getElementById("actionShow"+curId).classList.remove("show");
		return false;
	} else {
		remarksError.innerHTML = "";
		remarks.classList.remove("style-select1");
		remarks.style.borderColor = "lightgrey";
		document.getElementById("actionShow"+curId).classList.add("show");


		return true;
	}
	}catch(e){
		jsExceptionHandling(e, "adminComplaints.js-remarksEmptyCheckValidation");
	}

}


//Remarks function (To solve the complaints from the admin side)
function saveRemarks(currentEle) {
	try {
		curId = currentEle.closest('td').id.replace("action", "");
		var emptyCheck = checkEmptyFeildValidation(curId);
		if (emptyCheck) {
            var bookingId = document.getElementById("bookingId" + curId).innerText;

			data.remarks = document.getElementById("remarks" + curId).value;
			data.driverNumber = document.getElementById("driverNo" + curId).innerText;
			data.employeeMail = document.getElementById("empMail" + curId).innerText;
			data.driverName = document.getElementById("driverName" + curId).innerText;
			data.cabNumber = document.getElementById("cabNum" + curId).innerText;

			xhrRemarks = createHttpRequest("PUT", pathName + "/complaints/registerComplaints/" + bookingId, true, "ADMIN");

			xhrRemarks.onreadystatechange = registerComplaints;

			xhrRemarks.setRequestHeader("Content-Type", "application/json");

			xhrRemarks.send(JSON.stringify(data));
		}

}
	 catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-saveRemarks");
	}

}
function remarksClose(){
	
	document.getElementById("actionShow"+curId).classList.add("show");
	
}

function onClickOfRemarksCanCelButton() {
	try {
		window.location.reload();
		document.getElementById("remarks" + curId).value = "";
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-onClickOfRemarksCanCelButton()");
	}
}


function registerComplaints() {
	try {
		if (xhrRemarks.readyState == 4 && xhrRemarks.status == 200) {
			window.location.reload();

		}

		if (xhrRemarks.readyState == 4 && xhrRemarks.status == 208) {

			document.getElementById("remarks0").style.borderColor = "red";

			document.getElementById("remarks0").innerHTML("Already Reported");
		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-registerComplaints()");
	}
}

// Sort the table
function sortTable(tdNum, orderType) {
	try {
		var rows, switching, i, x, y, shouldSwitch;
		tBody = document.getElementById("table-body");
		switching = true;
		while (switching) {
			switching = false;
			rows = tBody.rows;
			for (i = 0; i < (rows.length); i++) {
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
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-sortTable()");
	}
}
//For normal count and filter count pageIndex dynamic pagecreation
function dynamicPageCreation(obj) {
	try {
		rowCounter = 0;


		$("#table-body").empty();
		for (var i = 0; i < obj.length; i++) {

			// creating row and data
			var trow = document.createElement('tr');
			trow.className = "row-bg-style";
			trow.id = "row" + i;       // addingStyle class
			
			var empDetailIdDivObj = document.createElement('td');
			empDetailIdDivObj.className = "spacing2";
			empDetailIdDivObj.id = "empDetail"+ i;
			empDetailIdDivObj.style.display = "none";			
			var empIdDivObj = document.createElement('td');
			empIdDivObj.className = "spacing2";
			empIdDivObj.id = "empid" + i;
			var empNameDivObj = document.createElement('td');
			empNameDivObj.className = "spacing2";
			empNameDivObj.id = "empName" + i;
			var empNumDivObj = document.createElement('td');
			empNumDivObj.className = "spacing2";
			empNumDivObj.id = "empNumber" + i;
			var cabNumDivObj = document.createElement('td');
			cabNumDivObj.className = "spacing2";
			cabNumDivObj.id = "cabNum" + i;
			var driverNameDivObj = document.createElement('td');
			driverNameDivObj.className = "spacing2";
			driverNameDivObj.id = "driverName" + i;
			var sourceDivObj = document.createElement('td');
			sourceDivObj.className = "spacing2";
			sourceDivObj.id = "source" + i;
			var destinationDivObj = document.createElement('td');
			destinationDivObj.className = "spacing2";
			destinationDivObj.id = "destination" + i;
			var dropPointDivObj = document.createElement('td');
			dropPointDivObj.className = "spacing2";
			dropPointDivObj.id = "dropPoints" + i;
			var dateOfTravelDivObj = document.createElement('td');
			dateOfTravelDivObj.className = "spacing2";
			dateOfTravelDivObj.id = "dateoftravel" + i;
			var timeSlotDivObj = document.createElement('td');
			timeSlotDivObj.className = "spacing2";
			timeSlotDivObj.id = "timeslot" + i;
			var complaintsDivObj = document.createElement('td');
			complaintsDivObj.className = "spacing2";
			complaintsDivObj.id = "complaints" + i;
			var actionDivObj = document.createElement('td');
			actionDivObj.className = "spacing2";
			actionDivObj.id = "action" + i;
			
			var bookingIdDivObj = document.createElement('td');
			bookingIdDivObj.className = "spacing2";
			bookingIdDivObj.style.display = "none";
			bookingIdDivObj.id = "bookingId" + i;

			var driverNumDivObj = document.createElement('td');
			driverNumDivObj.className = "spacing2";
			driverNumDivObj.style.display = "none";
			driverNumDivObj.id = "driverNo" + i;

			var empMailDivObj = document.createElement('td');
			empMailDivObj.className = "spacing2";
			empMailDivObj.style.display = "none";
			empMailDivObj.id = "empMail" + i;
			

			empDetailIdDivObj.innerText = obj[i].employeeDetailId;
            empIdDivObj.innerText = obj[i].employeeId;
			empNameDivObj.innerText = obj[i].employeeName;
			empNumDivObj.innerText = obj[i].phoneNumber;
			cabNumDivObj.innerText = obj[i].cabNumber;
			driverNameDivObj.innerText = obj[i].driverName;
			sourceDivObj.innerText = obj[i].source;
			destinationDivObj.innerText = obj[i].destination;
			dropPointDivObj.innerText = obj[i].dropPoint;
			var date = obj[i].dateOfTravel;
			var splitDate = date.split("-");

			dateOfTravelDivObj.innerText = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];

			var slot = obj[i].timeSlot;
			var slotSplitted = slot.split(":");
			slotHour = slotSplitted[0];
			if (slotHour < 12) {
				if (slotHour == 00) {
					timeSlotDivObj.innerText = "12" + ":" + slotSplitted[1] + " AM";
				} else {
					timeSlotDivObj.innerText = slotHour + ":" + slotSplitted[1] + " AM";
				}

			} else {
				slotHour = slotHour - 12;
				if (slotHour < 10) {
					timeSlotDivObj.innerText = "0" + slotHour + ":" + slotSplitted[1] + " PM";

				} if (slotHour == 0) {
					timeSlotDivObj.innerText = "12" + ":" + slotSplitted[1] + " PM";
				}
				else {
					timeSlotDivObj.innerText = slotHour + ":" + slotSplitted[1] + " PM";
				}
			}
			complaintsDivObj.innerText = obj[i].complaintDescription;
			actionDivObj.innerHTML = "<div class='dropdown' id='actionShow"+i+"'><a href='#' title='Remarks' class='align-img' data-toggle='dropdown' aria-expanded='false' ><img class='cursor actions' src='images/report_action.svg' alt='remarks-icon' ></a><div class='dropdown-menu m-0 p-3 user-filter' ><div class='container-fluid'><div class='row'><div class='col-md-12 mb-3'><div class='col-md-12 pb-2 border-0 mb-3'><button type='button' class='btn-close float-end close-filter' data-bs-dismiss='user-filter' aria-label='Close' onclick='remarksClose()'></button></div><h5 class='h-size1 mb-2'>Enter Remarks</h5><span id='emptyCheckRemarks" +i + "'></span><input type='text' class='form-control border-filter-style' id='remarks" + i + "'></div><div class='col-md-12'><button type='button' class='save-btn float-end' onclick='saveRemarks(this)'>Save</button><button type='button' class='cancel1-btn float-end ' onclick='onClickOfRemarksCanCelButton()'>Cancel</button></div><div></div></div></div>";

			bookingIdDivObj.innerText = obj[i].bookingId;
			driverNumDivObj.innerText = obj[i].driverNumber;
			empMailDivObj.innerText = obj[i].employeeMail;
			
			
			trow.appendChild(empDetailIdDivObj);
            trow.appendChild(empIdDivObj);
			trow.appendChild(empNameDivObj);
			trow.appendChild(empNumDivObj);
			trow.appendChild(cabNumDivObj);
			trow.appendChild(driverNameDivObj);
			trow.appendChild(sourceDivObj);
			trow.appendChild(destinationDivObj);
			trow.appendChild(dropPointDivObj);
			trow.appendChild(dateOfTravelDivObj);
			trow.appendChild(timeSlotDivObj);
			trow.appendChild(complaintsDivObj);
			trow.appendChild(actionDivObj);
			trow.appendChild(bookingIdDivObj);
			trow.appendChild(driverNumDivObj);
			trow.appendChild(empMailDivObj);



       

			document.getElementById("table-body").appendChild(trow);




		}
	} catch (e) {
		jsExceptionHandling(e, "adminComplaints.js-dynamicPageCreation()");
	}
}

