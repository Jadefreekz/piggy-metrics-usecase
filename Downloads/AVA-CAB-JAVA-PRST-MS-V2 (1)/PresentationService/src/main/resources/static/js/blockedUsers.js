var xhrBlockedUsersCount;
var xhrBlockedUserDetails;
var xhrUnblockUser;
var xhrFilterSearchCount;
var xhrFilterSearchDetails;
var tbody = document.getElementById("tablebody");
var index;
var pageIndex;
var pages;
var rowCounter;
var obj;
var skip;
var filteredPages;
var totalCount;
var objCount;
var limit;
var filterAndSearch = false;

var errorFilter = document.getElementById("empty-check");

var noRecordBlockedUsers = "<h5 class = noRecordsFound>No Records Found </h5>";

var searchApplied = false;

var filterApplied = false;

//This method is used to get total count on load// 
window.onload = getBlockedCount;
function getBlockedCount() {

try{
	xhrBlockedUsersCount = createHttpRequest("GET", pathName + "/blocked/users/totalBlockedUsersCount", true, "ADMIN");  //ajax call to get the total count
	xhrBlockedUsersCount.onreadystatechange = getNoOfBlockedRecords;
	xhrBlockedUsersCount.send();
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-getBlockedCount()");
	}
}
//End of the method//

//This method is used to get the total number of records of blocked users//
function getNoOfBlockedRecords() {

try{
	if (xhrBlockedUsersCount.readyState == 4 && xhrBlockedUsersCount.status == 200) {

		limit = xhrBlockedUsersCount.getResponseHeader("limit");
		totalCount = JSON.parse(xhrBlockedUsersCount.responseText);
		pages = Math.ceil(totalCount / limit);

		if (totalCount == 0) {

			document.getElementById('noRecordUsers').innerHTML = noRecordBlockedUsers;  //If no records found

		}

		else {

			createBlockedUsersPagination(pages, 1);                                  //Calls the method to perform pagination

		}
	}
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-getNoOfBlockedRecords()");
	}
}

//This method is used to get the list of blocked users//
function getBlockedUsers(index) {

try{
	xhrBlockedUserDetails = createHttpRequest("GET", pathName + "/blocked/users/blockedUsers/" + index, true, "ADMIN");
	xhrBlockedUserDetails.onreadystatechange = blockedUserInfoProcessResponse;
	xhrBlockedUserDetails.send();
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-getBlockedUsers(index)");
	}
	}

	function blockedUserInfoProcessResponse() {
		
		try{

		if (xhrBlockedUserDetails.readyState == 4 && xhrBlockedUserDetails.status == 200) {

			var obj = JSON.parse(xhrBlockedUserDetails.responseText);
			dynamicCreation(obj);
			var countDisplay = document.getElementById("countForBlocked");
			countDisplay.innerHTML = "#Records: " +$('#tablebody tr').length + " out of " + totalCount;
		}
		}
		catch(e){
			jsExceptionHandling(e, "blockedUsers.js-blockedUserInfoProcessResponse()");
		}
	}

function dynamicCreation(obj) {

try{
	rowCounter = 0;

	$("#tablebody").empty();

	for (var rows = 0; rows < obj.length; rows++) {

		var tr = document.createElement('tr');
		rowCounter++;
		tr.id = "tr" + rowCounter;
		tbody.appendChild(tr);
		tr.className = "row-bg-style";
		
		var tdEmployeeDetailId = document.createElement('td');
		tdEmployeeDetailId.className = "spacing";
		tdEmployeeDetailId.innerHTML = obj[rows].employeeDetailId;
		tr.appendChild(tdEmployeeDetailId);
		tdEmployeeDetailId.style.display="none";
		
       

		var tdEmpId = document.createElement('td');
		tdEmpId.className = "spacing";
		tdEmpId.innerHTML = obj[rows].employeeId;
		tr.appendChild(tdEmpId);
		

		var tdEmpName = document.createElement('td');
		tdEmpName.className = "spacing";
		tdEmpName.innerHTML = obj[rows].employeeName;
		tr.appendChild(tdEmpName);

		var tdDomain = document.createElement('td');
		tdDomain.className = "spacing";
		tdDomain.innerHTML = obj[rows].domain;
		tr.appendChild(tdDomain);

		var tdBlockedDate = document.createElement('td');
		tdBlockedDate.className = "spacing";
		var blockedDate = obj[rows].blockedDate;
		var formattedDate = blockedDate.split("T");
		var dateBlocked = formattedDate[0].split("-");
		tdBlockedDate.innerHTML = dateBlocked[2] + "-" + dateBlocked[1] + "-" + dateBlocked[0];
		tr.appendChild(tdBlockedDate);

		var tdUnBlock = document.createElement('td');
		tdUnBlock.className = "spacing text-center";
		tdUnBlock.innerHTML = "<a href='#' title='unblock' class='actions-image'><img class = 'block-user' src='images/block-user.svg' data-target='#block-pop' data-toggle='modal' onclick='findId(this)' alt='unblock-icon' /></a>";
		tr.appendChild(tdUnBlock);
		tbody.appendChild(tr);

	}
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-dynamicCreation(obj)");
	}

}

//Method to perform pagination//
function createBlockedUsersPagination(pages, index) {

try{
	if (filterAndSearch) {

		getBlockedUsersByFilterAndSearch(index - 1);

	}
	else {

		getBlockedUsers(index - 1);              //Calls the method get driver details. When index 1 is clicked, then performs index-1 = 0 and loads the first set of records

	}

	let str = '<ul class= "ul-tag">';

	let active;
	let previousButton = index - 1;
	let nextButton = index + 1;


	if (index > 1) {         //When index is > 1 then, shows the previous arrow

		str += '<li class="page-item"><a class="page-link pagination-border" onclick="createBlockedUsersPagination(pages, ' + (index - 1) + ')"><img src="images/pagination-prev-arrow.svg"  /></a></li>';

	}
	if (pages < 6) {          //Sets the active page and increments the pages based on the total records and limit
		for (let p = 1; p <= pages; p++) {
			active = index == p ? "active" : "no";
			str += '<li class="' + active + '" ><a class="page-link pagination-border a-tag" onclick="createBlockedUsersPagination(pages, ' + p + ')">' + p + '</a></li>';
		}
	}

	else {
		if (index > 2) {	 //Sets 1 as active 
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createBlockedUsersPagination(pages, 1)">1</a></li>';
			if (index > 3) { //Sets ... after the index of 4
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createBlockedUsersPagination(pages,' + (index - 2) + ')">...</a></li>';
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
			str += '<li class="page-item ' + active + '"><a class="page-link pagination-border" onclick="createBlockedUsersPagination(pages, ' + p + ')">' + p + '</a></li>';
		}

		if (index < pages - 1) {
			if (index < pages - 2) {
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createBlockedUsersPagination(pages,' + (index + 2) + ')">...</a></li>';
			}
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createBlockedUsersPagination(pages, pages)">' + pages + '</a></li>';
		}
	}
	if (index < pages) {
		str += '<li class="page-item"><a class="page-link pagination-border" onclick="createBlockedUsersPagination(pages, ' + (index + 1) + ')"><img src="images/pagination-next-arrow.svg" alt="page-arrow"  /></a></li>';
	}
	str += '</ul>';

	document.getElementById('blockedPagination').innerHTML = str;
	return str;
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-createBlockedUsersPagination(pages, index)");
	}

}
//End of the method//

//To get the unblock row//
var rowId;
function findId(obj) {
	try{

	var tRowId = obj.closest("tr");
	rowId = tRowId.id;
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-findId(obj)");
	}
}
//End of the method//

//This method is used to unblock the employee//
function unblockUser() {

try{
	var unblockEmpid = document.getElementById(rowId).cells[0].innerHTML;

	xhrUnblockUser = createHttpRequest("PUT", pathName + "/blocked/users/unBlockUser/" + unblockEmpid, true, "ADMIN");
	xhrUnblockUser.send(null);
	xhrUnblockUser.onreadystatechange = function() {

		if (xhrUnblockUser.readyState == 4 && xhrUnblockUser.status == 200) {

			window.location.reload();
		}
	}
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-unblockUser()");
	}

}
//End of the method//

//Search and filter starts//    
document.getElementById("searchTab").addEventListener('keyup', function(event) {
	
	try{

	var filter = document.getElementById('apply-filter');
	filter.setAttribute('src', 'images/VectorFilter.svg');
	searchApplied = true;
	filterApplied = true;
	skip = 0;
	getBlockedUsersCountByFilterAndSearch();
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-addEventListener(keyup(searchTab))");
	}
	
})

document.getElementById('apply-filter').addEventListener('click', function() {

try{
	skip = 0;
	filterApplied = true;

	checkEmptyFields();
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-addEventListener(click(apply-filter))");
	}


});

//To check empty fields//
function checkEmptyFields() {

try{
	var domainName = document.getElementById('domain').value;
	var from = document.getElementById('from').value;
	var to = document.getElementById('to').value;

	if (domainName == "" && from == "" && to == "") {
		document.getElementById('domain').classList.remove("border-filter-style1");
		document.getElementById('domain').style.borderColor = "red";
		document.getElementById('from').style.borderColor = "red";
		document.getElementById('to').style.borderColor = "red";

		errorFilter.innerHTML = "<p style='color: red'>" +
			"Fill atleast one field to filter the records</p>";

		return false;

	}

	else {

		errorFilter.innerHTML = "";

		document.getElementById('domain').classList.add("border-filter-style1");
		document.getElementById('domain').style.borderColor = "lightgrey";
		document.getElementById('from').style.borderColor = "lightgrey";
		document.getElementById('to').style.borderColor = "lightgrey";

		getBlockedUsersCountByFilterAndSearch();

		document.getElementById("filterModal").classList.remove("show");

		return true;
	}
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-checkEmptyFields()");
	}

}

//To get the record count on filter and search//
function getBlockedUsersCountByFilterAndSearch() {

try{
	filterAndSearch = true;
	var domainName;
	var from;
	var to;
	var search;

	var filterBO = {};

	if (document.getElementById("domain").value != "") {

		domainName = document.getElementById('domain').value;

	}
	else {

		domainName = null;

	}

	if (document.getElementById("from").value != "") {

		from = document.getElementById('from').value + "T00:00:00";

	}
	else {

		from = null;

	}

	if (document.getElementById("to").value != "") {

		to = document.getElementById('to').value + "T00:00:00";
	}
	else {

		to = null;
	}

	if (document.getElementById("searchTab").value != "") {

		search = document.getElementById('searchTab').value.trim();

	}
	else {

		search = null;

	}

	filterBO = { "domainName": domainName, "from": from, "to": to, "searchText": search };

	xhrFilterSearchCount = createHttpRequest("POST", pathName + "/blocked/users/totalBlockedUsers/byFilterAndSearch", true, "ADMIN");

	xhrFilterSearchCount.setRequestHeader("Content-Type", "application/json");
	xhrFilterSearchCount.onreadystatechange = function() {

		if (xhrFilterSearchCount.readyState == 4 && xhrFilterSearchCount.status == 200) {


			objCount = JSON.parse(xhrFilterSearchCount.responseText);

			pages = Math.ceil(objCount / limit);

			if (objCount == 0) {

				document.getElementById('noRecordUsers').innerHTML = noRecordBlockedUsers;

				document.getElementById('tablebody').style.display = "none";
				createBlockedUsersPagination(pages, 1);
			}

			else {

				document.getElementById('noRecordUsers').innerHTML = "";

				document.getElementById('tablebody').style.display = "table-row-group";
				createBlockedUsersPagination(pages, 1);
			}

		}
	};
	xhrFilterSearchCount.send(JSON.stringify(filterBO));
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-getBlockedUsersCountByFilterAndSearch()");
	}

}


//To get the details on filter and search//
function getBlockedUsersByFilterAndSearch(index) {
try{
	filterApplied = false;
	searchApplied = true;

	skip = 0;

	var filterBtn = document.getElementById('apply-filter');

	filterBtn.setAttribute('src', 'images/Vector.svg');

	var domainName;
	var from;
	var to;

	var search;

	var filterBO = {};

	if (document.getElementById("domain").value != "") {

		domainName = document.getElementById('domain').value;

	}
	else {

		domainName = null;

	}

	if (document.getElementById("from").value != "") {

		from = document.getElementById('from').value + "T00:00:00";

	}
	else {

		from = null;

	}

	if (document.getElementById("to").value != "") {

		to = document.getElementById('to').value + "T00:00:00";
	}
	else {

		to = null;
	}

	if (document.getElementById("searchTab").value != "") {

		search = document.getElementById('searchTab').value.trim();

	}
	else {

		search = null;

	}

	filterBO = { "domainName": domainName, "from": from, "to": to, "searchText": search };

	xhrFilterSearchDetails = createHttpRequest("POST", pathName + "/blocked/users/filteredBlockedUsers/" + index, true, "ADMIN");

	xhrFilterSearchDetails.setRequestHeader("Content-Type", "application/json");
	xhrFilterSearchDetails.send(JSON.stringify(filterBO));
	xhrFilterSearchDetails.onreadystatechange = processResponseBlockedUsersFilter;
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-getBlockedUsersByFilterAndSearch(index)");
	}
}



function processResponseBlockedUsersFilter() {

try{
	if (xhrFilterSearchDetails.readyState == 4 && xhrFilterSearchDetails.status == 200) {

		var obj = JSON.parse(xhrFilterSearchDetails.responseText);
		dynamicCreation(obj);

		var countDisplay = document.getElementById("countForBlocked");
		countDisplay.innerHTML = "#Records: " + $('#tablebody tr').length + " out of " + objCount;
	}
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-processResponseBlockedUsersFilter()");
	}
}

document.getElementById('cancelButton').addEventListener('click', clear);
document.getElementById('cancelButton').addEventListener('click', close);
//End of the method//

//To clear the text fields in filter//
function clear() {

try{
	document.getElementById('domain').value = "";
	document.getElementById('from').value = "";
	document.getElementById('to').value = "";
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-clear()");
	}
}
//End of the method//

//To close the popup//
function close() {

try{
	filterAndSearch = false;
	document.getElementById("filterModal").classList.remove("show");
	document.getElementById('tablebody').style.display = "table-row-group";
	document.getElementById('noRecordUsers').innerHTML = "";

	errorFilter.innerHTML = "";

	document.getElementById('domain').classList.add("border-filter-style1");
	document.getElementById('domain').style.borderColor = "lightgrey";
	document.getElementById('from').style.borderColor = "lightgrey";
	document.getElementById('to').style.borderColor = "lightgrey";
	$('#tablebody').empty();
	getBlockedCount();
	}
	catch(e){
		jsExceptionHandling(e, "blockedUsers.js-close()");
	}

}
//End of the method//

// Sort the table
function sortBlockedTable(tdNum, orderType) {

try{
	var rows, switching, i, x, y, shouldSwitch;
	tBody = document.getElementById("tablebody");
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
		jsExceptionHandling(e, "blockedUsers.js-sortBlockedTable(tdNum, orderType)");
	}
}
//End of the method//







