var xhrSrc;
var xhrDest;
var sourceError = document.getElementById("sourceError");
var destinationError = document.getElementById("destinationError");
var dropPointError = document.getElementById("dropPointError");
var timeSlotError = document.getElementById("timeSlotError");
var bookACabError = document.getElementById("bookACabError");
var locationError = document.getElementById("locationError");
var dateError = document.getElementById("dateError");

var empDetailId = localStorage.getItem("employeeDetailId");
var profile = localStorage.getItem("profile");
var empName;
var time = "";
var validateXhr;
var bookingToCancel;
var dropLabel;
var request = "Drop";
var serverTime;
var serverDate;
var setIntervalOperation;

window.onload =function (){
	setIntervalOperation =  setInterval(pageValidateBooking, 90000);
	pageValidateBooking();
	onLoadingOfBookACabScreen();
	getServerTime();
	getServerDate();
	enableDatePicker();
	var hideLocation = document.getElementById('hideLocationDiv');
	hideLocation.style.display = "none";
		
	var hideDate = document.getElementById('hideDateDiv');
	hideDate.style.display = "none";
} 

function getServerTime() {
	 var xhrTime;
		var url=pathName + "/bookingInfoService/bookingRequest/bookingTime";
        xhrTime=createHttpRequest("GET",url, false,"EMPLOYEE");
        xhrTime.onreadystatechange = responseBookingTime;
        xhrTime.send(null);

        function responseBookingTime() {
            if (xhrTime.readyState == 4 && xhrTime.status == 200) {
                serverTime = xhrTime.responseText;
            }
        }

}

function getServerDate() {
	 var xhrDate;
		var url=pathName + "/bookingInfoService/bookingRequest/serverDate";
        xhrDate=createHttpRequest("GET",url, false,"EMPLOYEE");
        xhrDate.onreadystatechange = responseBookingDate;
        xhrDate.send(null);

        function responseBookingDate() {
            if (xhrDate.readyState == 4 && xhrDate.status == 200) {
                serverDate = xhrDate.responseText;
            }
        }

}

if(profile!=null){
	empName=JSON.parse(profile).employeeName;
}

function sourceBlurFunction() {
	try{
		buttonState();

    if (document.getElementById("dropLocation").selectedIndex == 0) {
        document.getElementById("dropLocation").style.borderColor = "red";
        sourceError.innerHTML = "<p style='color: red'>" + "*Required</p>";
        return false;
    } else {
        sourceError.innerHTML = "";
        document.getElementById("dropLocation").style.borderColor = "lightgrey";
    }
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-sourceBlurFunction()");
	}
	
}

function destinationBlurFunction() {
	try{
		buttonState();

    if (document.getElementById("route").selectedIndex == 0) {
        document.getElementById("route").style.borderColor = "red";
        destinationError.innerHTML = "<p style='color: red'>" + "*Required</p>";
        return false;
    } else {
        destinationError.innerHTML = "";
        document.getElementById("route").style.borderColor = "lightgrey";
    }
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-destinationBlurFunction()");
	}
}

function dropPointBlurFunction() {
	try{
		buttonState();

    if (document.getElementById("routesDisplay").selectedIndex == 0) {
        document.getElementById("routesDisplay").style.borderColor = "red";
        dropPointError.innerHTML = "<p style='color: red'>" + "*Required</p>";
        return false;
    } else {
        dropPointError.innerHTML = "";
        document.getElementById("routesDisplay").style.borderColor = "lightgrey";
    }
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-dropPointBlurFunction()");
	}
    
}

function locationBlurFunction() {
	try{
		buttonState();

    if (document.getElementById("location").value == undefined || document.getElementById("location").value == "") {
        document.getElementById("location").style.borderColor = "red";
        locationError.innerHTML = "<p style='color: red'>" + "*Required</p>";
        return false;
    } else {
        locationError.innerHTML = "";
        document.getElementById("location").style.borderColor = "lightgrey";
    }
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-locationBlurFunction()");
	}
    
}

function dateBlurFunction() {
	try{
		buttonState();

    if (document.getElementById("datePicker").value == undefined || document.getElementById("datePicker").value == "") {
        document.getElementById("datePicker").style.borderColor = "red";
        dateError.innerHTML = "<p style='color: red'>" + "*Required</p>";
        return false;
    } else {
        dateError.innerHTML = "";
        document.getElementById("datePicker").style.borderColor = "lightgrey";
        if(document.getElementById("datePicker").value < currentDisplayDate || document.getElementById("datePicker").value > nextDays){
			document.getElementById("datePicker").style.borderColor = "red";
	        dateError.innerHTML = "<p style='color: red'>" + "*Invalid</p>";
	        return false;
		}else{
			dateError.innerHTML = "";
        	document.getElementById("datePicker").style.borderColor = "lightgrey";
		}
    }
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-dateBlurFunction()");
	}
    
}

function timeSlotBlurFunction() {
	try{
		 buttonState();

    if (document.getElementById("timeSlot").selectedIndex == 0) {
        document.getElementById("timeSlot").style.borderColor = "red";
        timeSlotError.innerHTML = "<p style='color: red'>" + "*Required</p>";
        return false;
    } else {
        timeSlotError.innerHTML = "";
        document.getElementById("timeSlot").style.borderColor = "lightgrey";
    }
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-timeSlotBlurFunction()");
	}
   
}



//Validate whether the User has already made booking or not

function pageValidateBooking() {
	try{
	var url= pathName + "/bookingInfoService/bookingRequest/validate/" + empDetailId
    validateXhr=createHttpRequest("GET",url, true,"EMPLOYEE");
    validateXhr.onreadystatechange = validationProcessResponse;
    validateXhr.send(null);
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-pageValidateBooking()");
	}
	
}

var validationResponse;
var responseValidate;
function validationProcessResponse() {
    //Not made Booking already


	try{
		//Cab has been assigned
	if (validateXhr.readyState == 4 && validateXhr.status == 228) {
        validationResponse = JSON.parse(validateXhr.responseText);
        changeOnGoingRide(validationResponse);
		radioButtonClicked(request);		
       
    }

    //Already booked - yet to get assigned to a cab

    if (validateXhr.readyState == 4 && validateXhr.status == 227) {
        validationResponse = JSON.parse(validateXhr.responseText);
   		changeOnGoingRide(validationResponse);
   		radioButtonClicked(request);
   		
	}
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-validationProcessResponse()");
	}
    
}
var viewTripSheetBook;
var viewTripSheetTrip;
function changeOnGoingRide(validationResponse){
	try{
		
		for(var i = 0; i<validationResponse.length; i++){
			if(validationResponse[i].requestType == "Drop"){
				
				var officeLocation = document.getElementById('labelOffice');
				officeLocation.innerText = "Office Location";
				officeLocation.className = "form-check-label font-semibold font-16";
				
				var srcOpt = document.getElementById("officeLocation");
        		srcOpt.innerText = validationResponse[i].source;
        
        		var route = document.getElementById('labelDropRoute');
				route.innerText = "Route";
				route.className = "form-check-label font-semibold font-16";
				
       			var destOpt = document.getElementById("dest");
        		destOpt.innerText = validationResponse[i].destination;
        
        		var dropPoint = document.getElementById('pickup');
				dropPoint.innerText = "Drop Point";
				dropPoint.className = "form-check-label font-semibold font-16";
				
        		var dropOpt = document.getElementById("showDropPoint");
        		dropOpt.innerText = validationResponse[i].dropPoint;
        
        		var timeSlot = document.getElementById('labelTime');
				timeSlot.innerText = "Time Slot";
				timeSlot.className = "form-check-label font-semibold font-16";
				
        		var timeOpt = document.getElementById("dropTime");
         		var timeSlot = timeFormatTo12Hr(validationResponse[i].timeSlot,0)
        		timeOpt.innerText = timeSlot;
        
        		var noScheduledTrip = document.getElementById("noDropScheduled");
        		noScheduledTrip.innerText = "";
        		var cancel = document.getElementById("cancelDropBooking");
        		var tripSheet = document.getElementById("viewTripSheetButton");
        		if(validationResponse[i].status == "Assigned" || validationResponse[i].status == "Ongoing"){
					
					tripSheet.innerText = "View Tripsheet";
					cancel.innerText = "";
					tripSheet.className = "font-16 font-regular view-trip-sheet-link";
					var viewDropTripSheetBook = validationResponse[i].bookingId;
					var viewDropTripSheetTrip = validationResponse[i].tripCabId;
					tripSheet.addEventListener("click", function(){
						window.location.href = "/user/ongoingtrip?tripCabId=" + viewDropTripSheetTrip + 
	 											"?bookingId=" + viewDropTripSheetBook;
					})
				}
				else{
	        		
	        		cancel.innerText = "Cancel";
	        		cancel.className = "cancel-link font-16 font-regular";
	        		var cancelBookingForDrop = validationResponse[i].bookingId;
	        		cancel.addEventListener("click", function(){
					bookingToCancel = cancelBookingForDrop;
					
					document.getElementById('hideOfficeLocation').style.display = 'block';
	            	document.getElementById('hideDropRouteLocation').style.display = 'block';
	            	document.getElementById('hideDropLocation').style.display = 'block';
	            	document.getElementById('hideDropTimeSlot').style.display = 'block';
	            	document.getElementById('noDropScheduled').innerText = "";
					});
				}
			
        	}
        	else if(validationResponse[i].requestType == "Pickup"){
	
				var dropLocation = document.getElementById('labelDropOffice');
				dropLocation.innerText = "Drop Location";
				dropLocation.className = "form-check-label font-semibold font-16";
				
				var srcOpt = document.getElementById("pickupDropLocation");
        		srcOpt.innerText = validationResponse[i].source;
        
        		var routeLocation = document.getElementById('labelPickupRoute');
				routeLocation.innerText = "Route";
				routeLocation.className = "form-check-label font-semibold font-16";
				
       			var destOpt = document.getElementById("pickupRoute");
        		destOpt.innerText = validationResponse[i].destination;
        
        		var pickupLocation = document.getElementById('labelPickupPointLocation');
				pickupLocation.innerText = "Pickup Point";
				pickupLocation.className = "form-check-label font-semibold font-16";
				
        		var dropOpt = document.getElementById("showPickupPoint");
        		dropOpt.innerText = validationResponse[i].dropPoint;
        
        		var pickupTimeSlot = document.getElementById('labelPickupTimeSlot');
				pickupTimeSlot.innerText = "Time Slot";
				pickupTimeSlot.className = "form-check-label font-semibold font-16";
				
        		var timeOpt = document.getElementById("pickupTimeSlot");
         		var timeSlot = timeFormatTo12Hr(validationResponse[i].timeSlot,0)
        		timeOpt.innerText = timeSlot;
        
        		var noScheduledTrip = document.getElementById("noPickupScheduled");
        		noScheduledTrip.innerText = "";
        		var tripSheet = document.getElementById("viewPickupTripSheetButton");
        		var cancel = document.getElementById("cancelPickupBooking");
        		if(validationResponse[i].status == "Assigned" || validationResponse[i].status == "Ongoing"){
					
					tripSheet.innerText = "View Tripsheet";
					cancel.innerText = "";
					tripSheet.className = "font-16 font-regular view-trip-sheet-link";
					var viewPickTripSheetBook = validationResponse[i].bookingId;
					var viewPickTripSheetTrip = validationResponse[i].tripCabId;
					tripSheet.addEventListener("click", function(){
						window.location.href = "/user/ongoingtrip?tripCabId=" + viewPickTripSheetTrip + 
	 		"?bookingId=" + viewPickTripSheetBook;
	 		})
					
				}
				else{
        		
        		cancel.innerText = "Cancel";
        		cancel.className = "cancel-link font-16 font-regular";
        		var cancelBookingForPick = validationResponse[i].bookingId;
				cancel.addEventListener("click", function(){
				bookingToCancel = cancelBookingForPick;
				
				document.getElementById('hideDropLocation').style.display = 'block';
            	document.getElementById('hideRouteLocation').style.display = 'block';
            	document.getElementById('hidePickupLocation').style.display = 'block';
            	document.getElementById('hidePickupTimeSlot').style.display = 'block';
            	document.getElementById('noPickupScheduled').innerText = "";
});
			}
			}
        }
        
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-changeOnGoingRide()");
	}

}


//Validation ends here


function onLoadingOfBookACabScreen() {
	try{
	document.getElementById("bookACab-btn").disabled = true;
	document.getElementById('flexRadioDefault1').checked = true;
	document.getElementById('noDropScheduled').innerText = "No scheduled trips";
	document.getElementById('noDropScheduled').className = "font-18 font-regular text-muted text-center";
	document.getElementById('noPickupScheduled').innerText = "No scheduled trips";
	document.getElementById('noPickupScheduled').className = "font-18 font-regular text-muted text-center";
	
	var url=pathName + "/route/getSource";
    xhrSrc=createHttpRequest("GET",url, true,"EMPLOYEE");
    xhrSrc.onreadystatechange = processResponseSource;
    xhrSrc.send(null);
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-onLoadingOfBookACabScreen()");
	}
    
}

function processResponseSource() {
	try{
		 if (xhrSrc.readyState == 4 && xhrSrc.status == 200) {
        var sources = JSON.parse(xhrSrc.responseText);

        var clearSource = document.getElementById("dropLocation");
        var srcLength = clearSource.options.length;

        for (i = srcLength - 1; i > 0; i--) {
            clearSource.options[i] = null;
        }

	
        for (var i = 0; i < sources.length; i++) {
            
            var opt = document.createElement("option");
            opt.innerHTML = sources[i].source;
            opt.value = sources[i].sourceId;
           
            document.getElementById("dropLocation").options.add(opt);
            
        }
    }

    //Fetch Source - Ends	
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-processResponseSource()");
	}
   
}

//Fetches Destinations

var destinations;

function onSelectOfSource() {
	try{
		bookACabError.innerHTML = "";
	var url=pathName + "/route/getDestination";
    xhrDest=createHttpRequest("GET",url , true,"EMPLOYEE");
    xhrDest.onreadystatechange = processResponseOfDestination;
    xhrDest.send(null);
    buttonState();
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-onSelectOfSource()");
	}
	
}

function processResponseOfDestination() {
	try{
		 if (xhrDest.readyState == 4 && xhrDest.status == 200) {
        destinations = JSON.parse(xhrDest.responseText);

        var clearDestination = document.getElementById("route");
        var destLength = clearDestination.options.length;

        for (i = destLength - 1; i > 0; i--) {
            clearDestination.options[i] = null;
        }

        for (var i = 0; i < destinations.length; i++) {
            var opt = document.createElement("option");

            opt.innerHTML = destinations[i].destination;
            opt.value = destinations[i].destinationId;

            document.getElementById("route").options.add(opt);
        }
    }	
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-processResponseOfDestination()");
	}
   
}

//Fetches Destinations - Ends

//For Populating DropPoints and TimeSlots based on Destination

function onSelectOfDestination() {
	try {
		//Clearing the options of DropPoint drop down
		getServerTime();
		var clearDropPoint = document.getElementById("routesDisplay");
		var dropOptLength = clearDropPoint.options.length;

		for (i = dropOptLength - 1; i > 0; i--) {
			clearDropPoint.options[i] = null;
		}

		//Clearing the options of TimeSlot drop down

		var clearTimeSlot = document.getElementById("timeSlot");
		var timeOptLength = clearTimeSlot.options.length;

		for (i = timeOptLength - 1; i > 0; i--) {
			clearTimeSlot.options[i] = null;
		}
		
		if(request == "Pickup"){
			var clearDate = document.getElementById("datePicker");
			clearDate.value = null;
		}


		var selectedDestination = $("#route option:selected").text();
		for (var i = 0; i < destinations.length; i++) {
			if (destinations[i].destination == selectedDestination) {
				for (var j = 0; j < destinations[i].dropPoints.length; j++) {
					//Binding options of DropPoint

					var dropPointOption = document.createElement("option");

					dropPointOption.innerHTML = destinations[i].dropPoints[j].dropPoint;

					document.getElementById("routesDisplay").options.add(dropPointOption);
				}
				var splitServerTime  = serverTime.split(":");
				
				var curHour = splitServerTime[0];
				var curMin = splitServerTime[1];
				
				var drop = document.getElementById('flexRadioDefault1');
				var pickup = document.getElementById('flexRadioDefault2');
				if (drop.checked == true) {
					for (var k = 0; k < destinations[i].dropTimeSlot.length; k++) {
						//Binding options of TimeSlots

						var timeSlotOption = document.createElement("option");

						var slot = destinations[i].dropTimeSlot[k].dropTimeSlot; //22:30:00
						var slotSplitted = slot.split(":"); //[22,30,00]
						slotHour = slotSplitted[0];
						slotMin = slotSplitted[1];
						if (curHour < slotHour) {
							if (slotHour < 12) {
								if (slotHour == 00) {
									timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " AM";
								} else {
									timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " AM";
								}
							} else {
								slotHour = slotHour - 12;
								if (slotHour == 0) {
									timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
								} else if (slotHour < 10) {
									timeSlotOption.innerHTML = "0" + slotHour + ":" + slotSplitted[1] + " PM";
								} else {
									timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
								}
							}

							document.getElementById("timeSlot").options.add(timeSlotOption);
							}
							else if (curHour == slotHour) {
							if (curMin < slotMin) {
								if (slotHour < 12) {
									if (slotHour == 00) {
										timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " AM";
									} else {
										timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " AM";
									}
								} else {
									slotHour = slotHour - 12;
									if (slotHour == 0) {
										timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
									} else if (slotHour < 10) {
										timeSlotOption.innerHTML = "0" + slotHour + ":" + slotSplitted[1] + " PM";
									} else {
										timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
									}
								}

								document.getElementById("timeSlot").options.add(timeSlotOption);
							}
						} else if (slotHour < 12) {
							if (slotHour == 00) {
								timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " AM";
							} else {
								timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " AM";
							}
							document.getElementById("timeSlot").options.add(timeSlotOption);
						}
			}
		}
		buttonState();
		}
		}
		}
	catch (e) {
		jsExceptionHandling(e, "bookACab.js-onSelectOfDestination()");
	}


}


//End of Populating DropPoints and TimeSlots

function bookACabBlurFunction() {
	try{
		 if (document.getElementById("bookACab-btn").selectedIndex == 0) {
        document.getElementById("route").style.borderColor = "lightgrey";
        bookACabError.innerHTML = "<p style='color: red'>" + "*Required</p>";
        return false;
    } else {
       // bookACabError.innerHTML = "";
        document.getElementById("bookACab-btn").style.borderColor = "lightgrey";
    }
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-bookACabBlurFunction()");
	}
   
}

//Validate for Empty Fields
function checkEmptyFields() {
	try{
		 if (
        document.getElementById("dropLocation").selectedIndex == 0 &&
        document.getElementById("route").selectedIndex == 0 &&
        document.getElementById("drop").selectedIndex == 0 &&
        document.getElementById("timeSlot").selectedIndex == 0 &&
        (document.getElementById("location").value == "" || document.getElementById("location").value == undefined) &&
        (document.getElementById("datePicker").value == "" || document.getElementById("datePicker").value == undefined)
    ) {
        sourceBlurFunction();
        destinationBlurFunction();
        dropPointBlurFunction();
        timeSlotBlurFunction();
        locationBlurFunction();
        dateBlurFunction();
        
        return false;
    }
    else{
	  return true;
	}	
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-checkEmptyFields()");
	}
   
  
}

//Validate for Empty Fields - Ends

//Booking Confirmation PopUp

var sourceSelected;
var destinationSelected;
var dropPointSelected;
var timeSlotSelected;
var currentDate;
var sourceIdSelected;
var destinationIdSelected;
var dropPointIdSelected;
var timeSlotIdSelected;
var dateSelected;
var locationSelected;

function addDays(date, days) {
	try{
	var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
	}
	catch(e){
	jsExceptionHandling(e,"bookACab.js-addDays(date,days)");
	}
   
}

var date = new Date();

function bookARideButtonClicked() {
    try{
	//Fetching server time
	if(request == 'Pickup'){
		if(document.getElementById("datePicker").value < currentDisplayDate || document.getElementById("datePicker").value > nextDays){
			document.getElementById("datePicker").style.borderColor = "red";
	        dateError.innerHTML = "<p style='color: red'>" + "*Invalid</p>";
	        document.getElementById("bookACab-btn").disabled = true;
       		document.getElementById("bookACab-btn").classList.add("ride-disabled");
	        return false;
		}else{
			dateError.innerHTML = "";
        	document.getElementById("datePicker").style.borderColor = "lightgrey";
		}
	}
    var condition = checkEmptyFields();
    if (condition) {
        var xhrTime;
		var url=pathName + "/bookingInfoService/bookingRequest/bookingTime";
        xhrTime=createHttpRequest("GET",url, false,"EMPLOYEE");
        xhrTime.onreadystatechange = responseBookingTime;
        xhrTime.send(null);

        function responseBookingTime() {
            if (xhrTime.readyState == 4 && xhrTime.status == 200) {
                time = xhrTime.responseText;
            }
        }

        $("#popUp-content").empty();
		
		sourceIdSelected = document.querySelector("#dropLocation").value;
        sourceSelected = $("#dropLocation option:selected").text();
        destinationIdSelected = document.querySelector("#route").value;
        destinationSelected = $("#route option:selected").text();
        dropPointSelected = document.querySelector("#routesDisplay").value;
        timeSlotSelected = document.querySelector("#timeSlot").value;
		dateSelected = document.querySelector("#datePicker").value;
		locationSelected = document.querySelector("#location").value;
		
        var bookingTimeDiv = document.createElement("div");
        bookingTimeDiv.className = " col-md-12 col-12 float-start confirm-booking-content";
        time = time.split(" ");

        if (date.getDate() < 10) {
            slotDate = "0" + date.getDate();
        } else {
            slotDate = date.getDate();
        }
        if (date.getMonth() + 1 < 10) {
            slotMonth = "0" + date.getMonth();
        } else {
            slotMonth = date.getMonth();
        }
        if (date.getHours() < 10) {
            slotHour = "0" + date.getHours();
        } else {
            slotHour = date.getHours();
        }

	if(request == "Drop"){
        if (timeSlotSelected.includes("AM")) {
            var checkTime = time[0].split(":")[0];

            if (checkTime >= 12) {
		
                var d = addDays(serverDate, 1);
                if (d.getDate() < 10) {
                    if (d.getMonth() + 1 < 10) {
                        currentDate = "0" + d.getDate() + "-" + "0" + (d.getMonth() + 1) + "-" + d.getFullYear();
                    } else {
                        currentDate = "0" + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                    }
                } else {
                    if (d.getMonth() + 1 < 10) {
                        currentDate = d.getDate() + "-" + "0" + (d.getMonth() + 1) + "-" + d.getFullYear();
                    } else {
                        currentDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                    }
                }
            } else {
                var selectedSlotHour = timeSlotSelected.split(":")[0];
				var pmDate;
                if (checkTime < selectedSlotHour) {
                    pmDate = addDays(serverDate, 0);
                    if (pmDate.getDate() < 10) {
                        if (pmDate.getMonth() < 10) {
                            currentDate = "0" + pmDate.getDate() + "-" + "0" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                        } else {
                            currentDate = "0" + pmDate.getDate() + "-" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                        }
                    } else {
                        if (pmDate.getMonth() < 10) {
                            currentDate = pmDate.getDate() + "-" + "0" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                        } else {
                            currentDate = pmDate.getDate() + "-" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                        }
                    }
                } else {
                    var d = addDays(serverDate, 1);
                    if (d.getDate() < 10) {
                        if (d.getMonth() + 1 < 10) {
                            currentDate = "0" + d.getDate() + "-" + "0" + (d.getMonth() + 1) + "-" + d.getFullYear();
                        } else {
                            currentDate = "0" + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                        }
                    } else {
                        if (d.getMonth() + 1 < 10) {
                            currentDate = d.getDate() + "-" + "0" + (d.getMonth() + 1) + "-" + d.getFullYear();
                        } else {
                            currentDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                        }
                    }
                }
            }
        
        } else {
	
			var splitServerTime  = serverTime.split(":");
				
		    var curHour = splitServerTime[0];
			var curMin = splitServerTime[1];
			
			var timeSlot = timeSlotSelected.split(":");
			var selectedHourTime = timeSlot[0];
			var selectedMinTime = timeSlot[1];
			
			if(curHour>12){
				if(request == 'Pickup' && ((selectedHourTime!= 12 ? Number(selectedHourTime)+12 : selectedHourTime)  <= curHour)){
					pmDate = addDays(serverDate, 1);
			}else if(request == 'Pickup' && ((selectedHourTime != 12 ? Number(selectedHourTime)+12 : selectedHourTime) > curHour)){
				pmDate = addDays(serverDate, 0);
			}
			else if(request == 'Drop'){
				pmDate = addDays(serverDate, 0);
			}
			}
			
			else{
				if(request == 'Pickup' && (selectedHourTime<= curHour-12)){
					pmDate = addDays(serverDate, 1);
			}else if(request == 'Pickup' && (selectedHourTime> curHour-12)){
				pmDate = addDays(serverDate, 0);
			}
			else if(request == 'Drop'){
				pmDate = addDays(serverDate, 0);
			}
            
			}
            if (pmDate.getDate() < 10) {
                if (pmDate.getMonth() + 1 < 10) {
                    currentDate = "0" + pmDate.getDate() + "-" + "0" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                } else {
                    currentDate = "0" + pmDate.getDate() + "-" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                }
            } else {
                if (pmDate.getMonth() + 1 < 10) {
                    currentDate = pmDate.getDate() + "-" + "0" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                } else {
                    currentDate = pmDate.getDate() + "-" + (pmDate.getMonth() + 1) + "-" + pmDate.getFullYear();
                }
            }
        }
        }

        bookingTimeDiv.innerText = "Booking Time: " + timeFormatTo12Hr(time[0], 0);

        var sourceDiv = document.createElement("div");
        sourceDiv.className = " col-md-12 col-12 float-start confirm-booking-content";
        sourceDiv.innerText = "Source: " + sourceSelected;

        var dropPointDiv = document.createElement("div");
        dropPointDiv.className = " col-md-12 col-12 float-start confirm-booking-content";
        if(request == 'Drop'){
        	dropPointDiv.innerText = "Drop Point: " + dropPointSelected;
        }else{
			dropPointDiv.innerText = "Pickup Point: " + dropPointSelected;
		}

        var dateDiv = document.createElement("div");
        dateDiv.className = " col-md-12 col-12 float-start confirm-booking-content";
        if(request == "Drop"){
        	dateDiv.innerText = "Date of Travel: " + currentDate;
        }else{
			var splitDateSelected = dateSelected.split("-");
			var day = splitDateSelected[2];
			var month = splitDateSelected[1];
			var year = splitDateSelected[0];
			var choosedDate = day + "-" + month + "-" + year;
			dateDiv.innerText = "Date of Travel: " +choosedDate;
		}

        var timeSlotDiv = document.createElement("div");
        timeSlotDiv.className = " col-md-12 col-12 float-start confirm-booking-content";
        timeSlotDiv.innerText = "Time Slot: " + timeSlotSelected;
          

        var popUp = document.getElementById("popUp-content");

        popUp.appendChild(bookingTimeDiv);
        popUp.appendChild(sourceDiv);
        popUp.appendChild(dropPointDiv);
        popUp.appendChild(dateDiv);
        popUp.appendChild(timeSlotDiv);
        if(request == "Pickup"){
	        var locationDiv = document.createElement("div");
	        locationDiv.className = "col-md-12 col-12 float-start confirm-booking-content";
	        locationDiv.innerText = "Location : " +locationSelected;
	        popUp.appendChild(locationDiv);
	    }  
	    
        
        document.getElementById("bookACab-btn").setAttribute("data-target", "#confirmbooking");
			
    }
	}
    catch(e){
	jsExceptionHandling(e,"bookACab.js-bookARideButtonClicked()");
	}
    
}
//Booking confirmation pop up ends here


// enable or disable book a ride button
function buttonState() {
	try{
		 if (
        document.getElementById("dropLocation").selectedIndex != 0 &&
        document.getElementById("route").selectedIndex != 0 &&
        document.getElementById("routesDisplay").selectedIndex != 0 &&
        document.getElementById("timeSlot").selectedIndex != 0 
    ) {
	
		if(request == "Pickup"){
			if((document.getElementById("location").value != undefined && document.getElementById("location").value != "") &&
       			 (document.getElementById("datePicker").value != undefined && document.getElementById("datePicker").value != "")
       			 && !(document.getElementById("datePicker").value < currentDisplayDate)
       			 && !(document.getElementById("datePicker").value > nextDays)){
					document.getElementById("bookACab-btn").disabled = false;
       				document.getElementById("bookACab-btn").classList.remove("ride-disabled");
			}
		}else{
	        document.getElementById("bookACab-btn").disabled = false;
	        document.getElementById("bookACab-btn").classList.remove("ride-disabled");
        }
    } else {
        document.getElementById("bookACab-btn").disabled = true;
        document.getElementById("bookACab-btn").classList.add("ride-disabled");
    }
	}
	catch(e){
	jsExceptionHandling(e,"bookACab.js-buttonState()");
	}
   
}

//Posting Booking request using AJAX call

var xhrBooking;
var bookingTimeSlot;
function bookingConfirmationOkButtonClicked() {
	try{
		var splittedTimeSlot = timeSlotSelected.split(":");
    	minute = splittedTimeSlot[1].split(" ")[0];

    if (splittedTimeSlot[1].includes("PM")) {
        
        if (Number(splittedTimeSlot[0]) + 12 == 24) {
            bookingTimeSlot = "12" + ":" + minute;
        } else {
            splittedTimeSlotHour = Number(splittedTimeSlot[0]) + 12;
            bookingTimeSlot = splittedTimeSlotHour + ":" + minute;
        }
    } else {
        seconds = splittedTimeSlot[1].split(" ");
        if (Number(splittedTimeSlot[0]) == 12) {
            bookingTimeSlot = "00" + ":" + minute;
        } else if (Number(splittedTimeSlot[0]) < 10) {
            bookingTimeSlot = "0" + Number(splittedTimeSlot[0]) + ":" + minute;
        } else {
            bookingTimeSlot = Number(splittedTimeSlot[0]) + ":" + minute;
        }
    }
var travelDate;
	if(request == "Drop"){
		var splittedDate = currentDate.split("-");
		travelDate = new Date(serverDate);
		travelDate.setDate(splittedDate[0]);
		travelDate.setMonth(splittedDate[1]-1);
		travelDate.setFullYear(splittedDate[2]);
	}else{
		
		travelDate = dateSelected;
	}
	var bookingRequestBo;
	bookingRequestBo = { employeeDetailId: empDetailId, source: sourceSelected, sourceId:sourceIdSelected,  destination: destinationSelected, destinationId: destinationIdSelected,
	 dropPoint: dropPointSelected, bookingTime: time[0], timeSlot: bookingTimeSlot,dateOfTravel: travelDate, requestType: request };
	if(document.getElementById('flexRadioDefault1').checked == true){
		request = "Drop";
	}
	else{
		request = "Pickup";
		bookingRequestBo.location = locationSelected;
	}
	
	var url=pathName + "/bookingInfoService/bookingRequest/bookACab";
    xhrBooking=createHttpRequest("POST", url, true,"EMPLOYEE");
    xhrBooking.onreadystatechange = bookingResponse;

    xhrBooking.setRequestHeader("Content-Type", "application/json");
    xhrBooking.send(JSON.stringify(bookingRequestBo));
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-bookingConfirmationOkButtonClicked()");
	}
    
}

var bookedResponseObj;
var alreadyBooked = "<h5 class = booked>Already booked a cab </h5>"
function bookingResponse() {
	try {
		if (xhrBooking.readyState == 4 && xhrBooking.status == 200) {
			validationResponse = JSON.parse(xhrBooking.responseText);
			document.getElementById('hideDropDowns').innerHTML = alreadyBooked;
			document.getElementById('hideScreen').style.display = "none";
			window.location.reload();
	}
			

		if (xhrBooking.readyState == 4 && xhrBooking.status == 231) {
			if(document.getElementById('flexRadioDefault1').checked == true){
				bookACabError.innerHTML = "<p style='color: red'>" + "Sorry! You can't book a Cab! Invalid Time Slot Given (OR) You should book " + xhrBooking.getResponseHeader("timeout") + " mins before the required time slot!</p>";
			}else{
				bookACabError.innerHTML = "<p style='color: red'>" + "Sorry! You can't book a Cab! Invalid Time Slot Given (OR) You should book " + (xhrBooking.getResponseHeader("timeout")/60) + " hours before the required time slot!</p>";
			}
			return false;
		}
		else if (xhrBooking.readyState == 4 && xhrBooking.status == 234) {
			bookACabError.innerHTML = "<p style='color: red'>" + "Sorry! You can't book a Cab! Currently the destination was unavailable, please contact Admin</p>";
			return false;
		}

	}
	catch (e) {

		jsExceptionHandling(e, "bookACab.js-bookingResponse()");
	}

}

//Booking made

//Cancel the ride

var cancelXhr;

function cancelTheRideButtonClicked() {
	try {
			var url = pathName + "/bookingInfoService/bookingRequest/cancel/" + bookingToCancel;
			cancelXhr = createHttpRequest("PUT", url, true, "EMPLOYEE");
			cancelXhr.onreadystatechange = cancelProcessResponse;
			cancelXhr.send(null);
			
	}
	catch (e) {
		jsExceptionHandling(e, "bookACab.js-cancelTheRideButtonClicked()");
	}
}

function cancelProcessResponse() {
	try{
		if (cancelXhr.readyState == 4 && cancelXhr.status == 200) {
			
            	document.getElementById('hideOfficeLocation').style.display = 'none';
            	document.getElementById('hideDropRouteLocation').style.display = 'none';
            	document.getElementById('hideDropLocation').style.display = 'none';
            	document.getElementById('hideDropTimeSlot').style.display = 'none';
          
           window.location.href = "/user/bookacab";
           
        }

        if (cancelXhr.readyState == 4 && cancelXhr.status == 228) {
            document.getElementById("destination").style.borderColor = "red";
            bookACabError.innerHTML = "<p style='color: red'>" + "Cab has been assigned for you! You can't cancel your booking!</p>";
            return false;
        } else {
            bookACabError.innerHTML = "";
            document.getElementById("bookACab-btn").style.borderColor = "black";
        }

	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-cancelProcessResponse()");
	}
        
}

//Cancelling the ride end

function radioButtonClicked(requestType){
	try{
	request = requestType;
	clear();
	if(document.getElementById('flexRadioDefault1').checked == true){
		dropLabel = document.getElementById('labelDrop');
		dropLabel.innerText = "Office Location";
		
		var dropPointLabel = document.getElementById('pickupPoint');
		dropPointLabel.innerText = "Drop Point";
		
		var dropOption = document.getElementById('optionChange');
		dropOption.innerText = "Select Drop Point";
		
		var hideLocation = document.getElementById('hideLocationDiv');
		hideLocation.style.display = "none";
		
		var hideDate = document.getElementById('hideDateDiv');
		hideDate.style.display = "none";
	
	}
	else if(document.getElementById('flexRadioDefault2').checked == true){
		var pickupLabel = document.getElementById('labelDrop');
		pickupLabel.innerText = "Drop Location";
	
		var dropPointLabel = document.getElementById('pickupPoint');
		dropPointLabel.innerText = "Pickup Point";
		
		var dropOption = document.getElementById('optionChange');
		dropOption.innerText = "Select Pickup Point";
		
		var hideLocation = document.getElementById('hideLocationDiv');
		hideLocation.style.display = "block";
		
		var hideDate = document.getElementById('hideDateDiv');
		hideDate.style.display = "block";
		
	}
	for(var i=0; i<validationResponse.length; i++) {
		if(validationResponse[i].requestType == requestType){
			document.getElementById('hideDropDowns').innerHTML = alreadyBooked;
			document.getElementById('hideScreen').style.display = "none";
			break;
		}	
		else{
			document.getElementById('hideDropDowns').innerHTML = "";
			document.getElementById('hideScreen').style.display = "block";
		}
	}
	}catch(e){
		jsExceptionHandling(e,"bookACab.js-radioButtonClicked(requestType)");
	}
	
}

function clear(){
	try{
		document.getElementById('locationValue').selected = true;
		document.getElementById('routeValue').selected = true;
		document.getElementById('optionChange').selected = true;
		document.getElementById('timeValue').selected = true;
	}catch(e){
		jsExceptionHandling(e,"bookACab.js-clear()");
	}	
}

function reloadOnClear(){
	window.location.href = "/user/bookacab";
}

var currentDisplayDate;
var nextDays;
function enableDatePicker(){
	try{
	var splitDate = serverDate.split("/");
	var year = splitDate[2];
	var month = splitDate[0];
	var day = splitDate[1];
	
	currentDisplayDate = year + "-" + month + "-" + day;
	document.getElementById("datePicker").setAttribute('min', currentDisplayDate);
	
	let changeServerDateFormat = new Date(serverDate);

	var weekDays = changeServerDateFormat.getDay();
	if(weekDays == 5){
		
		changeServerDateFormat = addDays(changeServerDateFormat, 3);
		
	}else if(weekDays == 6){
		
		changeServerDateFormat = addDays(changeServerDateFormat, 2);
		
	}else{
		
		changeServerDateFormat = addDays(changeServerDateFormat, 1);
	}
	
	var splitYearAddMaxDays = changeServerDateFormat.getFullYear();
	var splitMonthAddMaxDays = changeServerDateFormat.getMonth()+1;
	if(splitMonthAddMaxDays<=9){
		splitMonthAddMaxDays = "0" + splitMonthAddMaxDays;
	}
	
	var splitDayAddMaxDays = changeServerDateFormat.getDate();
	if(splitDayAddMaxDays<=9){
		splitDayAddMaxDays = "0" + splitDayAddMaxDays;
	}
	
	nextDays = splitYearAddMaxDays+ "-"+splitMonthAddMaxDays+"-"+splitDayAddMaxDays;
	document.getElementById("datePicker").setAttribute('max', nextDays);
	}
	catch(e){
		jsExceptionHandling(e,"bookACab.js-enableDatePicker()");
	}
	
}

document.getElementById('datePicker').addEventListener("change", onSelectOfDatePicker);
function onSelectOfDatePicker(){
	try{
	
	var clearTimeSlot = document.getElementById("timeSlot");
		var timeOptLength = clearTimeSlot.options.length;

		for (i = timeOptLength - 1; i > 0; i--) {
			clearTimeSlot.options[i] = null;
		}
				var splitServerTime  = serverTime.split(":");
				
				var curHour = splitServerTime[0];
				var curMin = splitServerTime[1];
				
				var pickup = document.getElementById('flexRadioDefault2');

		var selectedDestination = $("#route option:selected").text();
		for (var i = 0; i < destinations.length; i++) {
			if (destinations[i].destination == selectedDestination) {
				if (pickup.checked == true) {
					
					for (var k = 0; k < destinations[i].pickupTimeSlot.length; k++) {
						//Binding options of TimeSlots

						var timeSlotOption = document.createElement("option");

						var slot = destinations[i].pickupTimeSlot[k].pickupTimeSlot; //22:30:00
						var slotSplitted = slot.split(":"); //[22,30,00]
						slotHour = slotSplitted[0];
						slotMin = slotSplitted[1];
						var selectedDate = document.getElementById("datePicker").value;
						var splitSelectedDate = selectedDate.split("-");
						var dateOfSelectedDate = splitSelectedDate[2];
						var serverDateSplit = serverDate.split("/");
						var dateOfServerDate = serverDateSplit[1];
						if(dateOfSelectedDate == dateOfServerDate){
							if (curHour < slotHour) {
							if (slotHour < 12) {
								if (slotHour == 00) {
									timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " AM";
								} else {
									timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " AM";
								}
							} else {
								slotHour = slotHour - 12;
								if (slotHour == 0) {
									timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
								} else if (slotHour < 10) {
									timeSlotOption.innerHTML = "0" + slotHour + ":" + slotSplitted[1] + " PM";
								} else {
									timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
								}
							}

							document.getElementById("timeSlot").options.add(timeSlotOption);
								if (curHour == slotHour) {
							if (curMin < slotMin) {
								if (slotHour < 12) {
									if (slotHour == 00) {
										timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
									} else {
										timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
									}
								} else {
									slotHour = slotHour - 12;
									if (slotHour == 0) {
										timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
									} else if (slotHour < 10) {
										timeSlotOption.innerHTML = "0" + slotHour + ":" + slotSplitted[1] + " PM";
									} else {
										timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
									}
								}

								document.getElementById("timeSlot").options.add(timeSlotOption);
							}
							else if (slotHour < 12) {
							if (slotHour == 00) {
								timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
							} else {
								timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
							}
							document.getElementById("timeSlot").options.add(timeSlotOption);
						}
						} 
						} 
						}	else{
							if (slotHour < 12) {
								if (slotHour == 00) {
									timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " AM";
								} else {
									timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " AM";
								}
							} else {
								slotHour = slotHour - 12;
								if (slotHour == 0) {
									timeSlotOption.innerHTML = "12" + ":" + slotSplitted[1] + " PM";
								} else if (slotHour < 10) {
									timeSlotOption.innerHTML = "0" + slotHour + ":" + slotSplitted[1] + " PM";
								} else {
									timeSlotOption.innerHTML = slotHour + ":" + slotSplitted[1] + " PM";
								}
							}

							document.getElementById("timeSlot").options.add(timeSlotOption);
							}
					}
				}
				}
				}
		}catch(e){
			jsExceptionHandling(e,"bookACab.js-onSelectOfDatePicker()");
		}		
}

document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === 'visible') {
		setIntervalOperation =  setInterval(
			pageValidateBooking, 90000);
	}else{
		clearInterval(setIntervalOperation);
	}
});
//window.onfocus = window.onblur = function(e) {
//	if ((e || event).type === "blur") {
//			console.log(event.type);
//		clearInterval(setIntervalOperation);
//	} else if ((e || event).type === "focus") {
//		setIntervalOperation = setInterval(
//			pageValidateBooking, 6000);
//	}
//	console.log(event.type);
//}
