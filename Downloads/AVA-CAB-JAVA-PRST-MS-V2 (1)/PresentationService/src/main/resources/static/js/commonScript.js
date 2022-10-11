var pathName;
var presentationPath = window.location.origin;

//to get gateway url
var xhr = createHttpRequest("GET", presentationPath + "/gateway", false, null);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		pathName = (xhr.responseText);
	}
}
xhr.send(null);

/**
	common method to create ajaxRequests
	method - HttpMethod
	url - pathName + "endPoint"
	async - boolean
	role - USER/ADMIN/DRIVER
	 
 */
function createHttpRequest(method, url, async, role) {

	try {

		//if token expiration is less than 5 mins generate new token and set in session	
		if (!window.location.pathname.includes("login")) checkTokenValidation();

		var xhr = new XMLHttpRequest();
		xhr.open(method, url, async);

		var accessToken = localStorage.getItem("token");
		var roleStored = localStorage.getItem("role");
		if (accessToken != null) xhr.setRequestHeader("TOKEN", accessToken);
		if (role != null) xhr.setRequestHeader("ROLE", roleStored);

		return xhr;

	} catch (e) {
		jsExceptionHandling(e, "commonScript.js-createHttpRequest()");
	}
}

function checkTokenValidation() {

	try {

		var expireTime = localStorage.getItem("expireTime");
		var role = localStorage.getItem("role");
		var accessToken = localStorage.getItem("token");

		if ((expireTime - Date.now()) < 300000) {

			var tokenXhr = new XMLHttpRequest();

			tokenXhr.open("GET", pathName + "/auth/generateNewToken", false);
			tokenXhr.setRequestHeader("TOKEN", accessToken);
			tokenXhr.setRequestHeader("ROLE", role);

			tokenXhr.onreadystatechange = function() {
				if (tokenXhr.readyState == 4 && tokenXhr.status == 200) {
					localStorage.setItem("expireTime", Date.now() + 3600000);
					localStorage.setItem("token", tokenXhr.responseText);
				}

				if (tokenXhr.readyState == 4 && tokenXhr.status == 565) {


					if (role.toLowerCase() === "driver") {
						window.location.href = "/driver/login";
					} else {
						window.location.href = "/login";
					}
				}
			}

			tokenXhr.send();
		}

	} catch (e) {
		jsExceptionHandling(e, "commonScript.js-checkTokenValidation()");
	}
}

if (localStorage.getItem("admins") == null || localStorage.getItem("admins") == "") {
	getAdminContacts();
}

function getAdminContacts() {
	try {
		var adminConXhr = createHttpRequest("GET", pathName + "/auth/findAdmins", false, "ADMIN");
		adminConXhr.onreadystatechange = function() {
			if (adminConXhr.readyState == 4 && adminConXhr.status == 200) {
				localStorage.setItem("admins", adminConXhr.responseText);
			}
		}
		adminConXhr.send();
	} catch (e) {
		jsExceptionHandling(e, "commonScript.js-getAdminContacts()");
	}
}

var adminConBtn = document.getElementById("adminContactsBtn");
var adminConBtnMob = document.getElementById("adminContactsBtn-mob");
if (adminConBtn != undefined) {
	adminConBtn.addEventListener('click', setAdminContacts);
}
if (adminConBtnMob != undefined) {
	adminConBtnMob.addEventListener('click', setAdminContacts);
}

function setAdminContacts() {

	try {
		var contactsDiv = document.getElementById("adminContacts");
		var contactsDivMob = document.getElementById("adminContacts-mobile");
		contactsDiv.innerHTML = "";

		if (contactsDivMob != undefined) {
			contactsDivMob.innerHTML = "";
		}

		var admins = JSON.parse(localStorage.getItem("admins"));

		var adminMap = Object.keys(admins);

		for (let i = 0; i < adminMap.length; i++) {
			adminName = adminMap[i];
			adminNumber = admins[adminMap[i]];

			var label = document.createElement("label");
			var labelForMob = document.createElement("label");
			
			label.className = "float-start";
			labelForMob.className = "float-start";

			label.innerText = adminName + " - " + adminNumber;
			labelForMob.innerText = adminName + " - " + adminNumber;

			contactsDiv.appendChild(label);
			if (contactsDivMob != undefined) {
				contactsDivMob.appendChild(labelForMob);
			}
		}
	}
	catch (e) {
		console.log(e);
		jsExceptionHandling(e, "commonScript.js-setAdminContacts()");
	}
}

if (!window.location.pathname.includes("login")) {

	try {
		var role = localStorage.getItem("role");
		var profile = localStorage.getItem("profile");
		if (profile != null) {
			setProfile(profile)
		} else {
			getProfile(role);
		}
	}
	catch (e) {
		jsExceptionHandling(e, "onLoadProfileSet()");
	}
}

function getProfile(role) {

	try {
		var profileXhr = createHttpRequest("GET", pathName + "/auth/extractToken", false, role);
		profileXhr.onreadystatechange = function() {
			if (profileXhr.readyState == 4 && profileXhr.status == 200) {
				localStorage.setItem("profile", profileXhr.responseText);
				setProfile(profileXhr.responseText);
			}
		}
		profileXhr.send();
	} catch (e) {
		jsExceptionHandling(e, "commonScript.js-getProfile()");
	}

}

function setProfile(response) {
	try {
		var parsedResponse = JSON.parse(response);
		if (window.location.pathname.startsWith("/user")) {
			document.getElementById("userprofile-icon").innerHTML = parsedResponse.employeeName.charAt(0);
			document.getElementById("employeeName").innerHTML = parsedResponse.employeeName;
			document.getElementById("domainName").innerHTML = "Domain: " + parsedResponse.domain;
			document.getElementById("employeeId").innerHTML = "Employee Id: " + parsedResponse.employeeId;
			document.getElementById("domainLead").innerHTML = "Domain Lead: " + parsedResponse.domainLead;
			document.getElementById("userprofile-icon-mob").innerHTML = parsedResponse.employeeName.charAt(0);
			document.getElementById("employeeName-mob").innerHTML = parsedResponse.employeeName;
			document.getElementById("domainName-mob").innerHTML = "Domain: " + parsedResponse.domain;
			document.getElementById("employeeId-mob").innerHTML = "Employee Id: " + parsedResponse.employeeId;
			document.getElementById("domainLead-mob").innerHTML = "Domain Lead: " + parsedResponse.domainLead;
		}
		
		if (window.location.pathname.startsWith("/admin")) {
			document.getElementById("userprofile-icon").innerHTML = parsedResponse.employeeName.charAt(0);
			document.getElementById("userprofile-icon2").innerHTML = parsedResponse.employeeName.charAt(0);
			document.getElementById("employeeName").innerHTML = parsedResponse.employeeName;
			document.getElementById("mailId").innerHTML = parsedResponse.employeeMail;
		}
		
		if (window.location.pathname.startsWith("/driver")) {
			
			let driverNameSliptted = parsedResponse.driverName.split(" ");
			let firstChar = driverNameSliptted[0].charAt(0);
			document.getElementById("nameicon").innerHTML = driverNameSliptted[1] ? firstChar +  driverNameSliptted[1].charAt(0): firstChar
			document.getElementById("driver-profile1").innerHTML = parsedResponse.cabNumber;
			document.getElementById("driver-profile2").innerHTML = parsedResponse.driverName;
		}

	} catch (e) {
		jsExceptionHandling(e, "commonScript.js-setProfile()");
	}
}