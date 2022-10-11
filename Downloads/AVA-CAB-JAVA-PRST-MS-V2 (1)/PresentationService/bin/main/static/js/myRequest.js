
var xhrMyRequest;
var empId = localStorage.getItem("employeeDetailId");
var index = 0;
var pages;
var limit;
var filterApplied=false;
var requestCount;
var xhrMyRequestDetails;
var filterResponsCount;

var statusSet = new Set();
var timeSlotSet = new Set();
var requestTypeSet = new Set();

var noRecordFound="<h5 class=noRecordsFound>No Records Found </h5>";

var emptyErrorFilter=document.getElementById("filter-empty-check");


window.onload = fetchMyRequest(); // on load the function would be called!

function fetchMyRequest() {
	try{
	var url= pathName + "/bookingInfoService/bookingRequest/myrequest/count/" + empId;
    xhrMyRequest=createHttpRequest("GET",url, true,"EMPLOYEE");
    xhrMyRequest.onreadystatechange = myRequestResponse;
    xhrMyRequest.send(null);	
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-fetchMyRequest()");
	}
	
}

function myRequestResponse() {
	try{
		if (xhrMyRequest.readyState == 4 && xhrMyRequest.status == 200) {
        requestCount = JSON.parse(xhrMyRequest.responseText);
        limit=xhrMyRequest.getResponseHeader("limit");
        pages = Math.ceil(requestCount / limit);
        if (requestCount == 0) {
            document.getElementById("noRecordMyRequest").innerHTML=noRecordFound;
        } else {
            myRequest(index);
            createPagination(pages, 1);

        }
    }	
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-myRequestResponse()");
	}
    
}


function myRequest(index) {
	try{
	var url=pathName + "/bookingInfoService/bookingRequest/myrequest/employeedetails/" + empId + "/" + index;
    xhrMyRequestDetails=createHttpRequest("GET",url , true,"EMPLOYEE");
    xhrMyRequestDetails.onreadystatechange = myRequestDetailsResponse;
    xhrMyRequestDetails.send(null);
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-myRequest(index)");
	}
	
}

function myRequestDetailsResponse() {
	try{
		 if (xhrMyRequestDetails.readyState == 4 && xhrMyRequestDetails.status == 200) {
        var requestDetails = JSON.parse(xhrMyRequestDetails.responseText);
        dynamicTable(requestDetails);
                    //  view for the total records
       	var count =document.getElementById("totalrecord");
       	count.innerHTML =$('#tableBody tr').length+"  records out of " + requestCount ;
    }
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-myRequestDetailsResponse()");
	}
   
}

function dynamicTable(requestDetails) {
	try{
		 rowCounter = 0;
    serialCount = 1;

    $("#tableBody").empty(); // make the table empty for every ajax call
    for (var i = 0; i < requestDetails.length; i++) {
        // creating row and data.

        var trow = document.createElement("tr");
        trow.className = "row-bg-style"; // display-shadow       // addingStyle class
        trow.id = "tr" + i;

        var sNo = document.createElement("td");
        sNo.className = "spacing";
        sNo.innerText = serialCount++;

        var travelledDate = document.createElement("td");
        travelledDate.className = "spacing text-nowrap";

        var date = requestDetails[i].dateOfTravel;
        var dateTravel = date.split("-");
        dateFormat = dateTravel[2] + "-" + dateTravel[1] + "-" + dateTravel[0];
        travelledDate.innerText = dateFormat;
        dateOfTravel = dateFormat;

        var time = document.createElement("td"); // time travel
        time.className = "spacing";
        // timeFormatter
        var timeSlot = timeFormatTo12Hr(requestDetails[i].timeSlot, 0);
        time.innerHTML = timeSlot;
        timeSlotSet.add(timeSlot);

        var status = document.createElement("td");
        status.className = "spacing";
        empStatus = requestDetails[i].status;
        status.innerText = empStatus;
        statusSet.add(requestDetails[i].status);

		var request = document.createElement("td");
		request.className = "spacing";
		request.id = "request"+i;
		request.innerText = requestDetails[i].requestType;
		requestTypeSet.add(requestDetails[i].requestType);
				
        var actionbtn = document.createElement("td");
        actionbtn.className = "spacing text-nowrap";
        actionbtn.id = "action" + i;

        // status
        if (status.innerText == "Cancelled" || status.innerText == "Noshow") {
        } else {
            actionbtn.innerHTML = "<a class='view-icon align-img'><span class = 'span-color' onclick = 'actionButtonClicked(this)'>View Details</span></a>";
        }

        var tripCabId = document.createElement('td');
        tripCabId.className = "spacing";
        tripCabId.id = "tripId"+i;
        tripCabId.style.display = 'none';

        var bookingId = document.createElement("td");
        bookingId.className = "spacing";
        bookingId.id = "bookId" + i;
        bookingId.style.display = "none";

        var employeeId = document.createElement("td");
        employeeId.className = "spacing";
        employeeId.id = "empId" + i;
        employeeId.style.display = "none";

        // required info for next page
        tripCabId.innerHTML=requestDetails[i].tripCabId;
        bookingId.innerHTML = requestDetails[i].bookingId;
        employeeId.innerHTML = requestDetails[i].employeeDetailId;
		
        // append the data in the trow

        trow.appendChild(sNo);
        trow.appendChild(travelledDate);
        trow.appendChild(time);
        trow.appendChild(status);
        trow.appendChild(request);
        trow.appendChild(actionbtn);
        trow.appendChild(tripCabId);
        trow.appendChild(bookingId);
        trow.appendChild(employeeId);
       
        // append the rows in the tablebody.
        document.getElementById("tableBody").appendChild(trow);
    }

	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-dynamicTable(requestDetails)");
	}
   
}

function filterClearButtonClicked() {
   	try{
	document.getElementById("fromDate").value = true;
    document.getElementById("toDate").value = true;
    document.getElementById("TimeSlot").value = "";
    document.getElementById("status").value = "";
    document.getElementById("type").value = "";
    reset();
    removeAlert();
    fetchMyRequest();
    $('#dropdown').trigger('click');
    
	document.getElementById('tableBody').style.display="table-row-group";
	document.getElementById("noRecordMyRequest").style.display="none";
	}
   	catch(e){
		jsExceptionHandling(e,"myRequest.js-filterClearButtonClicked()");
	}
       
}

function reset() {
	try{
	var timeSlot = document.getElementById("TimeSlot");
    timeSlot.selectedIndex = 0;
    var status = document.getElementById("status");
    status.selectedIndex = 0;	
    var requestType = document.getElementById("type");
    requestType.selectedIndex = 0;
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-reset()");
	}
   
}


function removeAlert(){
	try{
			 document.getElementById("fromDate").style.borderColor="lightgrey";
			 document.getElementById("toDate").style.borderColor="lightgrey";
			 document.getElementById("TimeSlot").classList.add("style-select1");
			 document.getElementById("status").classList.add("style-select1");
			 document.getElementById("type").classList.add("style-select1");
			 emptyErrorFilter.innerHTML="";	
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-removeAlert()");
	}

}


function filterStatus() {
	try{
	 var statusList = document.getElementById("status");

    var length = statusList.options.length;

    for (i = length - 1; i > 0; i--) {
        // To avoid the selected values repeatation
        statusList.options[i] = null;
    }

    const statusIterator = statusSet.values();

    for (var j = 0; j < statusSet.size; j++) {
        var filterStatus = document.createElement("option");
        filterStatus.innerText = statusIterator.next().value;
        document.getElementById("status").options.add(filterStatus);
    }
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-filterStatus()");
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

function filterTimeSlot() {
	try{
	var timeSlotList = document.getElementById("TimeSlot");

    var length = timeSlotList.options.length;

    for (i = length - 1; i > 0; i--) {
        // To avoid the selected values repeatation
        timeSlotList.options[i] = null;
    }

    const timeSlotIterator = timeSlotSet.values();

    for (var j = 0; j < timeSlotSet.size; j++) {
        var filterStatus = document.createElement("option");
        filterStatus.innerText = timeSlotIterator.next().value;
        document.getElementById("TimeSlot").options.add(filterStatus);
    }
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-filterTimeSlot()");
	}
   
}


//pagination

function createPagination(pages, index) {
	try{
		if(filterApplied){
		filterMyRequest(index - 1);
	}
	else{
		 myRequest(index - 1);
	}
   

    let str = '<ul class= "ul-tag">';

    let active;
    let previousButton = index - 1;
    let nextButton = index + 1;

    if (index > 1) {
        str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, ' + (index - 1) + ')"><img src="images/pagination-prev-arrow.svg"  /></a></li>';
    }
    if (pages < 6) {
        for (let p = 1; p <= pages; p++) {
            active = index == p ? "active" : "no";
            str += '<li class="' + active + '" ><a class="page-link pagination-border a-tag" onclick="createPagination(pages, ' + p + ')">' + p + "</a></li>";
        }
    } else {
        if (index > 2) {
            str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, 1)">1</a></li>';
            if (index > 3) {
                str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (index - 2) + ')">...</a></li>';
            }
        }

        if (index === 1) {
            nextButton += 2;
        } else if (index === 2) {
            nextButton += 1;
        }

        if (index === pages) {
            previousButton -= 2;
        } else if (index === pages - 1) {
            previousButton -= 1;
        }

        for (let p = previousButton; p <= nextButton; p++) {
            if (p === 0) {
                p += 1;
            }
            if (p > pages) {
                continue;
            }
            active = index == p ? "active" : "no";
            str += '<li class="page-item ' + active + '"><a class="page-link pagination-border" onclick="createPagination(pages, ' + p + ')">' + p + "</a></li>";
        }

        if (index < pages - 1) {
            if (index < pages - 2) {
                str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (index + 2) + ')">...</a></li>';
            }
            str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, pages)">' + pages + "</a></li>";
        }
    }
    if (index < pages) {
        str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, ' + (index + 1) + ')"><img src="images/pagination-next-arrow.svg" alt="page-arrow"  /></a></li>';
    }
    str += "</ul>";

    document.getElementById("myRequestPagination").innerHTML = str;
    return str;
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-createPagination(pages,index)");
	}
	
	
}

//filter apply button clicked
var filterStatus;
var filterRequestType;
var filterFromDate = null;
var filterToDate = null;
var filterTime = null;
var xhrFilter;

function filterApplyButtonClicked() {
	try{
		var validate=checkEmptyFieldValidation();
	if(validate){
	filterApplied=true;
	
    if (document.getElementById("status").value == "" || document.getElementById("status").value == undefined || document.getElementById("status").selectedIndex == 0) {
        filterStatus = null;
    } else {
        filterStatus = document.getElementById("status").value;
    }
    if(document.getElementById("type").value == "" || document.getElementById("type").value == undefined || document.getElementById("type").selectedIndex == 0){
		filterRequestType = null;
	}
	else{
		filterRequestType = document.getElementById("type").value;
	}
    if (document.getElementById("fromDate").value == "" || document.getElementById("fromDate").value == undefined) {
        filterFromDate = null;
    } else {
        filterFromDate = document.getElementById("fromDate").value + "T00:00:00";
    }
    if (document.getElementById("toDate").value == "" || document.getElementById("toDate").value == undefined) {
        filterToDate = null;
    } else {
        filterToDate = document.getElementById("toDate").value + "T00:00:00";
    }
    if (document.getElementById("TimeSlot").value == "" || document.getElementById("TimeSlot").value == undefined || document.getElementById("TimeSlot").selectedIndex == 0) {
        bookingTimeSlot = null;
    } else {
        filterTime = document.getElementById("TimeSlot").value;
        
       var splittedTimeSlot = filterTime.split(":");
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

    var filterCountData = { employeeDetailId: empId, fromDate: filterFromDate, toDate: filterToDate, timeSlot: bookingTimeSlot, status: filterStatus, requestType:filterRequestType };
	var url=pathName + "/bookingInfoService/bookingRequest/myrequest/filterCount";
    xhrFilter=createHttpRequest("POST",url , true,"EMPLOYEE");
    xhrFilter.setRequestHeader("Content-Type", "application/json");
    xhrFilter.send(JSON.stringify(filterCountData));

    xhrFilter.onreadystatechange = filterCountResponse;
    }
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-filterApplyButtonClicked()");
	}
	
	

}

function filterCountResponse() {
	try{
		 if (xhrFilter.readyState == 4 && xhrFilter.status == 200) {
        filterResponsCount = JSON.parse(xhrFilter.responseText);
        pages = Math.ceil(filterResponsCount / limit);
        if (filterResponsCount == 0) {
            document.getElementById("noRecordMyRequest").innerHTML=noRecordFound;
            document.getElementById("tableBody").style.display="none";
        } else {
            filterMyRequest(index);
            createPagination(pages, 1);
        }
    }
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-filterCountResponse()");
	}
   
}

var xhrFilterRequestDetails;

function filterMyRequest(index) {
	try{
	var filterData = { employeeDetailId: empId, fromDate: filterFromDate, toDate: filterToDate, timeSlot: bookingTimeSlot, status: filterStatus, requestType:filterRequestType };
	var url= pathName + "/bookingInfoService/bookingRequest/myrequest/filter/" + index;
    xhrFilterRequestDetails=createHttpRequest("POST",url, true,"EMPLOYEE");
    xhrFilterRequestDetails.setRequestHeader("Content-Type", "application/json");
    xhrFilterRequestDetails.send(JSON.stringify(filterData));
    xhrFilterRequestDetails.onreadystatechange = filterResponse;
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-filterMyRequest(index)");
	}
   
}

function filterResponse() {
	try{
	 if (xhrFilterRequestDetails.readyState == 4 && xhrFilterRequestDetails.status == 200) {
        var filterRequestDetails = JSON.parse(xhrFilterRequestDetails.responseText);

        dynamicTable(filterRequestDetails);
        //  view for the total records
       	var count =document.getElementById("totalrecord");
       	count.innerHTML =$('#tableBody tr').length+"  records out of " + filterResponsCount ;
    }	
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-filterResponse()");
	}
   
}    


// navigate the page


 var getId;
 var actionRow;
 
 function actionButtonClicked(navigateRow)          // after user clicks the action button
	{
		try{
		 getId = navigateRow.closest("td").id;  // get the Id of the Action button

		 // it will replace the action0 into only that 0 .
		 var actionbtn = getId.replace("action", "");

		 actionRow = document.getElementById("tr" + actionbtn); // get the entire row

		 //get the Required value from the row
		 var tripId = actionRow.getElementsByTagName("td")[6].innerHTML;
		 var bookId = actionRow.getElementsByTagName("td")[7].innerHTML;
		 var empId = actionRow.getElementsByTagName("td")[8].innerHTML;


		 // heading towards the next screen

		 window.location.href = "/user/completedtrip?tripCabId =" +tripId + "=" + bookId + "=" + empId;	
		}
		catch(e){
			jsExceptionHandling(e,"myRequest.js-actionButtonClicked(navigateRow)");
		}
		
	}


function checkEmptyFieldValidation(){
	try{
		var filterFrom=document.getElementById("fromDate");
	var filterTo=document.getElementById("toDate");
	var filterTimeSlot=document.getElementById("TimeSlot");
	var filterStatus=document.getElementById("status");
	var requestType = document.getElementById("type");
	
	if((filterFrom.value=="" || filterFrom.value==undefined) &&(filterTo.value=="" || filterTo.value==undefined) &&
		(filterTimeSlot.selectedIndex ==0 || filterTimeSlot.value=="Select") && (filterStatus.selectedIndex ==0 || filterStatus.value=="Select")
		&&(requestType.selectedIndex ==0 || requestType.value=="Select")		
	){
			filterFrom.style.borderColor="red";
			filterTo.style.borderColor="red";
			
			filterTimeSlot.classList.remove("style-select1");
			filterTimeSlot.style.borderColor="red";
			
			filterStatus.classList.remove("style-select1");
			filterStatus.style.borderColor="red";
			requestType.classList.remove("style-select1");
			requestType.style.borderColor="red";
			
			emptyErrorFilter.innerHTML="<p style='color: red'>" +
"Fill atleast one field to filter the records</p>";
return false;
			
	}
	else
	{
			emptyErrorFilter.innerHTML="";
			filterFrom.style.borderColor="lightgrey";
			filterTo.style.borderColor="lightgrey";
			
			filterTimeSlot.classList.add("style-select1");
			filterTimeSlot.style.borderColor="lightgrey";
			
			filterStatus.classList.remove("style-select1");
			filterStatus.style.borderColor="lightgrey";	
			requestType.classList.remove("style-select1");
			requestType.style.borderColor="lightgrey";	
			return true;		
		
	}
	}
	catch(e){
		jsExceptionHandling(e,"myRequest.js-checkEmptyFieldValidation()");
	}
	
}



// Sort the table

function sortTable(tdNum, orderType) {
	try{
		var rows, switching, i, x, y, shouldSwitch;
	tBody = document.getElementById("tableBody");
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
		jsExceptionHandling(e,"myRequest.js-sortTable(tdNum,orderType)");
	}

	
}