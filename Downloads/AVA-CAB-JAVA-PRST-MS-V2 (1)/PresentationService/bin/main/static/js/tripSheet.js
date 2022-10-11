
var xhr;
var http;
var idSearch = window.location.search;
var tripCabId = idSearch.split("=")[1];
var request;
var validateLimit;
var counter = 0;
var employeeDetailId;
var todaysRequestClicked;
var assignedCabsClicked;
var manageCabsClicked;
var manageDriversClicked;
var rowLength;
var sourceId;
var dest;
var noShowListEmpId = new Array();
var noShowListBookingId = new Array();
var requestType;
var requestTypeOfTrip;

window.onload = function() {
	
	try{
	getTripSheet();
	timeOut =  setInterval(
			getTripSheet, 60000);
	
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
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-onload()");
	}
}

function changeFieldNames() {
	if(request == "Drop"){
		var dropPoint = document.getElementById('changeDropLabel');
		dropPoint.innerHTML = "Drop Point";
		var sourceLabel = document.getElementById('sourceLabel');
		sourceLabel.innerHTML = "Source";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Destination";
		var locationLabel = document.getElementById('hideLocation');
		locationLabel.style.display = "none";
		var locationBox = document.getElementById('hideLocationTextBox');
		locationBox.style.display = "none";
		var hideLocationData = document.getElementById('hideLocationTd');
		hideLocationData.style.display = "none";
	}
	else if(request == "Pickup"){
		var dropPoint = document.getElementById('changeDropLabel');
		dropPoint.innerHTML = "Pickup Point";
		var sourceLabel = document.getElementById('sourceLabel');
		sourceLabel.innerHTML = "Destination";
		var destinationLabel = document.getElementById('destinationLabel');
		destinationLabel.innerHTML = "Source";
		var locationLabel = document.getElementById('hideLocation');
		locationLabel.style.display = "block";
		var locationBox = document.getElementById('hideLocationTextBox');
		locationBox.style.display = "block";
	
	}
}

function getTripSheet() {

try{
	var url = pathName + "/bookingInfoService/tripService/tripSheetInfo/" + tripCabId;
	xhr = createHttpRequest("GET", url, true, "ADMIN");
	xhr.onreadystatechange = function (event) {

	event.preventDefault();
	if (xhr.readyState == 4 && xhr.status == 200) {

		var data = JSON.parse(this.responseText);
		requestType = data.requestType;
		displayTripSheet(data);
		changeFieldNames();

	}
	else if(xhr.readyState == 4 && xhr.status == 666) {
		window.location.href = "/admin/ongoingtrip?tripCabId=" + tripCabId;
		}



};
	xhr.send(null);
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-getTripSheet()");
	}

}
var timeSlotToCompare;
var dateOfTravel;
var request;
var startTripButton = document.getElementById("startclick");
function displayTripSheet(obj) {
	
try{
	document.getElementById("cabnumber").innerHTML = obj.cabNumber;
	document.getElementById("drivername").innerHTML = obj.driverName;
	document.getElementById("drivernumber").innerHTML = obj.driverNumber;
	document.getElementById("source").innerHTML = obj.source;
	document.getElementById("destination").innerHTML = obj.destination;
	dest=obj.destinationId;
	sourceId=obj.sourceId;
	var date = obj.dateOfTravel;
	dateOfTravel = obj.dateOfTravel;
	var dateOfTravelValue = date.split("\-");
	document.getElementById("date").innerHTML = dateOfTravelValue[2] + "-" + dateOfTravelValue[1] + "-" + dateOfTravelValue[0];

	request = obj.requestType;
	//jawahar Added
	requestTypeOfTrip=obj.requestType;
	//jawahar Added

	var timeSlotValue = timeFormatTo12Hr(obj.timeSlot, 0);
	document.getElementById("timeslot").innerHTML = timeSlotValue;

	document.getElementById("totalseats").innerHTML = obj.totalSeats;
	document.getElementById("allocatedseats").innerHTML = obj.allocatedSeats;
	document.getElementById("remainingseats").innerHTML = obj.remainingSeats;
	document.getElementById("status").innerHTML = obj.status;

	
	var serialNumberCounter = 1;
	var tableBody = document.getElementById("tablebody");
	rowLength = obj.bookingRequest.length;


	$("#tablebody tr").slice(1).remove();
	for (var rows = 0; rows < rowLength; rows++) {

		var tableRow = document.createElement('tr');
		counter = rows;
		tableRow.className = "row-bg-style";
		tableRow.id = "tr" + counter;

		var serialNumber = document.createElement('td');
		serialNumber.className = "spacing1";
		serialNumber.innerHTML = serialNumberCounter++;
		tableRow.appendChild(serialNumber);

		var employeeDetailId = document.createElement('td');
		employeeDetailId.className = "spacing1";
		employeeDetailId.innerHTML = obj.bookingRequest[rows].employeeDetailId;
		tableRow.appendChild(employeeDetailId);
		employeeDetailId.style.display = "none";
		
		var idOfEmployee = document.createElement('td');
		idOfEmployee.className = "spacing1";
		idOfEmployee.innerHTML = obj.bookingRequest[rows].employeeId;
		tableRow.appendChild(idOfEmployee);

		var nameOfEmployee = document.createElement('td');
		nameOfEmployee.className = "spacing1";
		nameOfEmployee.innerHTML = obj.bookingRequest[rows].employeeName;
		tableRow.appendChild(nameOfEmployee);
		
		var phoneNumber = document.createElement('td');
		phoneNumber.className = "spacing1";
		phoneNumber.innerHTML = obj.bookingRequest[rows].phoneNumber;
		tableRow.appendChild(phoneNumber);

		var destinationDropPoint = document.createElement('td');
		destinationDropPoint.className = "spacing1";
		destinationDropPoint.innerHTML = obj.bookingRequest[rows].dropPoint;
		tableRow.appendChild(destinationDropPoint);
		
		if(request == "Pickup"){
			var locationPoint = document.createElement('td');
			locationPoint.className = "spacing1 locationTooltip text-nowrap";
			locationPoint.title = obj.bookingRequest[rows].location;
			locationPoint.innerHTML = obj.bookingRequest[rows].location;
			tableRow.appendChild(locationPoint);
		}

		var actionIcon = document.createElement('td');
		actionIcon.className = "spacing1 text-center";
		actionIcon.id = "td" + counter;
		actionIcon.innerHTML = "<a href='#' title='Edit' class='actions-image'><img class ='edit-new' src='images/edit_grid.svg' alt='edit-icon' id='edit' onclick = 'editButtonClicked(this)'/></a><a href='#' title='Delete' class='actions2-image' data-toggle='modal' data-target='#trip-pop'><img class ='delete-new' src='images/bin_grid.svg'' alt='delete-icon'/ id='deletebutton' onclick = 'deleteButtonClicked(this)'></a>";
		tableRow.appendChild(actionIcon);

		var employeeReachedTime = document.createElement('td');
		employeeReachedTime.className = "spacing1";
		employeeReachedTime.innerHTML = "";
		tableRow.appendChild(employeeReachedTime);

		var employeeStatus = document.createElement('td');
		employeeStatus.className = "spacing1";
		employeeStatus.innerHTML = "<select  class='form-select style-select1 border-filter-style' id='Droppoint4" + counter + "' aria-label='Default-example' onchange='showUpdate()'><option value='1'>Show</option><option value='2' selected>Noshow</option></select>";
		tableRow.appendChild(employeeStatus);

		var employeeBookingId = document.createElement('td');
		employeeBookingId.className = "spacing1";
		employeeBookingId.id = 'bookId';
		employeeBookingId.innerHTML = obj.bookingRequest[rows].bookingId;
		employeeBookingId.style.display = "none";
		tableRow.appendChild(employeeBookingId);

		requestType = document.createElement('td');
		requestType.className = "spacing1";
		requestType.id = 'requestTypeId';
		requestType.innerHTML = obj.bookingRequest[rows].requestType;
		requestType.style.display = "none";
		tableRow.appendChild(requestType);
		
	tableBody.appendChild(tableRow);
	}
	showUpdate();
	assignedCabActionButtonClicked(dest);
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-displayTripSheet(obj)");
}

}

function backButton() {
	try{
	window.location.href = "/admin/dashboard#pills-assigned";
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-backButton()");
	}
}


//CancelTrip Button clicked
function cancelTripButton() {

try{
	var cancelTrip;

	cancelTrip = createHttpRequest("PUT", pathName + "/bookingInfoService/tripService/cancelTrip/" + tripCabId, true, "ADMIN");
	cancelTrip.setRequestHeader("Content-Type", "application/json");
	cancelTrip.send(null);
	cancelTrip.onreadystatechange = function() {



		if (cancelTrip.readyState == 4 && cancelTrip.status == 200) {
			var data = this.responseText;
			window.location.href = "/admin/dashboard#pills-assigned";
		}

	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-cancelTripButton()");
	}

}


var showCount = 0;

function empStatusCheck(){
	
	try{
	
							var tableBody = document.getElementById("tablebody");
							
							for (var row = 0; row < tableBody.rows.length - 1; row++) {

								var td = tableBody.rows[row + 1].cells[2];
								if(request == "Pickup"){
									var tdBook = tableBody.rows[row + 1].cells[10];
								}else{
									var tdBook = tableBody.rows[row + 1].cells[9];	
								}

								var selectOption = document.getElementById("Droppoint4" + row);
								if (selectOption.value == 1) {

									showCount++;

								} else {
									var noShowEmpId = td.innerHTML;
									noShowListEmpId.push(noShowEmpId);
									var bookingId = tdBook.innerText;
									noShowListBookingId.push(bookingId);

								}

							}
					}
					catch(e){
						jsExceptionHandling(e, "tripSheet.js-empStatusCheck()");
					}		
	
}










//Start trip

var updateEmpStatus;
function startTrip() {
	
	try{
							noShowListEmpId = [];
							noShowListBookingId = [];
							errorStartTrip.innerHTML = "";
							empStatusCheck();
							
							
							if (showCount > 0) {
								if (noShowListBookingId == '' && noShowListEmpId == '') {
									updateEmpStatus=createHttpRequest("PUT", pathName + "/bookingInfoService/tripService/updateTrip/" + tripCabId + "/" + 0 + "/" + 0 + "/" + false, true,"ADMIN");
									updateEmpStatus.setRequestHeader("Content-Type", "application/json");
									updateEmpStatus.send();
									
									updateEmpStatus.onreadystatechange = function() {

										if (updateEmpStatus.readyState == 4 && updateEmpStatus.status == 200) {
											if (JSON.parse(updateEmpStatus.responseText)) {
												window.location.href = "/admin/ongoingtrip?tripCabId=" + tripCabId;

											}
											else {
												validateTime = updateEmpStatus.getResponseHeader("validateTime");
												document.getElementById("startTrip").style.borderColor = "red";
												errorStartTrip.innerHTML = "<p style='color: red'>" +
													"Cannot start trip before "+validateTime+" minutes</p>";
												return false;
											}

										}
									}

								}
								 else {
									updateEmpStatus = createHttpRequest("PUT", pathName + "/bookingInfoService/tripService/updateTrip/" + tripCabId + "/" + noShowListEmpId + "/" + noShowListBookingId + "/" + false, true, "ADMIN");
									updateEmpStatus.setRequestHeader("Content-Type", "application/json");
									updateEmpStatus.send();
									
									updateEmpStatus.onreadystatechange = function() {

										if (updateEmpStatus.readyState == 4 && updateEmpStatus.status == 200) {
                                           if (JSON.parse(updateEmpStatus.responseText)) {
												window.location.href = "/admin/ongoingtrip?tripCabId=" + tripCabId;

											}
											else {
												validateTime = updateEmpStatus.getResponseHeader("validateTime");
												document.getElementById("startTrip").style.borderColor = "red";
												errorStartTrip.innerHTML = "<p style='color: red'>" +
													"Cannot start trip before "+validateTime+" mintues</p>";
												return false;
											}
										}
									}
								}

							}
							
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-startTrip()");
}


}



var noShowUpdate;
function noOneShowedUp() {
	try{
	
					empStatusCheck();
					noShowUpdate = createHttpRequest("PUT", pathName + "/bookingInfoService/tripService/updateTrip/" + tripCabId + "/" + noShowListEmpId + "/" + noShowListBookingId + "/" + true, true, "ADMIN");
					noShowUpdate.setRequestHeader("Content-Type", "application/json");
					noShowUpdate.send();
									
					noShowUpdate.onreadystatechange = function() {
	
					if (noShowUpdate.readyState == 4 && noShowUpdate.status == 200) {
						if (JSON.parse(noShowUpdate.responseText)) {
							window.location.href ="/admin/dashboard#pills-assigned";

						}
						else {
							validateTime = noShowUpdate.getResponseHeader("validateTime");
							document.getElementById("startTrip").style.borderColor = "red";
							errorStartTrip.innerHTML = "<p style='color: red'>" +
								"Cannot start trip before " + validateTime + " minutes</p>";
							return false;
						}
					}
				}
				}
				catch(e){
					jsExceptionHandling(e, "tripSheet.js-noOneShowedUp()");
				}
		}



/*------------------------------------------------------------ kiruthika code -------------------------------------------------------------*/
var errorEmpId = document.getElementById("errorEmpId");
var errorEmpName = document.getElementById("errorEmpName");
var errorDropPoints = document.getElementById("errorDropPoints");
var errorEmpDetails = document.getElementById("errorEmpDetails");
var errorPhoneNumber = document.getElementById("errorEmpPhNo");
var errorLocation = document.getElementById("errorLocation");

function saveBlurFunction(){
	
	try{

	if(document.getElementById('savebutton').value == undefined || document.getElementById('savebutton').value =="")
	{
		document.getElementById("savebutton").style.borderColor = "red";
	errorEmpDetails.innerHTML = "<p style='color: red;margin-top:6px;'>" +
			"Invalid employee details</p>";
		return false;
	}
	else {
		errorEmpDetails.innerHTML = "";
		document.getElementById("savebutton").style.borderColor = "lightgrey";
	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-saveBlurFunction()");
	}
	
}


function empIdBlurFunction(){
	try{

	if(document.getElementById('emp-id').value == undefined || document.getElementById('emp-id').value =="")
	{
		document.getElementById("emp-id").style.borderColor = "red";
	errorEmpId.innerHTML = "<p style='color: red;margin-top:6px;'>" +
			"Employee Id can't be empty</p>";
		
		return false;
	}
	else {
		errorEmpId.innerHTML = "";
		document.getElementById("emp-id").style.borderColor = "lightgrey";
	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-empIdBlurFunction()");
	}
	
}
function empNameBlurFunction(){
	
	try{

	if(document.getElementById('emp-name').value == undefined || document.getElementById('emp-name').value =="")
	{
		document.getElementById("emp-name").style.borderColor = "red";
	errorEmpName.innerHTML = "<p style='color: red;margin-top:6px;'>" +
			"Employee name can't be empty</p>";
		return false;
	}
	else {
		errorEmpName.innerHTML = "";
		document.getElementById("emp-name").style.borderColor = "lightgrey";
	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-empNameBlurFunction()");
	}
	
}

function phoneNumberBlurFunction(){
	try{

	if(document.getElementById('emp-phNum').value == undefined || document.getElementById('emp-phNum').value =="")
	{
		document.getElementById("emp-phNum").style.borderColor = "red";
	errorPhoneNumber.innerHTML = "<p style='color: red;margin-top:6px;'>" +
			"Phone Number can't be empty</p>";
		return false;
	}
	else {
		errorPhoneNumber.innerHTML = "";
		document.getElementById("emp-phNum").style.borderColor = "lightgrey";
	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-phoneNumberBlurFunction()");
	}
}

function locationBlurFunction(){
	try{

	if(document.getElementById('hideLocationTextBox').value == undefined || document.getElementById('hideLocationTextBox').value =="")
	{
		document.getElementById("hideLocationTextBox").style.borderColor = "red";
	errorLocation.innerHTML = "<p style='color: red'>" +
			"Location can't be empty</p>";
		return false;
	}
	else {
		errorLocation.innerHTML = "";
		document.getElementById("hideLocationTextBox").style.borderColor = "lightgrey";
	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-locationBlurFunction()");
	}
	
}

function dropPointOnblurFunction(){
	
	try{

	if(document.getElementById('droppoints').value == undefined || document.getElementById('droppoints').value =="" || document.getElementById('droppoints').value =="Select")
	{
		document.getElementById("droppoints").style.borderColor = "red";
		//Jawahar Added
		if(requestTypeOfTrip=="Drop"){
			errorDropPoints.innerHTML = "<p style='color: red;margin-bottom: 20.5px;'>" +
			"Drop Point can't be empty</p>";
		}else{
			errorDropPoints.innerHTML = "<p style='color: red;margin-bottom: -5px;' class='mb-0'>" +
			"Pickup Point can't be empty</p>";
			document.getElementById("droppoints").classList.remove("removemarginbottom");
		}
			//Jawahar Added
		return false;
	}
	else {
		errorDropPoints.innerHTML = "";
		document.getElementById("droppoints").style.borderColor = "lightgrey";
		document.getElementById("droppoints").classList.add("removemarginbottom");
	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-dropPointOnblurFunction()");
	}
	
}




var xhrDropPoint;

// To autopopulate drop points dropdown based on the destination


function assignedCabActionButtonClicked(dest) {
	try{
		var url= pathName+"/bookingInfoService/bookingRequest/adminTripSheet/" + dest;
		xhrDropPoint=createHttpRequest("GET",url, true,"ADMIN");
		xhrDropPoint.onreadystatechange = processResponseDestinationDropDown;
		xhrDropPoint.send(null);
		}
		catch(e){
			jsExceptionHandling(e, "tripSheet.js-assignedCabActionButtonClicked(dest)");
		}


}
function processResponseDestinationDropDown() {
	
	try{

		if (xhrDropPoint.readyState == 4 && xhrDropPoint.status == 200) {


			var dropDown = document.getElementById("droppoints");
			var data = JSON.parse(this.responseText);
			var rowLength = data.dropPoints.length;
			$("#droppoints option").slice(1).remove();
			for (var rows = 0; rows < rowLength; rows++) {
				var optTag = document.createElement('option');
				optTag.innerHTML = data.dropPoints[rows].dropPoint;
				dropDown.appendChild(optTag);
			}

		}
		}
		catch(e){
			jsExceptionHandling(e, "tripSheet.js-processResponseDestinationDropDown()");
		}
	}



///* ------------------------------------------------------------------------------------------------------------------------------ */

// To autofill the employee name using the employee id
var xhrEmp;

var empNameInput=document.getElementById("emp-name");
empNameInput.addEventListener("input", employeeNameTyped);


function employeeNameTyped(){
	
	try{
	if(empNameInput.value.length>=3){
	
	var url=pathName+"/bookingInfoService/bookingRequest/adminTripSheet/employeeNameSearch/"+empNameInput.value;
	xhrEmp=createHttpRequest("GET",url, true,"ADMIN");
	xhrEmp.onreadystatechange = fetchEmployeeName;
    xhrEmp.send(null);	
    }	
    else{
	empNameBlurFunction();

	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-employeeNameTyped()");
	}
}

function fetchEmployeeName(){
	
	try{
	if(xhrEmp.readyState==4 && xhrEmp.status==200)
	{
		var employeeName=JSON.parse(xhrEmp.responseText);
		searchEmployeeName(employeeName);
		}
		}
		catch(e){
			jsExceptionHandling(e, "tripSheet.js-fetchEmployeeName()");
		}
	}
	
	
var divElement=document.getElementById("suggestDiv");	
	
function searchEmployeeName(employeeName){
	
	try{
	var userEntry = empNameInput.value;

		//delete old listtag if any
		let childCount = divElement.childElementCount;
		if (childCount > 0) {
			for (let i = 0; i < childCount; i++) {
				divElement.removeChild(divElement.firstChild);
			}
		}

		if (userEntry != "") {
			//change user entry to lower case and compare with driver info array
			var suggestionArr = employeeName.filter(text => text.employeeName.toLowerCase().startsWith(userEntry.toLowerCase()));
			var suggLimit = 7;

			//creating list tag starts
			for (let i = 0; i < suggestionArr.length; i++) {

				divElement.style.display = "block";

				//limit suggestion to 5
				if (i < suggLimit) {
					var listTag = document.createElement("li");
					
					listTag.className = "suggestList";
					listTag.innerText = suggestionArr[i].employeeName + " - " + suggestionArr[i].employeeId+ " - "+ suggestionArr[i].phoneNumber;
				
				//onclick function for list tags	
				listTag.addEventListener("click", function() {

				let employeeDetails = this.innerText.split(" - ");

				//append the value clicked to textbox capitalize first letter
				empNameInput.value = employeeDetails[0].charAt(0).toUpperCase() + employeeDetails[0].slice(1);

				document.getElementById("hide-empDetailId").innerText = suggestionArr[i].employeeDetailId;
				var id = document.getElementById("emp-id");
				var eId = employeeDetails[1];
				id.value = eId;
				
				var number = document.getElementById("emp-phNum");
				var phNum = employeeDetails[2];
				number.value = phNum;
			
				//hide list
				divElement.style.display = "none";

			})

					divElement.appendChild(listTag);
				}
			}
		}


	
document.addEventListener("click", function(e) {

		divElement.style.display = "none";
		empIdBlurFunction();
		empNameBlurFunction();
		phoneNumberBlurFunction();
		dropPointOnblurFunction();
		if(request == "Pickup"){
			locationBlurFunction();
		}
	
})
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-searchEmployeeName(employeeName)");
}
	
}	
		
		
// To employeeName auto fill using EmployeeId search

var emp;
var missmatchEmpId=true;
var urlEmp = pathName+"/bookingInfoService/bookingRequest/adminTripSheet/employeeIdSearch/";
document.getElementById("emp-id").onblur = function() {

	try{
		if (document.getElementById("emp-id").value.trim() !== "") {

			employeeIdTyped();
			empIdBlurFunction();
			}
		else{
			empIdBlurFunction();

		}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-onblur(emp-id)");
	}	
}

function employeeIdTyped() {
	
	try{

		var empId = document.getElementById("emp-id").value;
		emp=createHttpRequest("GET", urlEmp + empId, true,"ADMIN");
		emp.onreadystatechange = processResponseEmpNameAutoFill;
		emp.send(null);

}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-employeeIdTyped()");
}

}
function processResponseEmpNameAutoFill() {
	
	try{

		if (emp.readyState == 4 && emp.status == 200) {

	
			var name = document.getElementById("emp-name");
			var phNo = document.getElementById("emp-phNum");
			if(this.responseText!=""){
				var empName = JSON.parse(this.responseText);
			name.value = empName.employeeName;
			phNo.value = empName.phoneNumber;
			document.getElementById("hide-empDetailId").innerText = empName.employeeDetailId;
			document.getElementById("emp-id").style.borderColor = "lightgrey";
			errorEmpId.innerHTML="";
			empNameBlurFunction();
			missmatchEmpId=true;
			}
			else{
			document.getElementById("emp-id").style.borderColor = "red";
			errorEmpId.innerHTML = "<p style='color: red'>" +
			"Employee not found</p>";
			missmatchEmpId=false;
			return false;
			}

		}
		
		}
		catch(e){
			jsExceptionHandling(e, "tripSheet.js-processResponseEmpNameAutoFill()");
		}
	}

		




// Save button functionality -> Admin books a cab for the employee

var updateFlag = false;
function saveButtonClicked() {
	
try{

		if (updateFlag == false) {
			addNewEmployee();
		}
		else {

			updateEmployeedata();
		}
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-saveButtonClicked()");
}
	
}
var addEmployee;
var addEmpURL = pathName+"/bookingInfoService/bookingRequest/adminTripSheet/addEmployee/" + tripCabId;
var tableData = document.getElementById("tablebody");
var matchCount = 0;
var empMatch = false;
var employeeDetails;
function addNewEmployee() {

try{
		var employeeId = document.getElementById("emp-id").value;
		var employeeName = document.getElementById("emp-name").value;
		var phoneNumber = document.getElementById("emp-phNum").value;
		var dropPoint = document.getElementById("droppoints").value;
		var source = document.getElementById("source").innerHTML;
		var destination = document.getElementById("destination").innerHTML;
		var timeSlotVal = document.getElementById("timeslot").innerHTML;
		var empDetId = document.getElementById("hide-empDetailId").innerText;
		var location = document.getElementById("hideLocationTextBox").value;

		if (document.getElementById('emp-id').value == undefined || document.getElementById('emp-id').value == "") {
			document.getElementById("emp-id").style.borderColor = "red";
			errorEmpId.innerHTML = "<p style='color: red'>" +
				"Employee Id can't Empty</p>";

			return false;
		}
		else {
			errorEmpId.innerHTML = "";
			document.getElementById("emp-id").style.borderColor = "lightgrey";
		}


		if (document.getElementById('emp-name').value == undefined || document.getElementById('emp-name').value == "") {
			document.getElementById("emp-name").style.borderColor = "red";
			errorEmpName.innerHTML = "<p style='color: red'>" +
				"Employee name can't be empty</p>";
			return false;
		}
		else {
			errorEmpName.innerHTML = "";
			document.getElementById("emp-name").style.borderColor = "lightgrey";
		}
		if(document.getElementById('emp-phNum').value == undefined || document.getElementById('emp-phNum').value =="")
		{
			document.getElementById("emp-phNum").style.borderColor = "red";
			errorPhoneNumber.innerHTML = "<p style='color: red'>" +
			"Phone Number can't be empty</p>";
			return false;
		}
		else {
			errorPhoneNumber.innerHTML = "";
			document.getElementById("emp-phNum").style.borderColor = "lightgrey";
		}
		
		if(request == 'Pickup'){
			if(document.getElementById('hideLocationTextBox').value == undefined || document.getElementById('hideLocationTextBox').value =="")
			{
				document.getElementById("hideLocationTextBox").style.borderColor = "red";
				errorLocation.innerHTML = "<p style='color: red'>" +
				"Location can't be empty</p>";
				return false;
			}
			else {
				errorLocation.innerHTML = "";
				document.getElementById("hideLocationTextBox").style.borderColor = "lightgrey";
			}
		}
		var splittedTimeSlot = timeSlotVal.split(":"); //09.30 AM = 09,30 AM
		minute = splittedTimeSlot[1].split(" "); //30,AM
		if (splittedTimeSlot[1].includes("PM")) {


			if (Number(splittedTimeSlot[0]) + 12 == 24) {
				bookingTimeSlot = "12" + ":" + minute[0];
			}
			else {
				splittedTimeSlotHour = Number(splittedTimeSlot[0]) + 12;
				bookingTimeSlot = splittedTimeSlotHour + ":" + minute[0];
			}
		}
		else {

			if (Number(splittedTimeSlot[0]) == 12) {
				bookingTimeSlot = "00" + ":" + minute[0];
			}
			else if (Number(splittedTimeSlot[0]) < 10) {
				bookingTimeSlot = "0" + Number(splittedTimeSlot[0]) + ":" + minute[0];
			}
			else {
				bookingTimeSlot = Number(splittedTimeSlot[0]) + ":" + minute[0];
			}
		}


		var data = {
			"employeeDetailId":empDetId, "employeeId": employeeId, "employeeName": employeeName, "phoneNumber": phoneNumber, "dropPoint": dropPoint, "sourceId":sourceId, "source": source,
			"destinationId":dest, "destination": destination, "timeSlot": bookingTimeSlot, "dateOfTravel": dateOfTravel, "requestType":request, "location":location == ""?null:location
		};

		for (var row = 0; row < tableData.rows.length; row++) {

			var id = document.getElementById("tablebody").rows[row].cells[1].innerHTML;
			if (id == document.getElementById("emp-id").value) {

				matchCount++;
			}
		}
		if (document.getElementById("remainingseats").innerHTML != 0) {
					if (dropPoint != "Select") {
						if(missmatchEmpId){
						addEmployee=createHttpRequest("POST", addEmpURL, true,"ADMIN");
						addEmployee.setRequestHeader("Content-Type", "application/json");
						addEmployee.send(JSON.stringify(data));
						addEmployee.onreadystatechange = processResponseSaveBooking;
						empMatch = false;
						}	
						else{
							document.getElementById("emp-id").style.borderColor = "red";
							errorEmpId.innerHTML = "<p style='color: red'>" +
							"Employee not found</p>";
							return false;
						}
						
						
					}
					else {
						document.getElementById("droppoints").style.borderColor = "red";
			errorDropPoints.innerHTML = "<p style='color: red'>" +
			"Drop Point can't be empty</p>";
			return false;
					}

			}
			else {
			document.getElementById("savebutton").style.borderColor = "red";
			errorEmpDetails.innerHTML = "<p style='color: red'>" +
			"Maximum capacity reached</p>";
				
			}
			
		}
		catch(e){
			jsExceptionHandling(e, "tripSheet.js-addNewEmployee()");
		}

}

function processResponseSaveBooking() {

try{

		if (addEmployee.readyState == 4 && addEmployee.status == 200) {

			var response = this.responseText;
			
        $('#save-employee-details-popup').modal('show');
    	
		}
		

		if (addEmployee.readyState == 4 && addEmployee.status == 232) {
			document.getElementById("savebutton").style.borderColor = "red";
			errorEmpDetails.innerHTML = "<p style='color: red'>" +
			"Employee already assigned to cab</p>";

	}
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-processResponseSaveBooking()");
}
	
}



		
		
// To edit the table data
var bookingId;
function editButtonClicked(row) {

try{
		updateFlag = true;
		var id = row.closest("td").id;
		var rowId = id.replace("td", "");
		var employeeId = document.getElementById("emp-id");
		var employeeName = document.getElementById("emp-name");
		var phNo = document.getElementById("emp-phNum");
		var dropPoint = document.getElementById("Droppoint4" + rowId);

		var editId = document.getElementById("tr" + rowId).getElementsByTagName('td')[2].innerHTML;
		var editName = document.getElementById("tr" + rowId).getElementsByTagName('td')[3].innerHTML;
		var editNum = document.getElementById("tr"+rowId).getElementsByTagName('td')[4].innerHTML;
		var editDrop = document.getElementById("tr" + rowId).getElementsByTagName('td')[5].innerHTML;

		if(request == 'Pickup'){
			bookingId = document.getElementById("tr" + rowId).getElementsByTagName('td')[10].innerHTML;
		}else{
			bookingId = document.getElementById("tr" + rowId).getElementsByTagName('td')[9].innerHTML;
		}

		employeeId.value = editId;
		employeeName.value = editName;
		phNo.value = editNum;
		dropPoint.value = editDrop;

		employeeId.disabled = true;
		employeeName.disabled = true;
		phNo.disabled = true;
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-editButtonClicked(row)");
}

	
}

// To update the edited data
var updateXML;
function updateEmployeedata() {

try{
		updateFlag = false;
		var dropPoint = document.getElementById("droppoints").value;
		if (dropPoint != "Select") {
			
			var url=pathName+"/bookingInfoService/bookingRequest/adminTripSheet/editEmployeeBooking";
			updateXML=createHttpRequest("PUT",url , true,"ADMIN");
			updateXML.setRequestHeader("Content-Type", "application/json");
			if(request == 'Pickup'){
				var location = document.getElementById('hideLocationTextBox').value;
				if(location !="" && location !=undefined){
					var data = { "bookingId": bookingId, "dropPoint": dropPoint, "location": location};
				}
			}
			else{
					var data = { "bookingId": bookingId, "dropPoint": dropPoint};
				} 
				updateXML.onreadystatechange = processResponseUpdateBooking;
				updateXML.send(JSON.stringify(data));
		}
		else {
			document.getElementById("droppoints").style.borderColor = "red";
	errorDropPoints.innerHTML = "<p style='color: red'>" +
			"Drop Point can't be<br> empty</p>";
		return false;
		}
		
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-updateEmployeedata()");
}
	
}

function processResponseUpdateBooking() {

try{
		if (updateXML.readyState == 4 && updateXML.status == 200) {
			window.location.reload();
	}
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-processResponseUpdateBooking()");
	}

}

	
	
// To delete a table data
var bookId;
var deleteRow;
function deleteButtonClicked(row) {
	
try{
		var id = row.closest("td").id;
		var rowId = id.replace("td", "");
		if(request == 'Drop'){
			bookId = document.getElementById("tr" + rowId).getElementsByTagName('td')[9].innerHTML;
		}
		else{
			bookId = document.getElementById("tr" + rowId).getElementsByTagName('td')[10].innerHTML;
		}
		deleteRow = document.getElementById("tr" + rowId);
}
catch(e){
	jsExceptionHandling(e, "tripSheet.js-deleteButtonClicked(row)");
}
	
}

var deleteXML;
var yesButton = document.getElementById("yes");
yesButton.onclick = function() {
	try{
		var url=pathName+"/bookingInfoService/bookingRequest/adminTripSheet/deleteEmployeeBooking/" + bookId;
		deleteXML=createHttpRequest("PUT", url, true,"ADMIN");
		deleteXML.setRequestHeader("Content-Type", "application/json");
		deleteXML.send();
		deleteXML.onreadystatechange = processResponseDeleteBooking;
		}
		catch(e){
			jsExceptionHandling(e, "tripSheet.js-onclick(yes)");
		}

}

function processResponseDeleteBooking() {

try{
		if (deleteXML.readyState == 4 && deleteXML.status == 200) {

			deleteRow.remove();
			var table = document.getElementById("tablebody");

			
			if (table.rows.length == 1) {
		

				var noEmployeeXhr;
				var url=pathName+"/bookingInfoService/bookingRequest/adminOngoingSheet/updateEndTime/" + tripCabId;
				noEmployeeXhr=createHttpRequest("PUT",url , true,"ADMIN");
				noEmployeeXhr.send();
				noEmployeeXhr.onreadystatechange = function() {
					if (noEmployeeXhr.readyState == 4 && noEmployeeXhr.status == 200) {
						window.location.href = "/admin/dashboard";
					}

				};
			}
			window.location.reload();
		}
		}
		catch(e){
			jsExceptionHandling(e, "tripSheet.js-processResponseDeleteBooking()");
		}
			

}
	
// clear button clicked 
function clearButtonClicked(){
	
	try{
	document.getElementById("emp-id").value="";
	document.getElementById("emp-name").value="";
	document.getElementById("emp-phNum").value = "";
	var dropPoint=document.getElementById("droppoints");
	dropPoint.value="";
	var locationValue = document.getElementById("hideLocationTextBox");
	locationValue.value = "";
	dropPoint.selectedIndex=0;
	var employeeId = document.getElementById("emp-id");
	var employeeName = document.getElementById("emp-name");
	var phNo = document.getElementById("emp-phNum");
	employeeId.disabled = false;
	employeeName.disabled = false;
	phNo.disabled = false;
	
	//jawahar added
	document.getElementById("errorEmpDetails").innerHTML="";
	//jawahar added
	}
	catch(e){
		jsExceptionHandling(e, "tripSheet.js-clearButtonClicked()");
	}
}



/* --------------------------------------------------------------------------------------------------------------------------------- */

function showUpdate(){
	
	try{						
							var tableBody = document.getElementById("tablebody");
							var noShowCount = 0;
							var showCount=0;
							for (var row = 0; row < tableBody.rows.length - 1; row++) {

							var dropValue=document.getElementById("Droppoint4"+(row)).selectedOptions[0].innerHTML;
							if(dropValue=="Show"){
								errorStartTrip.innerHTML = "";
								showCount++;
								}
								else{
									noShowCount++;
								}
						}

							if (showCount > 0) {
								document.getElementById("noOneShow").style.display="none";
								document.getElementById("startTrip").style.display="block";
								
								
								}
								else {
									
									document.getElementById("noOneShow").style.display="block";
									document.getElementById("startTrip").style.display="none";
									errorStartTrip.innerHTML="";
									}
							}
				catch(e){
					
					jsExceptionHandling(e, "tripSheet.js-showUpdate()");
				}			
	
	}
	
//var timeOut = setInterval(function() {
//	getTripSheet();
//  	
//}, 60000);
var timeOut;
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === 'visible') {
		timeOut =  setInterval(
			getTripSheet, 60000);
	}else{
		clearInterval(timeOut);
	}
});

