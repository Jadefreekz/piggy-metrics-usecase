var role = localStorage.getItem('role');
var employeeId = localStorage.getItem('employeeId');
var empDetailId = localStorage.getItem("employeeDetailId");

//get the AdminId and employeeId in query parameter and role
var noticount;
var adminData;
var userData;
var containerdiv = document.getElementById("parentDiv");
var notifyWrapper = document.getElementById("notification-wrapper");
var notifyMobileWrapper = document.getElementById("notification-wrapper-mob")
var notificationCount = document.getElementById("notification-count");

//Removing the set interval inorser to reduce the api hits to db
// 5 seconds once ajax call
//if (role == "EMPLOYEE") {
//	setInterval(notificationsUser, 5000);
//	}
//else {
//	setInterval(notificationsAdmin, 5000);
//}
// no records found
var noRecord = "<h6 class = 'noRecords'>No Records Found</h6>"


// Admin Notifications
function notificationsAdmin() {
	try{

	var url = pathName + "/notificationService/admin/adminNotification/" + employeeId;

	var xhrAdmin = createHttpRequest("GET", url, true, "ADMIN");

	xhrAdmin.onreadystatechange = adminProcessResponse;
	xhrAdmin.send();
	}
	catch(exception){
		jsExceptionHandling(exception,"notification.js - notificationsAdmin");
	}
}

function adminProcessResponse() {
	try{

	if (this.readyState == 4 && this.status == 200) {
		adminData = JSON.parse(this.responseText);

		if (adminData.length <= 4) {
			notifyWrapper.classList.remove('scrollStyle');
			notifyMobileWrapper.classList.remove('scrollStyle');
		} else {
			notifyWrapper.classList.add('scrollStyle');
			notifyMobileWrapper.classList.remove('scrollStyle');
		}

		if (adminData == "") {
			document.getElementById("noRecord").innerHTML = noRecord;
			document.getElementById("noRecordMob").innerHTML = noRecord;
			document.getElementById('totalCount').innerHTML = "0";
			document.getElementById('totalCountMobile').innerHTML = "0";
			notifyWrapper.innerHTML = "";
			notifyMobileWrapper.innerHTML = "";
		}
		else {

			document.getElementById("noRecord").innerHTML = "";
			document.getElementById("noRecordMob").innerHTML = "";
			noticount = adminData.length;
			if (adminData.length > 0) {
				document.getElementById("notificationId").src = "images/notification.svg";


			}

			notifyWrapper.innerHTML = "";
			notifyMobileWrapper.innerHTML = "";


			for (var i = 0; i < adminData.length; i++) {


				var eachNotification = document.createElement('div');
				eachNotification.className = "row mb-3";
				var eachNotificationMobile = document.createElement('div');
				eachNotificationMobile.className = "row mb-3";

				var notiOutlet = document.createElement('div');
				notiOutlet.className = "col-md-12 float-start topnav-border";
				var notiOutletMobile = document.createElement('div');
				notiOutletMobile.className = "col-md-12 float-start topnav-border";

				var notiContent = document.createElement('p');
				notiContent.className = "float-start notification-content";
				var notiContentMobile = document.createElement('p');
				notiContentMobile.className = "float-start notification-content";

				var header = document.createElement('h6');
				header.className = 'notification-time float-end';
				header.id = 'markAsRead'+i
				
				var headerMobile = document.createElement('h6');
				headerMobile.className = 'notification-time float-end';
				headerMobile.id = 'markAsReadMob'+i

				
				var generatedtime = adminData[i].generatedTime;
				header.innerHTML = timeFormatTo12Hr(generatedtime, 0) + "<a class ='markAsRead' id = 'markAsRead" + i + "' onclick =userReadResponse(this)>MarkAsRead</a>" + "<h5 id='notNum" + i + "' class = 'notification-num'>" + adminData[i].notificationNum + "</h5>";
				var generatedtimeMobile = adminData[i].generatedTime;
				headerMobile.innerHTML = timeFormatTo12Hr(generatedtimeMobile, 0) + "<a class ='markAsRead' id = 'markAsAllReadMobile" + i + "' onclick =userReadResponseMob(this)>MarkAsRead</a>" + "<h5 id='notNumMobile" + i + "' class = 'notification-num'>" + adminData[i].notificationNum + "</h5>";


				var description = adminData[i].notificationDescription;
				var descriptionMobile = adminData[i].notificationDescription;
				if (description.includes("has")) {
					notiContent.innerHTML = "<img src='images/comp-red.svg' class='notification-icon float-start' alt='notifyicon' style='margin-right:5px'>" + " " + adminData[i].employeeName + " " + "<span class='color'> " + description + "</span>";

				}
				else {
					notiContent.innerHTML = "<img src='images/success.svg' class='notification-icon float-start' alt='notifyicon' style='margin-right:5px'>" + " " + adminData[i].tripCabInfo.cabNumber + " " + "<span class='color'> " + description + "</span>";
				}
				if (descriptionMobile.includes("has")) {
					notiContentMobile.innerHTML = "<img src='images/comp-red.svg' class='notification-icon float-start' alt='notifyicon' style='margin-right:5px'>" + " " + adminData[i].employeeName + " " + "<span class='color'> " + descriptionMobile + "</span>";

				}
				else {
					notiContentMobile.innerHTML = "<img src='images/success.svg' class='notification-icon float-start' alt='notifyicon' style='margin-right:5px'>" + " " + adminData[i].tripCabInfo.cabNumber + " " + "<span class='color'> " + descriptionMobile + "</span>";
				}


				notiOutlet.appendChild(notiContent);
				notiOutlet.appendChild(header);
				eachNotification.appendChild(notiOutlet);
				notifyWrapper.appendChild(eachNotification);
				notiOutletMobile.appendChild(notiContentMobile);
				notiOutletMobile.appendChild(headerMobile);
				eachNotificationMobile.appendChild(notiOutletMobile);
				notifyMobileWrapper.appendChild(eachNotificationMobile);

			}


			var notifyTimeAndRead = document.createElement('div');
			var notifyTimeAndReadMobile = document.createElement('div');

			var parentDiv = document.createElement('div');
			parentDiv.className = "col-md-12 mt-3";
			var parentDivMobile = document.createElement('div');
			parentDivMobile.className = "col-md-12 mt-3";

			var childDiv = document.createElement('div');
			childDiv.className = "col-md-6 float-start";
			var childDivMobile = document.createElement('div');
			childDivMobile.className = "col-md-6 float-start";

			var totalCount = document.createElement('h6');
			totalCount.className = "total-records";
			var totalCountMobile = document.createElement('h6');
			totalCountMobile.className = "total-records";

			var time = document.createElement('div');
			time.className = "col-md-6 float-end";
			var timeMobile = document.createElement('div');
			timeMobile.className = "col-md-6 float-end";

			var markAsRead = document.createElement('h6');
			var markAsReadMobile = document.createElement('h6');

			markAsRead.className = "float-end total-records";
			markAsRead.id = "markAsAllRead";
			markAsReadMobile.className = "float-end total-records";
			markAsReadMobile.id = "markAsAllReadMobile";
			document.getElementById('totalCount').innerHTML = adminData.length;
			document.getElementById('totalCountMobile').innerHTML = adminData.length;
			markAsRead.innerHTML = "<a style='cursor:pointer' id= 'markAsAllRead' onclick ='markAsAllRead()'>Clear All</a>";
			markAsReadMobile.innerHTML = "<a style='cursor:pointer' id= 'markAsAllReadMobile' onclick ='markAsAllRead()'>Clear All</a>";
			if (adminData.length > 0) {
				time.appendChild(markAsRead);
				timeMobile.appendChild(markAsReadMobile);
			}
			childDiv.appendChild(totalCount);
			parentDiv.appendChild(childDiv);
			parentDiv.appendChild(time);
			notifyTimeAndRead.appendChild(parentDiv);
			notifyWrapper.appendChild(notifyTimeAndRead);
			
			childDivMobile.appendChild(totalCountMobile);
			parentDivMobile.appendChild(childDivMobile);
			parentDivMobile.appendChild(timeMobile);
			notifyTimeAndReadMobile.appendChild(parentDivMobile);
			notifyMobileWrapper.appendChild(notifyTimeAndReadMobile);



		}

	}
}
catch(exception){
	jsExceptionHandling(exception,"notification.js - adminProcessResponse");
}
}
//-------------------------------------------------------------------------------------------------------------------------//
// User Notifications
function notificationsUser() {
try{
	var xhrUser = new XMLHttpRequest();
	const url = pathName + "/notificationService/user/userNotification/" + empDetailId;
	var xhrUser = createHttpRequest("GET", url, true, "EMPLOYEE");
	xhrUser.onreadystatechange = userProcessResponse;
	
	xhrUser.send();
	}
	catch(exception){
		jsExceptionHandling(exception,"notification.js - notificationsUser");
	}
}

function userProcessResponse() {
	try{

	if (this.readyState == 4 && this.status == 200) {
		userData = JSON.parse(this.responseText);

		if (userData.length <= 4) {
			notifyWrapper.classList.remove('scrollStyle');
			notifyMobileWrapper.classList.remove('scrollStyle');
		} else {
			notifyWrapper.classList.add('scrollStyle');
			notifyMobileWrapper.classList.add('scrollStyle');
		}

		if (userData == "") {

			document.getElementById("noRecord").innerHTML = noRecord;
			document.getElementById("noRecordMob").innerHTML = noRecord;
			notifyWrapper.innerHTML = "";
			notifyMobileWrapper.innerHTML = "";
			document.getElementById('totalCount').innerHTML = "0";
			document.getElementById('totalCountMobile').innerHTML = "0";
		}

		else {
			document.getElementById("noRecord").innerHTML = "";
			noticount = userData.length;
			if (userData.length > 0) {
				document.getElementById("notificationId").src = "images/notification.svg";

			}
			notifyWrapper.innerHTML = "";
			notifyMobileWrapper.innerHTML = "";
			for (var i = 0; i < userData.length; i++) {


				var eachNotification = document.createElement('div');
				eachNotification.className = "row mb-3";
				
				var eachNotificationMobile = document.createElement('div');
				eachNotificationMobile.className = "row mb-3"

				var notiOutlet = document.createElement('div');
				notiOutlet.className = "col-md-12 float-start topnav-border";
				
				var notiOutletMobile = document.createElement('div');
				notiOutletMobile.className = "col-md-12 float-start topnav-border";

				var notiContent = document.createElement('p');
				notiContent.className = "float-start notification-content";
				
				var notiContentMobile = document.createElement('p');
				notiContentMobile.className = "float-start notification-content";

				var header = document.createElement('h6');
				header.className = 'notification-time float-end';
				header.id = 'markAsRead'+i;
				
				var headerMobile = document.createElement('h6');
				headerMobile.className = 'notification-time float-end';
				headerMobile.id = 'markAsReadMob'+i;

				var generatedtime = userData[i].generatedTime;
				header.innerHTML = timeFormatTo12Hr(generatedtime, 0) + "<a class ='markAsRead' id = 'markAsRead1" + i + "' onclick =adminReadResponse(this)>MarkAsRead</a>" + "<h5 id='notiNum1" + i + "' class = 'notification-num'>" + userData[i].notificationNum + "</h5>";
				var description = userData[i].notificationDescription;
				
				var generatedtimeMob = userData[i].generatedTime;
				headerMobile.innerHTML = timeFormatTo12Hr(generatedtimeMob, 0) + "<a class ='markAsRead' id = 'markAsReadMob" + i + "' onclick =adminReadResponseMobile(this)>MarkAsRead</a>" + "<h5 id='notiNumMob" + i + "' class = 'notification-num'>" + userData[i].notificationNum + "</h5>";
				var descriptionMob = userData[i].notificationDescription;
				
				notiContent.innerHTML = "<img src='images/notification-icon.png' class='notification-icon float-start' alt='notifyicon' style='margin-right:5px'>" + "   " + "  " + "<span class='color'> " + "  " + description + "</span>";
				notiContentMobile.innerHTML = "<img src='images/notification-icon.png' class='notification-icon float-start' alt='notifyicon' style='margin-right:5px'>" + "   " + "  " + "<span class='color'> " + "  " + descriptionMob + "</span>";

				notiOutlet.appendChild(notiContent);
				notiOutletMobile.appendChild(notiContentMobile);
				notiOutlet.appendChild(header);
				notiOutletMobile.appendChild(headerMobile);
				eachNotification.appendChild(notiOutlet);
				eachNotificationMobile.appendChild(notiOutletMobile);
				notifyWrapper.appendChild(eachNotification);
				notifyMobileWrapper.appendChild(eachNotificationMobile);


			}
			var notifyTimeAndRead = document.createElement('div');
			
			var notifyTimeAndReadMobile = document.createElement('div');

			var parentDiv = document.createElement('div');
			parentDiv.className = "col-md-12 mt-3";
			
			var parentDivMobile = document.createElement('div');
			parentDivMobile.className = "col-md-12 mt-3";

			var childDiv = document.createElement('div');
			childDiv.className = "col-md-6 float-start";
			
			var childDivMobile = document.createElement('div');
			childDivMobile.className = "col-md-6 float-start";

			var totalCount = document.createElement('h6');
			totalCount.className = "total-records";
			
			var totalCountMobile = document.createElement('h6');
			totalCountMobile.className = "total-records";

			var time = document.createElement('div');
			time.className = "col-md-6 float-end";
			
			var timeMobile = document.createElement('div');
			timeMobile.className = "col-md-6 float-end";

			var markAsRead = document.createElement('h6');
			var markAsReadMobile = document.createElement('h6');
			

			markAsRead.className = "float-end total-records";
			markAsRead.id = "markAsAllRead";
			markAsReadMobile.className = "float-end total-records";
			markAsReadMobile.id = "markAsAllReadMob";
			document.getElementById('totalCount').innerHTML = userData.length;
			document.getElementById('totalCountMobile').innerHTML = userData.length;
			markAsRead.innerHTML = "<a style='cursor:pointer' id= 'markAsAllRead' onclick ='markAsAllRead()'>Clear All</a>";
			markAsReadMobile.innerHTML = "<a style='cursor:pointer' id= 'markAsAllReadMob' onclick ='markAsAllRead()'>Clear All</a>";
			if (userData.length > 0) {
				time.appendChild(markAsRead);
				timeMobile.appendChild(markAsReadMobile);
			}
		
			childDiv.appendChild(totalCount);
			childDivMobile.appendChild(totalCountMobile);
			parentDiv.appendChild(childDiv);
			parentDivMobile.appendChild(childDivMobile);
			parentDiv.appendChild(time);
			parentDivMobile.appendChild(timeMobile);
			notifyTimeAndRead.appendChild(parentDiv);
			notifyTimeAndReadMobile.appendChild(parentDivMobile);
			notifyWrapper.appendChild(notifyTimeAndRead)
			notifyMobileWrapper.appendChild(notifyTimeAndReadMobile);
		}
	}
}
catch(exception){
	jsExceptionHandling(exception,"notification.js - userProcessResponse");
}
}
//-------------------------------------------------------------------------------------------------------------------------//

// Mark as read
function userReadResponse(num) {
	var userNotiNum = document.getElementById(num.id.replace("markAsRead", "notNum")).innerText;
	markAsRead(role, userNotiNum);
}

function userReadResponseMob(num) {
	var userNotiNum = document.getElementById(num.id.replace("markAsAllReadMobile", "notNumMobile")).innerText;
	markAsRead(role, userNotiNum);
}

function adminReadResponse(num) {

	var adminNotiNum = document.getElementById(num.id.replace("markAsRead1", "notiNum1")).innerText;
	markAsRead(role, adminNotiNum);
}

function adminReadResponseMobile(num) {

	var adminNotiNum = document.getElementById(num.id.replace("markAsReadMob", "notiNumMob")).innerText;
	markAsRead(role, adminNotiNum);
}

function markAsRead(role, notificationNum) {
	try{
	xhrReadStatus = new XMLHttpRequest();
	const url = pathName + "/notificationService/readStatus/markAsRead/" + notificationNum + "/" + role;
	xhrReadStatus = createHttpRequest("PUT", url, true, role);
	xhrReadStatus.onreadystatechange = markAsReadStatus;
	xhrReadStatus.send();
}
catch(exception){
	jsExceptionHandling(exception,"notification.js - MarkAsRead");
}
}


function markAsReadStatus() {

	if (this.readyState == 4 && this.status == 200) {
		if (role == "EMPLOYEE") {
			notificationsUser();
		}
		else {
			notificationsAdmin();
		}
		
	}

}

// Mark as all read
function markAsAllRead() {
	try{
	xhrReadAllStatus = new XMLHttpRequest();
	const url = pathName + "/notificationService/readStatus/markAsAllRead/" + role;
	var xhrReadAllStatus = createHttpRequest("PUT", url, true, role);
	xhrReadAllStatus.onreadystatechange = clearAll;
	xhrReadAllStatus.setRequestHeader("Content-Type", "application/json");

	var arr = new Array();
	if (role.includes("EMPLOYEE")) {
		for (var rows = 0; rows < userData.length; rows++) {
			var notificationNum = userData[rows].notificationNum;
			var obj = notificationNum;
			arr.push(obj);
		}
	}
	else {
		for (var rows = 0; rows < adminData.length; rows++) {
			var notificationNum = adminData[rows].notificationNum;
			var obj = notificationNum;
			arr.push(obj);

		}
	}
	xhrReadAllStatus.send(JSON.stringify(arr));


}
catch(exception){
	jsExceptionHandling(exception,"notification.js - markAsAllRead");
}
}

function clearAll() {

	if (this.readyState == 4 && this.status == 200) {
		if (role == "EMPLOYEE") {
			notificationsUser();
		}
		else {
			notificationsAdmin();
		}
		document.getElementById('totalCount').innerHTML = "0";
		document.getElementById('totalCountMobile').innerHTML = "0";
		
	}


}