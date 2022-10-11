var checkBox = document.getElementById("showPassword");

window.onload = function() {
	loadCookies();
}

function removeSpaces(string) {
	return string.split(' ').join('');
}

//loadCookies if present
function loadCookies() {

	try {
		//reduce the cookies from array to name and values
		var cookies = document.cookie
			.split(';')
			.map(cookie => cookie.split('='))
			.reduce((total, [key, value]) => ({ ...total, [key.trim()]: value }), {});

		//if cookies not present
		if (cookies.loginId == undefined || cookies.password == undefined) {
			return false;
		}

		document.getElementById("driverLoginId").value = cookies.loginId;
		//password stored in cookie is base64 encoded
		document.getElementById("driverPassword").value = window.atob(cookies.password);

//		document.getElementById('rememberCheck').checked = true;
	}
	catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-loadCookies()");
	}
}

//change loginId values to upperCase on input
var loginIdField = document.getElementById("driverLoginId");
loginIdField.addEventListener('input', function() {

	try {
		this.value = this.value.toUpperCase();
	}
	catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-addEventListener(input(driverLoginId))");
	}
});

//loginIdField.addEventListener('blur', loginEmptyCheck);

//perform login when enter clicked on password field
var passwordField = document.getElementById("driverPassword");
passwordField.addEventListener("keyup", function(event) {

	try {
		if (event.key.toUpperCase() === "ENTER") {
			validateCabInfo();
		}
	}
	catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-addEventListener(keyup(driverPassword))");
	}
});

//passwordField.addEventListener('blur', passwordEmptyCheck);


//passwordField.addEventListener('blur', passwordEmptyCheck);

var loginIdErrorField = document.getElementById("invalidLoginId");
var passwordErrorField = document.getElementById("invalidPassword");
var badCredsErrorField = document.getElementById("badCreds");

//LoginId emptyCheck 
function loginEmptyCheck() {

	try {

		if (loginIdField.value == undefined || loginIdField.value == '') {
			loginIdErrorField.innerText = "UserName should not be empty";
			loginIdErrorField.style.display = "block";
			return false;
		}

		var loginFormatCheck = checkLoginIdFormat();
		if (!loginFormatCheck) {
			return false;
		}

		loginIdErrorField.style.display = "none";
		badCredsErrorField.style.display = "none";
		return true;

	} catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-loginEmptyCheck()");
	}
}

//passwordEmptyCheck
function passwordEmptyCheck() {
	try {
		if (passwordField.value == undefined || passwordField.value == '') {
			passwordErrorField.innerText = "Password should not be empty";
			passwordErrorField.style.display = "block";
			return false;
		}

		var passwordFormatCheck = checkPasswordFormat();
		if (!passwordFormatCheck) {
			return false;
		}

		passwordErrorField.style.display = "none";
//		badCredsErrorField.style.display = "none";
		return true;

	} catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-passwordEmptyCheck()");
	}
}

//to check login format
function checkLoginIdFormat() {

	try {
		if (loginIdField.value.length < 9 || loginIdField.value.length > 10) {
			badCredsErrorField.innerText = "Please enter the valid user name or a password";
			badCredsErrorField.style.display = "block";
			return false;
		}
		return true;

	} catch (e) {
		jsExceptionHandling(e, "DriverLogin.js-checkLoginIdFormat()");
	}
}

//to check password format
function checkPasswordFormat() {

	try {
		var passwordRegex = /^[0-9]+$/;

		if (passwordField.value.length < 10 || !passwordField.value.match(passwordRegex)) {
			badCredsErrorField.innerText = "Please enter the valid user name or a password";
			badCredsErrorField.style.display = "block";
			return false;
		}
		return true;

	} catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-checkPasswordFormat()");
	}
}

var loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener('click', validateCabInfo)

//login button onclick
function validateCabInfo() {
	loginIdErrorField.style.display = "none";
	passwordErrorField.style.display = "none";
	badCredsErrorField.style.display = "none";

	try {

		var loginIdCheck = loginEmptyCheck();
		var passwordCheck = passwordEmptyCheck();

		if (!loginIdCheck || !passwordCheck) {
			return false;
		}

		var cabNumber = loginIdField.value.substr(0, 2) + " " + loginIdField.value.substr(2, 2);

		if (loginIdField.value.length == 9) {
			cabNumber = cabNumber + " " + loginIdField.value.substr(4, 1) + " " + loginIdField.value.substr(5)
		} else {
			cabNumber = cabNumber + " " + loginIdField.value.substr(4, 2) + " " + loginIdField.value.substr(6);
		}

		var driverBo = {
			"cabNumber": cabNumber,
			"password": window.btoa(passwordField.value)
		}

		var cabXhr = createHttpRequest("POST", presentationPath + "/authorize/cab", false, "DRIVER");
		cabXhr.setRequestHeader("Content-type", "application/json");
		cabXhr.onreadystatechange = function() {

			if (cabXhr.readyState == 4 && cabXhr.status == 200) {

				saveCookies();
				var accessToken = cabXhr.responseText;

				localStorage.clear();

				localStorage.setItem("token", accessToken);
				localStorage.setItem("role", "DRIVER");
				localStorage.setItem("cabNumber", cabNumber);
				localStorage.setItem("expireTime", Date.now() + 3600000);
				
				$("#showPassword").prop("checked", false);
				window.location.href = "/driver/dashboard"
				
			}

			if (cabXhr.readyState == 4 && cabXhr.status == 563) {
				badCredsErrorField.style.display = "block";
				badCredsErrorField.innerText = "Please enter the valid user name or a password";
			}

			if (cabXhr.readyState == 4 && cabXhr.status == 564) {
				badCredsErrorField.style.display = "block";
				badCredsErrorField.innerText = "Please enter the valid user name or a password";
			}

		}
		cabXhr.send(JSON.stringify(driverBo));

	} catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-validateCabInfo()");
	}
}

//save cookies 
function saveCookies() {

	try {

		//save cookies if remember me checked
		if (document.getElementById('rememberCheck').checked == true) {
			var date = new Date();
			date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * 3);
			date.toUTCString();

			document.cookie = "loginId=" + loginIdField.value + ";" + "expires=" + date + ";path=/";
			document.cookie = "password=" + window.btoa(passwordField.value) + ";" + "expires=" + date + ";path=/";
		}

		//delete cookies if remember me not checked
		else {
			document.cookie = "loginId=" + ";" + "expires=" + (new Date() - 24 * 60) + ";path=/";
			document.cookie = "password=" + ";" + "expires=" + (new Date() - 24 * 60) + ";path=/";
		}
	} catch (e) {
		jsExceptionHandling(e, "LoginDriver.js-saveCookies()");
	}
}


function showPasswordFunction(){
	
	var passwordField = document.getElementById("driverPassword");
	 
	
	
	if (checkBox.checked == true) {
    	passwordField.type = "text";
  	} 
   	else {
   		passwordField.type = "password";
  	}
}