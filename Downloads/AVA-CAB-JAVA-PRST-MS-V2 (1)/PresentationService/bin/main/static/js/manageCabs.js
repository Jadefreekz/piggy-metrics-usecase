var xhrCabCount;
var xhrCabDetails;
var xhrCabModels;
var xhrCabNumber;
var xhrInsuranceNumber;
var xhrSaveCabDetails;
var xhrDriverInfo;
var xhrDeleteCabDetails;
var xhrCabNumberIsActive;

var pages;
var index;
var cabModels;
var editId;
var editRow;
var driver;
var driverId;
var delCab;
var deleteRow;
var delId;
var getDriverId;
var capitalizedCabModel;
var dropDownOption;
var driverDetails;
var totalCount;
var userEntry;
var cabNumber;
var insuranceNumber;
var cabNumberDuplicityCheck;
var duplicateCab = false;
var duplicateInsurance = false;
var insuranceNumDuplicityCheck;
var savingNewRecord = true;

var date = new Date();
var month = (date.getMonth() + 1);
var day = date.getDate();

var noRecordCabs = "<h5 class = noRecordsFound>No Records Found </h5>";

var errorDropDown = document.getElementById("modelDropdownError");
var errorCabNum = document.getElementById("errorCabNum");
var errorNoSeat = document.getElementById("noSeatsEmpty");
var errorInsNum = document.getElementById("InsNumError");
var errorInsExpDate = document.getElementById("InsExpDateError");
var errorDriName = document.getElementById("DrivNameError");
var errorAddCabModel = document.getElementById("addCabModelError");

var manageDriversClicked;
var manageCabsClicked;
var assignedCabsClicked;
var todaysRequestClicked;

//On load function to navigate to the current page//
window.onload = tabSwitchCabs;

function tabSwitchCabs(){
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
		jsExceptionHandling(e, "manageCabs.js-tabSwitchCabs()");
	}
	}
	
//End of navigation method//

//Method to get total count on load//
document.getElementById("pills-managecab-tab").addEventListener('click',getCabCount());
function getCabCount(){
	try{
	
	xhrCabCount = createHttpRequest("GET", pathName + "/manage/cabs/totalCabCount", true, "ADMIN"); //ajax call
	xhrCabCount.onreadystatechange = getNoOfCabRecords;
	xhrCabCount.send(null);
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-getCabCount()");
	}
	
}

//Gets the total number of records//
function getNoOfCabRecords(){

try{	
	if(xhrCabCount.readyState == 4 && xhrCabCount.status == 200){
		var limit = xhrCabCount.getResponseHeader("limit");    //Gets the limit from the back end
		
		totalCount = JSON.parse(xhrCabCount.responseText);      //To get the total pages count
		
		pages = Math.ceil(totalCount/limit);   //To perform pagination
		
		if(totalCount == 0) {
			
			document.getElementById('noRecordCab').innerHTML = noRecordCabs;    //If no records found
		}
		else{
						
			createCabPagination(pages, 1);                                      //Calls the method to perform pagination
			
		}
	}
}
catch(e){
	jsExceptionHandling(e, "manageCabs.js-getNoOfCabRecords()");
}
}
//End of the method//

//Method to get cab details//
function getCabDetails(index){
	
try{	
	xhrCabDetails = createHttpRequest("GET", pathName+"/manage/cabs/cabDetails/"+index, true, "ADMIN");  //ajax call
	xhrCabDetails.onreadystatechange = cabInfoProcessResponse;
	xhrCabDetails.send(null);
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-getCabDetails(index)");
	}
	}
	function cabInfoProcessResponse(){
		
		try{
		if(xhrCabDetails.readyState == 4 && xhrCabDetails.status == 200){
        
        	$("#cab-info").empty();                                  
        	var arr = JSON.parse(xhrCabDetails.responseText);        //Gets the cab details

        	rowCounter = 0;
        
        //Dynamic creation of rows and columns//
        
        	for (var i = 0;i<arr.length; i++) {
				
			var trow=document.createElement('tr');
            trow.className="row-bg-style";                    // addingStyle class
            trow.id = "tr" + rowCounter++;

            var divObjModel = document.createElement('td');
            divObjModel.className="py-3 spacing";
            divObjModel.id = "tdmodel" + i;

            var divObjCabNo = document.createElement('td');
            divObjCabNo.className="py-3 spacing";
            divObjCabNo.id = "tdcabnum" + i;

            var divObjSeats = document.createElement('td');
            divObjSeats.className="py-3 spacing";
            divObjSeats.id = "tdseats" + i;

            var divObjInsNo = document.createElement('td');
            divObjInsNo.className="py-3 spacing";
            divObjInsNo.id = "tdinsnum" + i;

            var divObjExpDate = document.createElement('td');
            divObjExpDate.className="py-3 spacing";
            divObjExpDate.id = "tdexpdate" + i;

            var divObjDriverName = document.createElement('td');
            divObjDriverName.className="py-3 spacing";
            divObjDriverName.id = "tddrivename" + i;
            
            var divObjStatus = document.createElement('td');
            divObjStatus.id = "tdStatus" + i;
            divObjStatus.className = "py-3 spacing";
            if(arr[i].active == true){
				divObjStatus.innerHTML = "<td class='spacing'><div class='form-check form-switch' id = 'button-1'><input class='form-check-input' type='checkbox' id='status" + i + "' checked onclick ='changeStatus(this)'><label class='form-check-label' for='flexSwitchCheckDefault'></label></div></td>"
			}
			else{
				divObjStatus.innerHTML =  "<td class='spacing'><div class='form-check form-switch' id = 'button-1'><input class='form-check-input' type='checkbox' id='status" + i + "' unchecked onclick ='changeStatus(this)'><label class='form-check-label' for='flexSwitchCheckDefault'></label></div></td>"
			}

            var divObjEditDel = document.createElement('td');
            divObjEditDel.className="py-3 text-center spacing";
            divObjEditDel.id = "tdeditdelete" + i;

            var divObjId = document.createElement('td');
            divObjId.className="py-3 spacing";
            divObjId.id = "tdDid" + i;
            
            divObjModel.innerText = arr[i].cabModel;
            divObjCabNo.innerText = arr[i].cabNumber;
            divObjSeats.innerText = arr[i].totalSeats;

            divObjInsNo.innerText = arr[i].insuranceNumber;
            divObjExpDate.innerText = formatDate(arr[i].insuranceExpiryDate,1);
            divObjDriverName.innerText = arr[i].driverName;
            divObjEditDel.innerHTML="<a href='#' title='Edit' class='actions-image'><img class ='edit-new' src='images/edit_grid.svg' alt='edit-icon' onclick='editData(this)'/></a><a href='#' title='Delete' class='actions2-image'><img class ='delete-new' src='images/bin_grid.svg' onclick='deleteData(this)' alt='delete-icon' data-toggle='modal' data-target='#manage-pop' /></a>";
            divObjId.innerText=arr[i].driverId;

            divObjId.style.display="none";
            
            trow.appendChild(divObjModel);
            trow.appendChild(divObjCabNo);
            trow.appendChild(divObjSeats);
            trow.appendChild(divObjInsNo);
            trow.appendChild(divObjExpDate);
            trow.appendChild(divObjDriverName);
             trow.appendChild(divObjStatus);
            trow.appendChild(divObjEditDel);
            trow.appendChild(divObjId);
            
            document.getElementById("cab-info").appendChild(trow);
	
        	}
        	//For getting the display of record count
        	var countDisplay=document.getElementById("displayCount");
			countDisplay.innerHTML= "#Records: " +$('#cab-info tr').length+" out of "+totalCount;
		}
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-cabInfoProcessResponse()");
	}
	
	}	

//Method to perform pagination//
function createCabPagination(pages, index){
	
	try{
	getCabDetails(index-1);
	
	let str = '<ul class= "ul-tag">';

	let active;
	let previousButton = index - 1;
	let nextButton = index + 1;


	if (index > 1) {         //When index is > 1 then, shows the previous arrow

		str += '<li class="page-item"><a class="page-link pagination-border" onclick="createCabPagination(pages, ' + (index - 1) + ')"><img src="images/pagination-prev-arrow.svg"  /></a></li>';

	}
	if (pages < 6) {          //Sets the active page and increments the pages based on the total records and limit
		for (let p = 1; p <= pages; p++) {
			active = index == p ? "active" : "no";
			str += '<li class="' + active + '" ><a class="page-link pagination-border a-tag" onclick="createCabPagination(pages, ' + p + ')">' + p + '</a></li>';
		}
	}

	else {
		if (index > 2) {	 //Sets 1 as active 
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createCabPagination(pages, 1)">1</a></li>';
			if (index > 3) { //Sets ... after the index of 4
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createCabPagination(pages,' + (index - 2) + ')">...</a></li>';
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
			//To make the current page active
			active = index == p ? "active" : "no";
			str += '<li class="page-item ' + active + '"><a class="page-link pagination-border" onclick="createCabPagination(pages, ' + p + ')">' + p + '</a></li>';
		}

		if (index < pages - 1) {
			if (index < pages - 2) {
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createCabPagination(pages,' + (index + 2) + ')">...</a></li>';
			}
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createCabPagination(pages, pages)">' + pages + '</a></li>';
		}
	}
	if (index < pages) {
		str += '<li class="page-item"><a class="page-link pagination-border" onclick="createCabPagination(pages, ' + (index + 1) + ')"><img src="images/pagination-next-arrow.svg" alt="page-arrow"  /></a></li>';
	}
	str += '</ul>';

	document.getElementById('cabPagination').innerHTML = str;
	return str;
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-createCabPagination(pages, index)");
	}
	
}
//End of the method//

//This method is used to get all the cab models on load//
document.getElementById("pills-managecab-tab").addEventListener('click',function(){
	try{
		location.href = "/admin/dashboard#pills-managecab";
	xhrCabModels = createHttpRequest("GET", pathName+"/manage/cabs/cabModels", true, "ADMIN");     //ajax call
	xhrCabModels.onreadystatechange = cabModelProcessResponse;
	xhrCabModels.send();
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-addEventListener(click(pills-managecabs-tab))");
	}
	
});

function cabModelProcessResponse(){
	
	try{
		
	if(xhrCabModels.readyState == 4 && xhrCabModels.status == 200){
        var cabModelList= document.getElementById("cab-Model-Dropdown");

        var length = cabModelList.options.length;

        for (i = length-1; i > 0; i--) { 				
            cabModelList.options[i] = null;
        }

        cabModels = JSON.parse(xhrCabModels.responseText);
		
		for(var key in cabModels){								
			
			var opt = document.createElement("option");
			opt.innerHTML = key;
			document.getElementById("cab-Model-Dropdown").options.add(opt);
		}
	}	
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-cabModelProcessResponse()");
	}	
	
}
//End of the method//

//This method is used to check empty fields on blur and onchange for cabModel//
function cabModelBlurFunction(){
	
	try{
	if(document.getElementById('cab-Model-Dropdown').value == undefined || document.getElementById('cab-Model-Dropdown').selectedIndex ==0)
	{
		document.getElementById("cab-Model-Dropdown").style.borderColor = "red";
		
	errorDropDown.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		
		return false;
	}
	else {
		errorDropDown.innerHTML = "";
		document.getElementById("cab-Model-Dropdown").style.borderColor = "lightgrey";
		return true;
	}
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-cabModelBlurFunction()");
	}
}
//End of the method//

//This method is used to check whether the total number of seats are auto populated on change of cab model//
document.getElementById("cab-Model-Dropdown").addEventListener("change",populateSeatsOnChange);

function populateSeatsOnChange(){
	
	try{
	var selectedCabModal = document.querySelector("#cab-Model-Dropdown").value;   		
	
	for(var key in cabModels){												
			
			if(selectedCabModal == key){									
								
				document.getElementById("no-seats").value = cabModels[key];  
				errorNoSeat.innerHTML = "";
		document.getElementById("no-seats").style.borderColor = "lightgrey";  
			}

		}
		}
		catch(e){
			jsExceptionHandling(e, "manageCabs.js-populateSeatsOnChange()");
		}	
}
//End of the method//
	
//This method is used to add the entered new cab model to the dropdown and make them capitalize//	
document.getElementById("addCabModel").addEventListener('click',function(){
	try{
	var addCabModel= document.getElementById("model-pop2").value;

    capitalizedCabModel =addCabModel.toUpperCase().trim();       // change given data into uppercase


	//If cab model is left empty//
    if( capitalizedCabModel == "")
    {
        errorAddCabModel.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		
		return false;
    }
     else {
		errorAddCabModel.innerHTML = "";
		document.getElementById("addCabModel").style.borderColor = "lightgrey";
	}
	


    dropDownOption =  document.getElementById("cab-Model-Dropdown").options;


// Itearate dropdown list and verify given model already present or not
    for(var i = 0; i < dropDownOption.length; i++)
    {    if( dropDownOption[i].value === capitalizedCabModel)
    {
        errorAddCabModel.innerHTML = "<p style='color: red'>" +
			"*Already exists</p>";
		
		return false;
            }
	else {
		errorAddCabModel.innerHTML = "";
		document.getElementById("cab-Model-Dropdown").style.borderColor = "lightgrey";
		
	}     
    }


    var option=document.createElement("option");    // dynamically create dropdown option
    option.innerText=capitalizedCabModel;
	//If cab model added //
    document.getElementById("cab-Model-Dropdown").appendChild(option); 	// append option to the dropdown
    errorAddCabModel.innerHTML = "<p style='color: green'>" +
			"Cab model added successfully in the drop down</p>";

		funClear();
		
		return false;
		}
		catch(e){
			jsExceptionHandling(e, "manageCabs.js-addEventListener(click(addCabModel))");
		}
	
});
//End of the method//	

//This method is used to hide the previous alert messages in add cab model popup//
function hidePreviousAlertOnChange(){
	try{
	document.getElementById("cancelButton").style.display="none";
	errorAddCabModel.innerHTML = "";
	document.getElementById("addCabModel").style.borderColor = "lightgrey";
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-hidePreviousAlertOnChange()");
	}
		
}
//End of the method//

//This method is used to check the on blur and on change for cab number blur function//	
function cabNumberBlurFunction(){
	
	try{
	cabNumber = document.getElementById('cab-num').value;
	const cabNumPattern=new RegExp("^(([A-Z]{2}[ ])|([A-Z]{2}))(([0-9]{2}[ ])|([0-9]{2}))(([A-Z]{1,2}[ ])|([A-Z]{1,2}))[0-9]{4}$");
   
    var cabNumTrue=cabNumPattern.test(cabNumber);
	
	if(document.getElementById('cab-num').value == undefined || document.getElementById('cab-num').value =="")
	{
		document.getElementById("cab-num").style.borderColor = "red";
		
	errorCabNum.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		
		return false;
	}
	else {
		errorCabNum.innerHTML = "";
		document.getElementById("cab-num").style.borderColor = "lightgrey";
		
		if(!(cabNumTrue)){
			
			document.getElementById("cab-num").style.borderColor = "red";
		
	errorCabNum.innerHTML = "<p style='color: red'>" +
			"*Invalid</p>";
		
		return false;
		}
		else{
			errorCabNum.innerHTML = "";
		document.getElementById("cab-num").style.borderColor = "lightgrey";
		cabNumberCheck();
		if(duplicateCab == true){
			return true;
		}
		else{
			return false;
		}
		
		}
		
	}
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-cabNumberBlurFunction()");
	}
	
}

function cabNumberCheck(){
	
	try{
		xhrCabNumber = createHttpRequest("GET", pathName+"/manage/cabs/cabNumber/"+cabNumber, true, "ADMIN");  //ajax call to check whether the cab number already exists
		xhrCabNumber.onreadystatechange = function(){
			if(xhrCabNumber.readyState == 4 && xhrCabNumber.status == 777) {
		duplicateCab = false;
		cabNumberDuplicityCheck = this.responseText;
		
		document.getElementById("cab-num").style.borderColor = "red";
		
	errorCabNum.innerHTML = "<p style='color: red'>" +
			"*Already exists</p>";
		return false;
		
	}
	
	if(xhrCabNumber.readyState == 4 && xhrCabNumber.status == 200){
		duplicateCab = true;
		errorCabNum.innerHTML = "";
		document.getElementById("cab-num").style.borderColor = "lightgrey";
		return true;
	}
		};
		xhrCabNumber.send(null);
		}
		catch(e){
			jsExceptionHandling(e, "manageCabs.js-cabNumberCheck()");
		}
}
//End of the method//

//This method is used to check the on blur and on change for available number of seats//
function availableSeatsBlurFunction(){
	
	try{
	if(document.getElementById('no-seats').value == undefined || document.getElementById('no-seats').value =="")
	{
		document.getElementById("no-seats").style.borderColor = "red";
		
	errorNoSeat.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		
		return false;
	}
	else {
		errorNoSeat.innerHTML = "";
		document.getElementById("no-seats").style.borderColor = "lightgrey";
		
		//If the seats entered is less than 3 and greater than 99//
		 if(document.getElementById("no-seats").value>20 || document.getElementById("no-seats").value<4 ){
			
			document.getElementById("no-seats").style.borderColor = "red";
		
	errorNoSeat.innerHTML = "<p style='color: red'>" +
			"*Invalid</p>";
		
		return false;
			
		}
		else{
			
			errorNoSeat.innerHTML = "";
		document.getElementById("no-seats").style.borderColor = "lightgrey";
		return true;
		}
	}
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-availableSeatsBlurFunction()");
	}
	
}
//End of the method//

//This method is used to check the on blur and on change for the insurance number//
function insuranceNoBlurFunction(){
	
	try{
	insuranceNumber = document.getElementById('insurance-num').value;
	cabNumber = document.getElementById('cab-num').value;
	if(document.getElementById('insurance-num').value == undefined || document.getElementById('insurance-num').value =="")
	{
		document.getElementById("insurance-num").style.borderColor = "red";
		
	errorInsNum.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		
		return false;
	}
	else {
		errorInsNum.innerHTML = "";
		document.getElementById("insurance-num").style.borderColor = "lightgrey";
		
		insuranceNumberCheck();
		if(duplicateInsurance == true){
			return true;
		}
		else {
			return false;
		}
		
	}
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-insuranceNoBlurFunction()");
	}
	
}

function insuranceNumberCheck(){
	
	try{
		xhrInsuranceNumber = createHttpRequest("GET", pathName+"/manage/cabs/insuranceNumber/"+insuranceNumber+"/"+cabNumber, true, "ADMIN");   //ajax call to check whether the insuranvce number already exists
		xhrInsuranceNumber.onreadystatechange = function(){
			if(xhrInsuranceNumber.readyState == 4 && xhrInsuranceNumber.status == 888){
		duplicateInsurance = false;
				
		document.getElementById("insurance-num").style.borderColor = "red";
		
	errorInsNum.innerHTML = "<p style='color: red'>" +
			"*Already exists</p>";
				
		return false;
		
	}
	
	else if(xhrInsuranceNumber.readyState == 4 && xhrInsuranceNumber.status == 200){
		duplicateInsurance = true;
		errorInsNum.innerHTML = "";
		document.getElementById("insurance-num").style.borderColor = "lightgrey";

		return true;
	}
		};
		xhrInsuranceNumber.send(null);
		}
		catch(e){
			jsExceptionHandling(e, "manageCabs.js-insuranceNumberCheck()");
		}
}
//End of the method//

//This method is used to check the on blur and on change methods for insurance expiry dates//
function insExpiryDateBlurFunction(){
	
	try{
	if(document.getElementById('ins-exp-date').value == undefined || document.getElementById('ins-exp-date').value =="")
	{
		document.getElementById("ins-exp-date").style.borderColor = "red";
		
	errorInsExpDate.innerHTML = "<p style='color: red'>" +
			"*Required</p>";
		
		return false;
	}
	else {
		errorInsExpDate.innerHTML = "";
		document.getElementById("ins-exp-date").style.borderColor = "lightgrey";
		
		//To check whether the entered sxpiry date is less than the today//
		if(document.getElementById("ins-exp-date").value < currentDate){
			
			document.getElementById("ins-exp-date").style.borderColor = "red";
		
	errorInsExpDate.innerHTML = "<p style='color: red'>" +
			"*Invalid</p>";
		
		return false;
			
		}
		
		else{
			
			errorInsExpDate.innerHTML = "";
		document.getElementById("ins-exp-date").style.borderColor = "lightgrey";
		return true;
		}
	}
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-insExpiryDateBlurFunction()");
	}
	
}
//End of the method//

var drivNameInput = document.getElementById("driv-name");
//This method is used to load the driver details when the entered value length is greater than 3//
drivNameInput.addEventListener("input", function(){
	
	try{
	getDriverId == undefined;
	if(drivNameInput.value.length >= 3){
		
		xhrDriverInfo = createHttpRequest("GET",pathName+"/manage/cabs/driverInfo/"+drivNameInput.value,true, "ADMIN");  //ajax call to get the driverinfo
		xhrDriverInfo.onreadystatechange=cabDriverInfoProcessResponse;
		xhrDriverInfo.send(null);
		}
		else{
			divElement.style.display = "none";
		}
		}
		catch(e){
			jsExceptionHandling(e, "manageCabs.js-addEventListener(click(driv-name))");
		}
});
	
function cabDriverInfoProcessResponse(){
	
	try{
	if(xhrDriverInfo.readyState == 4 && xhrDriverInfo.status == 200){

        driverDetails = JSON.parse(xhrDriverInfo.responseText);
        searchForDriverName(driverDetails);
    }
    }
    catch(e){
		jsExceptionHandling(e, "manageCabs.js-cabDriverInfoProcessResponse()");
}
	
}
//End of the method//

var divElement = document.getElementById("suggestDiv");

//This method is used to get the driver name suggestion list//
function searchForDriverName(driverDetails){
	
	try{
     userEntry = drivNameInput.value;

//delete old listtag if any
    let childCount = divElement.childElementCount;
    if(childCount > 0) {
        for(let i=0; i<childCount; i++) {
            divElement.removeChild(divElement.firstChild);
        }
    }


    if(userEntry != "") {
//change user entry to lower case and compare with driver info array
        var suggestionArr = driverDetails;

        var suggLimit = 7;

//creating list tag starts
        for(let i=0; i<suggestionArr.length; i++) {

            divElement.style.display = "block";

            //limit suggestion to 5
            if(i<suggLimit) {
                var listTag = document.createElement("li");
                
                listTag.id=suggestionArr[i].driverId;

                listTag.className = "suggestList";
                listTag.innerText = suggestionArr[i].driverName + " - " + suggestionArr[i].driverNumber

                divElement.appendChild(listTag);      
            }
        }
    }

//onclick function for list tags
    var suggestList = document.getElementsByClassName("suggestList");
    

    for(var i=0; i<suggestList.length; i++) {
	
        suggestList[i].addEventListener("click", function(event) {
		event.preventDefault();
	
            let driverDetails = this.innerText.split(" -");

            //append the value clicked to textbox capitalize first letter
            drivNameInput.value = driverDetails[0].charAt(0).toUpperCase() + driverDetails[0].slice(1);
          	getDriverId = this.id;
            //hide list
            divElement.style.display = "none";
            
        })
    }
    }
    catch(e){
		jsExceptionHandling(e, "manageCabs.js-searchForDriverName(driverDetails)");
}
	
}
//End of the method//

//This method is used to close the suggestion list while we click outside the list//
document.addEventListener("click", function(e) {
	
	divElement.style.display = "none";
})
//End of the method//

//This method is used to check the onblur and on change for populating driver name//
document.getElementById('driv-name').addEventListener('keyup', driverBlurFunction);

function driverBlurFunction() {

try{
	if (document.getElementById('driv-name').value == undefined || document.getElementById('driv-name').value == "") {
		document.getElementById("driv-name").style.borderColor = "red";

		errorDriName.innerHTML = "<p style='color: red'>" +
			"*Required</p>";

		return false;
	}
	
	else {
		errorDriName.innerHTML = "";
		document.getElementById("driv-name").style.borderColor = "lightgrey";
		return true;

	}
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-driverBlurFunction()");
	}
}
//	
	
//End of the method//

//This method is used to disable the save image//
function disableSave(){
	
try{	
if(savingNewRecord == true){
	if(cabModelBlurFunction() && cabNumberBlurFunction() && availableSeatsBlurFunction() && insuranceNoBlurFunction() && insExpiryDateBlurFunction() && driverBlurFunction()){
		
		return true;
		
	}
	else {
		return false;
	}
}
else{
	if(cabModelBlurFunction() && availableSeatsBlurFunction() && insuranceNoBlurFunction() && insExpiryDateBlurFunction() && driverBlurFunction()){
		return true;
	}
	else{
		return false;
	}
}
}
catch(e){
	jsExceptionHandling(e, "manageCabs.js-disableSave()");
}
	
}
//End of the method//

//This method is used to save the cab details//
function saveCabDetails(){
	
try{	
	var cabModel=document.getElementById("cab-Model-Dropdown").value;
    cabNumber=document.getElementById("cab-num").value;
    var totalSeats=document.getElementById("no-seats").value;
    var insuranceNum=document.getElementById("insurance-num").value;
    var expDate=document.getElementById("ins-exp-date").value;
    var driverName=document.getElementById("driv-name").value;
  
    if(disableSave()){
	if(savingNewRecord){
	 if(getDriverId==undefined)
        {
              document.getElementById("driv-name").style.borderColor = "red";
		
	errorDriName.innerHTML = "<p style='color: red'>" +
			"Select from list</p>";  
            return false;
        }
		var data = {"cabModel":cabModel,"cabNumber":cabNumber,"totalSeats":totalSeats,
            "insuranceNumber":insuranceNum,"insuranceExpiryDate":expDate,"driverName":driverName,"driverId":getDriverId};

        xhrSaveCabDetails = createHttpRequest("POST",pathName+"/manage/cabs/saveCabDetails",true, "ADMIN");
	xhrSaveCabDetails.onreadystatechange=saveCabInfoProcessResponse;    
	
	}
	
	else{
		if(driverName!=driver) // || driverId==driverId && driverName!= driver)
        {
            if(getDriverId==undefined){
           		 document.getElementById("driv-name").style.borderColor = "red";
		
	errorDriName.innerHTML = "<p style='color: red'>" +
			"Select from list</p>";
                return false;}
            
            else{
                driverId=getDriverId;
            }

        }
		
		var data = {"cabModel":cabModel,"cabNumber":cabNumber,"totalSeats":totalSeats,
            "insuranceNumber":insuranceNum,"insuranceExpiryDate":expDate,"driverName":driverName,"driverId":driverId};

        xhrSaveCabDetails = createHttpRequest("PUT",pathName+"/manage/cabs/updateCabDetails/"+cabNumber,true, "ADMIN");
        xhrSaveCabDetails.onreadystatechange=updateCabInfoProcessResponse;  
	}
}
else{
		if(savingNewRecord){
			cabModelBlurFunction();
			cabNumberBlurFunction();
			availableSeatsBlurFunction();
			insuranceNoBlurFunction();
			insExpiryDateBlurFunction();
			driverBlurFunction();
			document.getElementById('saveCab').pointerEvents = "none";
		}
		else{
			cabModelBlurFunction();
			availableSeatsBlurFunction();
			insuranceNoBlurFunction();
			insExpiryDateBlurFunction();
			driverBlurFunction();
			document.getElementById('saveCab').pointerEvents = "none";
		}

}
    
	
	xhrSaveCabDetails.setRequestHeader("Content-Type","application/json");
    xhrSaveCabDetails.send(JSON.stringify(data));
     }
     catch(e){
		jsExceptionHandling(e, "manageCabs.js-saveCabDetails()");
}
}

function saveCabInfoProcessResponse() {
	
	try{
	if (xhrSaveCabDetails.readyState == 4 &&  xhrSaveCabDetails.status == 200) {

        var response = this.responseText;
        
         $('#save-manage-cabs-popup').modal('show');
         $("#cab-info").empty();
         document.getElementById('noRecordCab').innerHTML = "";
         funClear();
         getCabCount();         
       
      }   
	}
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-saveCabInfoProcessResponse()");
	}
}
//End of the method//

//This method is used to edit the cab details//
function editData(row){

try{	
	savingNewRecord = false;

    editId = row.closest("td").id;
    
    var counterEdit=editId.replace("tdeditdelete","");
    
    editRow =document.getElementById("tr"+counterEdit);
    
    var model = editRow.getElementsByTagName("td")[0].innerHTML;
    var numberCab = editRow.getElementsByTagName("td")[1].innerHTML;
    var seatsAvailable = editRow.getElementsByTagName("td")[2].innerHTML;
    var insuranceNumber = editRow.getElementsByTagName("td")[3].innerHTML;
    var expiryDate = editRow.getElementsByTagName("td")[4].innerHTML;
    driver = editRow.getElementsByTagName("td")[5].innerHTML;
    driverId=document.getElementById("tdDid"+counterEdit).innerHTML;
    
    document.getElementById("cab-Model-Dropdown").value = model;
    document.getElementById("cab-num").value = numberCab;
    document.getElementById("cab-num").disabled = "true";
    document.getElementById("no-seats").value = seatsAvailable;
    document.getElementById("insurance-num").value = insuranceNumber;
    document.getElementById("ins-exp-date").value = formatDate(expiryDate,1);
    document.getElementById("driv-name").value = driver;
    
    cabModelBlurFunction();
    errorCabNum.innerHTML = "";
	document.getElementById("cab-num").style.borderColor = "lightgrey";
	availableSeatsBlurFunction();
	insuranceNoBlurFunction();
	insExpiryDateBlurFunction();
	driverBlurFunction();
    }
    catch(e){
		jsExceptionHandling(e, "manageCabs.js-editData(row)");
}
}

function updateCabInfoProcessResponse(){
	
try{	
	if (xhrSaveCabDetails.readyState == 4 &&  xhrSaveCabDetails.status == 200) {

        var response = this.responseText;
              
        getDriverId = undefined;
        $('#save-manage-cabs-popup').modal('show');
        $("#cab-info").empty();
        funClear();
        getCabCount(); 
        
    }
    }
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-updateCabInfoProcessResponse()");
	}
}
//End of the method//

//This method is used to clear the data entered in the text fields//
function funClear(){

try{	
	savingNewRecord = true;
    document.getElementById("cab-Model-Dropdown").value="";
    reset();
    document.getElementById("cab-num").value="";
    document.getElementById("cab-num").disabled="";
    document.getElementById("no-seats").value="";
    document.getElementById("insurance-num").value="";
    document.getElementById("ins-exp-date").value=true;
    document.getElementById("driv-name").value="";
    }
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-funClear()");
	}
}
//End of the method//

//This method is used to clear the data in the add cab model popup//
function reset(){

try{	
	var dropDown = document.getElementById("cab-Model-Dropdown");
    dropDown.selectedIndex = 0;
    }
	catch(e){
		jsExceptionHandling(e, "manageCabs.js-reset()");
	}
}
//End of the method//

//This method is used to delete the cab details//
function deleteCabDetails(){

try{	
	xhrDeleteCabDetails = createHttpRequest("PUT",pathName+"/manage/cabs/deleteCabDetails/"+delCab,true, "ADMIN");

    xhrDeleteCabDetails.setRequestHeader("Content-Type","application/json");
    
    var cabModel=document.getElementById("cab-Model-Dropdown").value;
    cabNumber=document.getElementById("cab-num").value;
    var totalSeats=document.getElementById("no-seats").value;
    var insuranceNum=document.getElementById("insurance-num").value;
    var expDate=document.getElementById("ins-exp-date").value;
    var driverName=document.getElementById("driv-name").value;
    
    var data = {"cabModel":cabModel,"cabNumber":cabNumber,"totalSeats":totalSeats,
            "insuranceNumber":insuranceNum,"insuranceExpiryDate":expDate,"driverName":driverName,"driverId":driverId};
    
    xhrDeleteCabDetails.send(JSON.stringify(data));

    xhrDeleteCabDetails.onreadystatechange=deleteCabInfoProcessResponse;
    }
    catch(e){
		jsExceptionHandling(e, "manageCabs.js-deleteCabDetails()");
}
}

function deleteCabInfoProcessResponse(){
	
	try{
	if (xhrDeleteCabDetails.readyState == 4 &&  xhrDeleteCabDetails.status == 200) {

        var response = this.responseText;

        deleteRow.remove(); //tr0
        
        $("#cab-info").empty();
        
        getCabCount(); 
      
    }
    }
    catch(e){
		jsExceptionHandling(e, "manageCabs.js-deleteCabInfoProcessResponse()");
}
}

function deleteData(row){

try{	
	delId = row.closest("td").id;     // get closest id

    var counter=delId.replace("tdeditdelete","");   // replace the id

    deleteRow =document.getElementById("tr"+counter);  //tr0

    delCab = deleteRow.getElementsByTagName("td")[1].innerHTML;
    }
    catch(e){
		jsExceptionHandling(e, "manageCabs.js-deleteData(row)");
}
    
}
//End of the method//

//This method is used to change the date format//
function formatDate(date, option){

try{
	var arr = date.split("-");

    if(option ==1)   // yy-dd-mm
        var formatedDate = arr[2] + "-" + arr[1] + "-" + arr[0];
    else if(option==2) //dd-mm-yyyy
        var formatedDate = arr[1] + "-" + arr[0] + "-" + arr[2];
    return formatedDate;
    }
    catch(e){
		jsExceptionHandling(e, "manageCabs.js-formatDate(date, option)");
}
    
}
//End of the method//

//To disable the dates before the current date in the expiry date field
if(month<10)
{
    month = "0"+month;
}
if(day<10){
    day = "0"+day;
}
var currentDate=(date.getFullYear())+"-"+month+"-"+day;

document.getElementById("ins-exp-date").setAttribute('min',currentDate);
//End//

// Sort the table
function sortCabNumber(tdNum, orderType) {

try{
var rows, switching, i, x, y, shouldSwitch;
tBody = document.getElementById("cab-info");
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
}
catch(e){
	jsExceptionHandling(e, "manageCabs.js-sortCabNumber(tdNum, orderType)");
}
}

function changeStatus(obj) {
     try{
	var checkBox = document.getElementById(obj.id);
	if (checkBox.checked == true) {//If checkBox applied
		Active = true;
	}
	else {
		Active = false;
	}


	var row = obj.id.replace("status", "");

	var cabNumber = document.getElementById("tdcabnum" + row).innerText;
	xhrCabNumberIsActive = createHttpRequest("PUT", pathName + "/manage/cabs/cabIsActive/" + cabNumber + "/" + Active, true, "ADMIN");
	xhrCabNumberIsActive.onreadystatechange = cabNumIsActive;
	xhrCabNumberIsActive.send();
	
}catch(e){
	jsExceptionHandling(e, "manageCabs.js-changeStatus(obj)");  
}

}

function cabNumIsActive(){
	
	try{
	if (this.readyState == 4 && this.status == 200) {
		
		var response = JSON.parse(this.responseText);

	}

}catch(e){
	jsExceptionHandling(e, "manageCabs.js-cabNumIsActive()");  
}
}