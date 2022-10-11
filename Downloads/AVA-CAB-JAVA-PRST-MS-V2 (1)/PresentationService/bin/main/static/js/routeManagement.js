var rowCounter;
var limit;
var pages;
var pageIndex;
var totalCount;
var xhrRoutCount;
var xhrDestinationDetails;
var noRecordFound = "<h5 class=noRecordsFound>No Records Found </h5>";

window.onload = getRouteCount;


function getRouteCount() {

	try{
	xhrRoutCount = createHttpRequest("GET", pathName + "/route/getRouteCount", true, "ADMIN");//To get the routeCount from the database
	xhrRoutCount.onreadystatechange = getNoOfRouteRecords;
	xhrRoutCount.send();
}
catch(e){
	   jsExceptionHandling(e, "routeManagement.js- getRouteCount()");  
}
}
function getNoOfRouteRecords() {
try{
	if (this.readyState == 4 && this.status == 200) {
		
		limit = xhrRoutCount.getResponseHeader("limit");
		totalCount = JSON.parse(this.responseText);
		pages = Math.ceil(totalCount / limit); //To get the pageCount 

		if (totalCount == 0) {    //If total count is 0 prints No record found
			document.getElementById("noValueFound").innerHTML = noRecordFound;

		}
		else {

			createPagination(pages, 1);
		}



	}
	}catch(e){
		 jsExceptionHandling(e, "routeManagement.js-getNoOfRouteRecords()");  
}
	
}
var arr;
function getDestinationDetails(pageIndex) {
try{

	xhrDestinationDetails = createHttpRequest("GET", pathName + "/route/getRoute/" + pageIndex, true, "ADMIN");
	xhrDestinationDetails.onreadystatechange = function() {
	// creating row and data  
		if (this.readyState == 4 && this.status == 200) {
			arr = JSON.parse(this.responseText);
			rowCounter = 0;

			$("#route-info").empty();
			for (var i = 0; i < arr.length; i++) {



				var trow = document.createElement('tr');


				trow.id = "tr" + i;
				

				

				var destinationDivObj = document.createElement('td'); //To get the destinations
				destinationDivObj.id = "tddestination" + i;

				var destinationIdDivObj = document.createElement('td');
				destinationIdDivObj.id = "tddestinationId"+i;
				
				var dropPointsDivObj = document.createElement('td');//To get the dropPoint
				dropPointsDivObj.id = "tddropPoints" + i;

				var list = document.createElement('ul');
				list.className = "dropPoints";
				for (var j = 0; j < arr[i].dropPoints.length; j++) {
					var listItem = document.createElement('li');

					listItem.innerText = arr[i].dropPoints[j].dropPoint;
					list.appendChild(listItem);
				}//To append the dropPoint values
				dropPointsDivObj.appendChild(list);

				var timeSlotDivObj = document.createElement('td');
				timeSlotDivObj.id = "tdtimeSlot" + i;

          //To append the timeSlot values

				var listPickup = document.createElement('ul');
				listPickup.className = "dropPoints";
				for (var k = 0; k < arr[i].pickupTimeSlot.length; k++) {

					var listItem = document.createElement('li');

					var slot = arr[i].pickupTimeSlot[k].pickupTimeSlot;


					var slotSplitted = slot.split(":");
					slotHour = slotSplitted[0];
					if (slotHour < 12) {
						if (slotHour == 00) {
							listItem.innerHTML = "12" + ":" + slotSplitted[1] + " AM";

						} if (slotHour == 0) {
							listItem.innerHTML = "12" + ":" + slotSplitted[1] + " AM";
						}
						else {
							listItem.innerHTML = slotHour + ":" + slotSplitted[1] + " AM";

						}
					} else {
						slotHour = slotHour - 12;
						if (slotHour == 0) {
							listItem.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
						}
						else if (slotHour < 10) {
							listItem.innerHTML = "0" + slotHour + ":" + slotSplitted[1] + " PM";

						}
						else {
							listItem.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
						}
					}

					listPickup.appendChild(listItem);



				}
				timeSlotDivObj.appendChild(listPickup);
				
				var dropTimeSlotDivObj = document.createElement('td');
				dropTimeSlotDivObj.id = "tdDroptimeSlot" + i;
				var listDrop = document.createElement('ul');
				listDrop.className = "dropPoints";
				for (var k = 0; k < arr[i].dropTimeSlot.length; k++) {

					var listItem = document.createElement('li');

					var slot = arr[i].dropTimeSlot[k].dropTimeSlot;


					var slotSplitted = slot.split(":");
					slotHour = slotSplitted[0];
					if (slotHour < 12) {
						if (slotHour == 00) {
							listItem.innerHTML = "12" + ":" + slotSplitted[1] + " AM";

						} if (slotHour == 0) {
							listItem.innerHTML = "12" + ":" + slotSplitted[1] + " AM";
						}
						else {
							listItem.innerHTML = slotHour + ":" + slotSplitted[1] + " AM";

						}
					} else {
						slotHour = slotHour - 12;
						if (slotHour == 0) {
							listItem.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
						}
						else if (slotHour < 10) {
							listItem.innerHTML = "0" + slotHour + ":" + slotSplitted[1] + " PM";

						}
						else {
							listItem.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
						}
					}

					listDrop.appendChild(listItem);



				}
				dropTimeSlotDivObj.appendChild(listDrop);

				var statusCheckDivObj = document.createElement('td');  //To get the Status check value
				statusCheckDivObj.id = "tdstatus" + i;
				statusCheckDivObj.className = "text-center";

				if (arr[i].active == true) {
					statusCheckDivObj.innerHTML = "<td class='spacing text-center'><div class='form-check form-switch' id = 'button-1'><input class='form-check-input' type='checkbox' id='status" + i + "' checked onclick ='changeStatus(this)'><label class='form-check-label' for='flexSwitchCheckDefault'></label></div></td>"

				} else {
					statusCheckDivObj.innerHTML = "<td class='spacing text-center'><div class='form-check form-switch' id = 'button-1'><input class='form-check-input' type='checkbox' id='status" + i + "' unchecked onclick ='changeStatus(this)'><label class='form-check-label' for='flexSwitchCheckDefault'></label></div></td>"
				}




				var deleteDestinationDivObj = document.createElement('td');
				deleteDestinationDivObj.id = "tdeditdelete" + i;  //To delete the destination
				deleteDestinationDivObj.className = "text-center";
				destinationDivObj.innerText = arr[i].destination;
				destinationIdDivObj.innerText = arr[i].destinationId;
				destinationIdDivObj.style.display = "none";
				deleteDestinationDivObj.innerHTML = "<a href='#' title='Edit'  class='actions-image'><img class ='edit-new' onclick='editDestination(this)'  src='images/edit_grid.svg' alt='edit-icon'/></a><a href='#' title='Delete'  class='actions2-image'><img class ='delete-new' src='images/bin_grid.svg'   alt='delete-icon'  data-toggle='modal' data-target='#route-pop' onclick='delRow(this)'/></a>"
		
				trow.appendChild(destinationDivObj);
				trow.appendChild(destinationIdDivObj);
				trow.appendChild(dropPointsDivObj);
				trow.appendChild(timeSlotDivObj);
				trow.appendChild(dropTimeSlotDivObj);
				trow.appendChild(statusCheckDivObj);
				trow.appendChild(deleteDestinationDivObj);

				document.getElementById("route-info").appendChild(trow);

			}

		}
	}; xhrDestinationDetails.send();
	}catch(e){
		 jsExceptionHandling(e, "routeManagement.js-getDestinationDetails()");  
	}
}


function createPagination(pages, pageIndex) {
	try{

	getDestinationDetails(pageIndex - 1);
	let str = '<ul class = "ul-tag">';

	let active;
	let previousButton = pageIndex - 1;
	let nextButton = pageIndex + 1;


	if (pageIndex > 1) {       //When index is > 1 then, shows the previous arrow

		str += '<li class="page-item " ><a class="page-link pagination-border" onclick="createPagination(pages, ' + (pageIndex - 1) + ')"><img src="images/pagination-prev-arrow.svg"  /></a></li>';



	}
	if (pages < 6) {       //Sets the active page and increments the pages based on the total records and limit
		for (let p = 1; p <= pages; p++) {
			active = pageIndex == p ? "active" : "no";
			str += '<li class="' + active + '" ><a class="page-link pagination-border a-tag" onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
		}
	}

	else {
		if (pageIndex > 2) {     //Sets 1 as active 
			str += '<li class="page-item "><a class="page-link pagination-border" onclick="createPagination(pages, 1)">1</a></li>';
			if (pageIndex > 3) {
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (pageIndex - 2) + ')">...</a></li>';
			}
		}


		if (pageIndex === 1) {        //Conditions for where the ... should be displayed before the next
			nextButton += 2;
		} else if (pageIndex === 2) {  //Conditions for where the ... should be displayed after the previous
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

	document.getElementById('routePagination').innerHTML = str;
	return str;
	}catch(e){
		jsExceptionHandling(e, "routeManagement.js-createPagination()");  
	}

}
var xhrDeleteRow;
var deleteRow;
var deleteId;
//To delete the destination
function deleteIconClicked() {

try{

	xhrDeleteRow = createHttpRequest("PUT", pathName + "/route/deleteDestination/" + destinationId, true, "ADMIN");
	xhrDeleteRow.onreadystatechange = deleteDestination;
	xhrDeleteRow.send();
	}
	catch(e){
		  jsExceptionHandling(e, "routeManagement.js- deleteIconClicked()");  
	}
}

function deleteDestination() {
try{
	if (this.readyState == 4 && this.status == 200) {

		var response = this.responseText;
		delRow.remove();
		window.location.reload();
	}
	}
	catch (e){
		 jsExceptionHandling(e, "routeManagement.js-deleteDestination()");  
	}
}
var counter
function delRow(row) {
	try{
	deleteId = row.closest("td").id;
	counter = deleteId.replace("tdeditdelete", "");
	}
	catch(e){
		jsExceptionHandling(e, "routeManagement.js-delRow()");  
	}

}

function deleteData() {
try{
	delRow = document.getElementById("tr" + counter);
	destinationId = delRow.getElementsByTagName("td")[1].innerHTML;
	deleteIconClicked();
	}catch(e){
		jsExceptionHandling(e, "routeManagement.js-deleteData()");  
	}
}
var destId;
function editDestination(row) {
	try{
	deleteId = row.closest("td").id;
	counter = deleteId.replace("tdeditdelete", "");
	delRow = document.getElementById("tr" + counter);
	destinationId = delRow.getElementsByTagName("td")[1].innerHTML;
	window.location.href = "newRoute.html?destId=" + destinationId;
	}catch(e){
		jsExceptionHandling(e, "routeManagement.js-editDestination()");  
	}
}

//Status Check functionality
var xhrIsActive;
function changeStatus(obj) {
     try{
	var checkBox = document.getElementById(obj.id);
	if (checkBox.checked == true) {//If checkBox applied
		isActive = true;
	}
	else {
		isActive = false;
	}


	var row = obj.id.replace("status", "");

	var destinationId = document.getElementById("tddestinationId" + row).innerText;
	xhrIsActive = createHttpRequest("PUT", pathName + "/route/status/" + destinationId + "/" + isActive, true, "ADMIN");
	xhrIsActive.onreadystatechange = routeIsActive;
	xhrIsActive.send();
	
}catch(e){
	jsExceptionHandling(e, "routeManagement.js-changeStatus()");  
}

}


function routeIsActive() {
	
	try{
	if (this.readyState == 4 && this.status == 200) {
		var response = JSON.parse(this.responseText);


	}

}catch(e){
	jsExceptionHandling(e, "routeManagement.js-routeIsActive()");  
}

}




