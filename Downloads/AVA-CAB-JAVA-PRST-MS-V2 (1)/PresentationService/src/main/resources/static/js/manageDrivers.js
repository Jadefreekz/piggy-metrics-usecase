var xhrDriverCount;
var xhrDriverDetails;
var xhrSaveDriverDetails;
var xhrDriverNumber;
var xhrLicenseNumber;
var xhrDeleteDriverDetails;

var deleteDriver;
var deleteId;
var deleterow;
var rowCounter;
var index;
var pages;
var editingId;
var editingRow;
var driverId;
var noRecordDrivers = "<h5 class = noRecordsFound>No Records Found </h5>";
var limit;
var totalCount;
var licenseNumber;
var driverNumber;
var date = new Date();
var month = (date.getMonth() + 1);
var day = date.getDate();
var licenseNumberDuplicityCheck;
var duplicateLicense = false;
var savingNewRecord = true;

var errorLicExpDate = document.getElementById("errorLicExpDate");
var errorLicNum = document.getElementById("errorLicNum");
var errorDriverNumber = document.getElementById("errorDriverNumber");
var errorDriverName = document.getElementById("errorDriverName");

var manageDriversClicked;
var manageCabsClicked;
var assignedCabsClicked;
var todaysRequestClicked;

//On load function to navigate to the current page//
window.onload = tabSwitching;
function tabSwitching(){
	try{
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
		jsExceptionHandling(e, "manageDrivers.js-tabSwitching()");
	}
}
//End of navigation method//


//onLoad of the manage drivers tab get the total count of records//
document.getElementById("pills-managedriver-tab").addEventListener('click', getDriverCount);
	function getDriverCount(){
		
		try {
	location.href = "/admin/dashboard#pills-managedriver";

	//ajax call to get the total count//
	xhrDriverCount = createHttpRequest("GET", pathName + "/manage/drivers/totalCount", true, "ADMIN");  //Path for getting the total number of records
	xhrDriverCount.onreadystatechange = getNoOfDriverRecords;                        //Calls the method to get total count
	xhrDriverCount.send(null);
	
	}
	
	catch(e) {
		
		jsExceptionHandling(e, "manageDrivers.js-getDriverCount()");
	}

	}

//Method to get total count//
function getNoOfDriverRecords() {
	
	try {
	if (xhrDriverCount.readyState == 4 && xhrDriverCount.status == 200) {
		
		limit = xhrDriverCount.getResponseHeader("limit");						//Gets the limit from the back end
		totalCount = JSON.parse(xhrDriverCount.responseText);

		pages = Math.ceil(totalCount / limit);                                    //To get the total pages count

		if (totalCount == 0) {
			document.getElementById('noRecordDriver').innerHTML = noRecordDrivers;    //If no records founds

		}
		else {
			
			createPagination(pages, 1);                                           //Calls the method to perform pagination
		}
	}
	
	}
	
	catch(e) {
		
		jsExceptionHandling(e, "manageDrivers.js-getNoOfDriverRecords()");
	}
}

//Method to get the driver details by dynamic row creation//
function getDriverDetails(index) {

try{
	xhrDriverDetails = createHttpRequest("GET", pathName + "/manage/drivers/driverDetails/" + index, true, "ADMIN");     //Path for getting the driver details with the index
	xhrDriverDetails.onreadystatechange = driverInfoProcessResponse;
	xhrDriverDetails.send(null);
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-getDriverDetails(index)");
	}

	function driverInfoProcessResponse() {
		try{
		if (xhrDriverDetails.readyState == 4 && xhrDriverDetails.status == 200) {				

			var arr = JSON.parse(xhrDriverDetails.responseText);								//Gets the driver details
			rowCounter = 0;

			$("#driver-info").empty();

			for (var i = 0;i<arr.length; i++) {
				//Dynamic creation of rows and datas//

				var trow = document.createElement('tr');
				trow.className = "row-bg-style";       // addingStyle class
				trow.id = "trDriver" + rowCounter++;

				var divObjName = document.createElement('td');
				divObjName.className = "spacing";
				divObjName.id = "tdname" + i;

				var divObjNumber = document.createElement('td');
				divObjNumber.className = "spacing";
				divObjNumber.id = "tdnumber" + i;

				var divObjLicNum = document.createElement('td');
				divObjLicNum.className = "spacing";
				divObjLicNum.id = "tdlicense" + i;

				var divObjExpDate = document.createElement('td');
				divObjExpDate.className = "spacing";
				divObjExpDate.id = "tdexpiry" + i;

				var divObjEditDelete = document.createElement('td');
				divObjEditDelete.className = "spacing text-center";
				divObjEditDelete.id = "tdeditdel" + i;

				var divObjId = document.createElement('td');
				divObjId.className = "spacing";
				divObjId.id = "tdid" + i;

				divObjName.innerText = arr[i].driverName;
				divObjNumber.innerText = arr[i].driverNumber;
				divObjLicNum.innerText = arr[i].licenseNumber;
				divObjExpDate.innerText = formattedDate(arr[i].licenseExpiryDate, 1);
				divObjEditDelete.innerHTML = "<a href='#' title='Edit' class='actions-image'><img class ='edit-new' src='images/edit_grid.svg' alt='edit-icon' onclick='editDriverData(this)'/></a><a href='#' title='Delete' class='actions2-image'><img class ='delete-new' src='images/bin_grid.svg' onclick='deleteDriverData(this)' alt='delete-icon' data-toggle='modal' data-target='#manage-driver-pop' /></a>";
				divObjId.innerText = arr[i].driverId;

				divObjId.style.display = "none";

				trow.appendChild(divObjName);
				trow.appendChild(divObjNumber);
				trow.appendChild(divObjLicNum);
				trow.appendChild(divObjExpDate);
				trow.appendChild(divObjEditDelete);
				trow.appendChild(divObjId);

				document.getElementById("driver-info").appendChild(trow);
			//For getting the display of record count 
			var countDisplay=document.getElementById("driverDisplayCount");
			countDisplay.innerHTML="#Records: "+$('#driver-info tr').length+" out of "+totalCount;
			}
			
		}
	
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-driverInfoProcessResponse()");
	}
	}

}


//Method to perform pagination//
function createPagination(pages, index) {
	try{
	getDriverDetails(index - 1);              //Calls the method get driver details. When index 1 is clicked, then performs index-1 = 0 and loads the first set of records

	let str = '<ul class= "ul-tag">';

	let active;
	let previousButton = index - 1;
	let nextButton = index + 1;


	if (index > 1) {         //When index is > 1 then, shows the previous arrow

		str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, ' + (index - 1) + ')"><img src="images/pagination-prev-arrow.svg"  /></a></li>';

	}
	if (pages < 6) {          //Sets the active page and increments the pages based on the total records and limit
		for (let p = 1; p <= pages; p++) {
			active = index == p ? "active" : "no";
			str += '<li class="' + active + '" ><a class="page-link pagination-border a-tag" onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
		}
	}

	else {
		if (index > 2) {	 //Sets 1 as active 
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, 1)">1</a></li>';
			if (index > 3) { //Sets ... after the index of 4
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (index - 2) + ')">...</a></li>';
			}
		}


		if (index === 1) {      //Conditions for where the ... should be displayed before the next
			nextButton += 2;
		} else if (index === 2) {
			nextButton += 1;
		}

		if (index === pages) {  //Conditions for where the ... should be displayed after the previous
			previousButton -= 2;
		} else if (index === pages - 1) {
			previousButton -= 1;
		}

		for (let p = previousButton; p <= nextButton; p++) {
			if (p === 0) {
				p += 1;
			}
			if (p > pages) {
				continue
			}
			active = index == p ? "active" : "no";
			str += '<li class="page-item ' + active + '"><a class="page-link pagination-border" onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
		}

		if (index < pages - 1) {
			if (index < pages - 2) {
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (index + 2) + ')">...</a></li>';
			}
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, pages)">' + pages + '</a></li>';
		}
	}
	if (index < pages) {
		str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, ' + (index + 1) + ')"><img src="images/pagination-next-arrow.svg" alt="page-arrow"  /></a></li>';
	}
	str += '</ul>';

	document.getElementById('pagination').innerHTML = str;
	return str;
}
catch(e){
	jsExceptionHandling(e, "manageDrivers.js-createPagination(pages, index)");
}
}
//End of the method//

//This method is used to display an alert message when driver name is left empty//
function nameBlurFunction() {

	try{
	//Empty field check for driver name//
	var driverName = document.getElementById('dri-name').value;
	const namePattern = new RegExp("^[a-zA-Z ]+$");
	var namePatternTrue = namePattern.test(driverName);
	if (document.getElementById('dri-name').value == undefined || document.getElementById('dri-name').value == "") {
		document.getElementById("dri-name").style.borderColor = "red";

		errorDriverName.innerHTML = "<p style='color: red'>" +
			"*Required</p>";

		return false;
	}
	else {
		errorDriverName.innerHTML = "";
		document.getElementById("dri-name").style.borderColor = "lightgrey";
		
		if(!namePatternTrue){
			
			document.getElementById("dri-name").style.borderColor = "red";

		errorDriverName.innerHTML = "<p style='color: red'>" +
			"*Invalid</p>";

		return false;
		}
		else{
			
			errorDriverName.innerHTML = "";
		document.getElementById("dri-name").style.borderColor = "lightgrey";
		
		return true;
		
		}
		
	}
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-nameBlurFunction()");
	}
}
//End of the method//

//This method is used to display an alert message when driver number is left empty//
function numberBlurFunction() {

	try{
	driverNumber = document.getElementById('dri-num').value;
	const phNumPattern = new RegExp("^[0-9]+$");
	var numPatternTrue = phNumPattern.test(driverNumber);

	//Checks empty fields for driver number//
	if (document.getElementById('dri-num').value == undefined || document.getElementById('dri-num').value == "") {
		document.getElementById("dri-num").style.borderColor = "red";
		errorDriverNumber.innerHTML = "<p style='color: red'>" +
			"*Required</p>"
		return false;
	}
	else {

		errorDriverNumber.innerHTML = "";
		document.getElementById("dri-num").style.borderColor = "lightgrey";
		
		//Checks whether the entered number has only digits//
		if (!numPatternTrue){
			document.getElementById("dri-num").style.borderColor = "red";
			errorDriverNumber.innerHTML = "<p style='color: red'>" +
				"*Invalid</p>";
			return false;
				
		}

		else {

			errorDriverNumber.innerHTML = "";
			document.getElementById("dri-num").style.borderColor = "lightgrey";
			
			//Checks whether the entered number length is 10//
			if (driverNumber.length != 10){

				document.getElementById("dri-num").style.borderColor = "red";
				errorDriverNumber.innerHTML = "<p style='color: red'>" +
					"*Invalid</p>";
				return false;	

			}
			else {

				errorDriverNumber.innerHTML = "";
				document.getElementById("dri-num").style.borderColor = "lightgrey";
				driverNumberCheck();
				if(duplicateDriverNumber == true){
					return true;
				}
				else{
					return false;
				}
				
			}

		}

	}
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-numberBlurFunction()");
	}
	
}
var driverNumberDuplicityCheck;
var duplicateDriverNumber = false;
//Method to check whether the driver number already exists//
function driverNumberCheck(){
	try{
				xhrDriverNumber = createHttpRequest("GET", pathName + "/manage/drivers/driverNumber/" + driverNumber+"/"+driverId, true, "ADMIN");
				xhrDriverNumber.onreadystatechange = function(){
					if (xhrDriverNumber.readyState == 4 && xhrDriverNumber.status == 590) {
						duplicateDriverNumber = false;
    	driverNumberDuplicityCheck = xhrDriverNumber.responseText;
		//already exists
		document.getElementById("dri-num").style.borderColor = "red";
		errorDriverNumber.innerHTML = "<p style='color: red'>" +
			"*Already exits</p>";
			 
		return false;

	}

	if (xhrDriverNumber.readyState == 4 && xhrDriverNumber.status == 200) {
		duplicateDriverNumber = true;
		errorDriverNumber.innerHTML = "";
		document.getElementById("dri-num").style.borderColor = "lightgrey";
		
		return true;
		
	}
				};
				xhrDriverNumber.send(null);
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-driverNumberCheck()");
	}
	
}
//End of the method//

//This method is used to display an alert message when license number is left empty//
function licBlurFunction() {
  
  try{
	licenseNumber = document.getElementById('lic-num').value;
	//Checks empty fields for license number//
	if (document.getElementById('lic-num').value == undefined || document.getElementById('lic-num').value == "") {
		document.getElementById("lic-num").style.borderColor = "red";
		errorLicNum.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		return false;
	}
	else {
		errorLicNum.innerHTML = "";
		document.getElementById("lic-num").style.borderColor = "lightgrey";
		licenseNumberCheck();
		if(duplicateLicense == true){
			return true;
		}
		else{
			return false;
		}
	} 
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-licBlurFunction()");
	}
}

//Method to check whether the license number already exists//
function licenseNumberCheck(){
	try{
		xhrLicenseNumber = createHttpRequest("GET", pathName + "/manage/drivers/licenseNumber/" + licenseNumber+"/"+driverId, true, "ADMIN");
		xhrLicenseNumber.onreadystatechange = function(){
			if (xhrLicenseNumber.readyState == 4 && xhrLicenseNumber.status == 591) {
		duplicateLicense = false;
		licenseNumberDuplicityCheck = xhrLicenseNumber.responseText;
		//already exists
		document.getElementById("lic-num").style.borderColor = "red";
		errorLicNum.innerHTML = "<p style='color: red'>" +
			"*Already exits</p>";
			 
			return false;

	}

	if (xhrLicenseNumber.readyState == 4 && xhrLicenseNumber.status == 200) {
		duplicateLicense = true;
		errorLicNum.innerHTML = "";
		document.getElementById("lic-num").style.borderColor = "lightgrey";
	
		return true;
	}
		};
		xhrLicenseNumber.send(null);	
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-licenseNumberCheck()");
	}
}
//End of the method//

//This method is used to display an alert message when license expiry date is left empty//
function licExpBlurFunction() {
	//Check empty fields for expiry date//

	try{
	if (document.getElementById('lic-exp-date').value == undefined || document.getElementById('lic-exp-date').value == "") {
		document.getElementById("lic-exp-date").style.borderColor = "red";
		errorLicExpDate.innerHTML = "<p style='color: red'>" +
			"*Required</p>";

		return false;
	}
	else {
		errorLicExpDate.innerHTML = "";
		document.getElementById("lic-exp-date").style.borderColor = "lightgrey";

		//Checks whether the expiry date is invalid//
		if (document.getElementById('lic-exp-date').value < currentDate) {

			document.getElementById("lic-exp-date").style.borderColor = "red";
			errorLicExpDate.innerHTML = "<p style='color: red'>" +
				"*Invalid</p>";

			return false;
		}
		else {
			errorLicExpDate.innerHTML = "";
			document.getElementById("lic-exp-date").style.borderColor = "lightgrey";
			return true;
		}
		
	}
}
catch(e){
	jsExceptionHandling(e, "manageDrivers.js-licExpBlurFunction()");
}
}
//End of the method//

//This method is used to disable the save image if any of the fileds are left empty//
function disable(){
	try{
if(nameBlurFunction() && numberBlurFunction() && licBlurFunction() && licExpBlurFunction()){
	
	return true;
}
else{
	return false;
}
}
catch(e){
	jsExceptionHandling(e, "manageDrivers.js-disable()");
}
}
//End of method//

//This method is used to save the driver details//
function saveDriverDetails() {

	//Gets the values 
try{
	var driverName = document.getElementById('dri-name').value.trim();
	var driverNumber = document.getElementById('dri-num').value;
	var licenseNumber = document.getElementById('lic-num').value;
	var licenseExpiryDate = document.getElementById('lic-exp-date').value;
if(disable()){
	if (savingNewRecord) {

		//ajax call to save the driver details
		xhrSaveDriverDetails = createHttpRequest("POST", pathName + "/manage/drivers/saveDriverDetails", true, "ADMIN");    //Path to save the driver details

		var data = {
			"driverName": driverName, "driverNumber": driverNumber,
			"licenseNumber": licenseNumber, "licenseExpiryDate": licenseExpiryDate
		};
		xhrSaveDriverDetails.onreadystatechange = saveDriverInfoProcessResponse;
	}

	else {

		xhrSaveDriverDetails = createHttpRequest("PUT", pathName + "/manage/drivers/editDriverDetails/" + driverId, true, "ADMIN");    //Path to edit driver details

		var data = {
			"driverId": driverId, "driverName": driverName, "driverNumber": driverNumber,
			"licenseNumber": licenseNumber, "licenseExpiryDate": licenseExpiryDate
		};
		
		xhrSaveDriverDetails.onreadystatechange = updateDriverInfoProcessResponse;

	}
	}
	else{
		nameBlurFunction();
		numberBlurFunction();
		licBlurFunction();
		licExpBlurFunction();
		document.getElementById('save').pointerEvents = "none";
	}

	xhrSaveDriverDetails.setRequestHeader("Content-Type", "application/json");
	xhrSaveDriverDetails.send(JSON.stringify(data));
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-saveDriverDetails()");
	}

}

function saveDriverInfoProcessResponse() {

try{
	if (xhrSaveDriverDetails.readyState == 4 && xhrSaveDriverDetails.status == 200) {

		var response = xhrSaveDriverDetails.responseText;

		$('#save-manage-drivers-popup').modal('show');
		
		//To get the data saved
		
		$("#driver-info").empty();
		document.getElementById('noRecordDriver').innerHTML = "";		
		functionClear();
		getDriverCount();
	
	}
	}
catch(e){
	jsExceptionHandling(e, "manageDrivers.js-saveDriverInfoProcessResponse()");
}
}
//End of the method//

//To clear the data entered in the text fields//
function functionClear() {

try{
	document.getElementById("dri-name").value = "";
	document.getElementById("dri-num").value = "";
	document.getElementById("lic-num").value = "";
	document.getElementById("lic-exp-date").value = "";
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-functionClear()");
	}

}
//End of the method//

//Makes the saved details to editable format//
function editDriverData(row){
	
try{
		
	savingNewRecord = false;

    editingId = row.closest("td").id;

    var countingEdit = editingId.replace("tdeditdel","");

    editingRow = document.getElementById("trDriver"+countingEdit);

    var name = editingRow.getElementsByTagName("td")[0].innerHTML;
    var driverNumber = editingRow.getElementsByTagName("td")[1].innerHTML;
    var license = editingRow.getElementsByTagName("td")[2].innerHTML;
    var expiry = editingRow.getElementsByTagName("td")[3].innerHTML;
    driverId = editingRow.getElementsByTagName("td")[5].innerHTML;

    document.getElementById("dri-name").value = name;
    document.getElementById("dri-num").value = driverNumber;
    document.getElementById("lic-num").value = license;
    document.getElementById("lic-exp-date").value = formattedDate(expiry,1);
    
    nameBlurFunction();
    numberBlurFunction();
 	licBlurFunction();
 	licExpBlurFunction();
 	}
 	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-editDriverData(row)");
}
	
}
//End of the method//

//Updates the driver details//
function updateDriverInfoProcessResponse(){
	
	try{
	if(xhrSaveDriverDetails.readyState == 4 && xhrSaveDriverDetails.status == 200){

        var response = xhrSaveDriverDetails.reponseText;
       
        $('#save-manage-drivers-popup').modal('show');
       
       	$("#driver-info").empty();
       	functionClear();
       	getDriverCount();
       
	}
	}
	catch(e){
		jsExceptionHandling(e, "manageDrivers.js-updateDriverInfoProcessResponse()");
	}
}
//End of the method//

//Deletes the driver details//
function deleteDriverDetails(){
	
	try{
	xhrDeleteDriverDetails = createHttpRequest("PUT",pathName+"/manage/drivers/deleteDriverDetails/"+deleteDriver,true, "ADMIN");
    xhrDeleteDriverDetails.setRequestHeader("Content-Type","application/json");
    
	var driverName = document.getElementById('dri-name').value.trim();
	var driverNumber = document.getElementById('dri-num').value;
	var licenseNumber = document.getElementById('lic-num').value;
	var licenseExpiryDate = document.getElementById('lic-exp-date').value;
	
	var data = {
			"driverId": driverId, "driverName": driverName, "driverNumber": driverNumber,
			"licenseNumber": licenseNumber, "licenseExpiryDate": licenseExpiryDate
		};
	xhrDeleteDriverDetails.send(JSON.stringify(data));
	

    xhrDeleteDriverDetails.onreadystatechange = deleteDriverInfoProcessResponse;
    }
    catch(e){
		jsExceptionHandling(e, "manageDrivers.js-deleteDriverDetails()");
}

}
function deleteDriverInfoProcessResponse(){
	
	try{
	if(xhrDeleteDriverDetails.readyState == 4 && xhrDeleteDriverDetails.status == 200){

        var response = xhrDeleteDriverDetails.responseText;

        deleterow.remove();
		$("#driver-info").empty();
       	
       	getDriverCount();

    }
    
    if(xhrDeleteDriverDetails.readyState == 4 && xhrDeleteDriverDetails.status == 593){
	$('#delete-manage-cabs-popup').modal('show');
		$("#driver-info").empty();
       	functionClear();
       	getDriverCount();
	
}
    }
    catch(e){
		jsExceptionHandling(e, "manageDrivers.js-deleteDriverInfoProcessResponse()");
}
}	

function deleteDriverData(row){
	
	try{
		
	deleteId = row.closest("td").id;

    var counters = deleteId.replace("tdeditdel","");

    deleterow = document.getElementById("trDriver"+counters);

    deleteDriver = deleterow.getElementsByTagName("td")[5].innerHTML;
    }
    catch(e){
		jsExceptionHandling(e, "manageDrivers.js-deleteDriverData(row)");
}
    
	
}	


//End of the method//

//Method to change the date format//
function formattedDate(date, option){
	
	try {
		
    var array = date.split("-");

    if(option ==1)
        var formatedDate = array[2] + "-" + array[1] + "-" + array[0];
    else if(option==2) //dd-mm-yyyy
        var formatedDate = array[1] + "-" + array[0] + "-" + array[2];
    return formatedDate;
    
    }
    
    catch(e) {
		jsExceptionHandling(e, "manageDrivers.js-formattedDate(date, option)");
    }

}
//End of the method//

//This is used to disable the dates in the expiry date field//
if (month < 10) {
	month = "0" + month;
}
if (day < 10) {
	day = "0" + day;
}
var currentDate = (date.getFullYear()) + "-" + month + "-" + day;

document.getElementById("lic-exp-date").setAttribute('min', currentDate);
//End of the method//


