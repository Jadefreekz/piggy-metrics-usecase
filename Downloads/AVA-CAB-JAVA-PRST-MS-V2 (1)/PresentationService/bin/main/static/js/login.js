//TODO onload - check if user has session redirect to dashboard

window.onload = function() {

	try {

		var urlParams = new URLSearchParams(window.location.search);
		var errorCode = urlParams.get("errorCode");
		var accessToken = urlParams.get("token");
		var redirectUrl = urlParams.get("redirect");
		var role = urlParams.get("role");
		var employeeId = urlParams.get("empId");
		var employeeDetailId = urlParams.get("empDetailId");


		if (errorCode != null) {
			checkErrorCode(errorCode);
			
		} else if (accessToken != null) {
			
			localStorage.clear();
	
			localStorage.setItem("token", accessToken);
			localStorage.setItem("role", role);
			localStorage.setItem("employeeId", employeeId);
			localStorage.setItem("employeeDetailId", employeeDetailId);

			localStorage.setItem("expireTime", Date.now() + 3600000);

			if (redirectUrl != null) {
				window.location.href = redirectUrl;
			} else if (role.toUpperCase() == "ADMIN") {
				window.location.href = "/admin/dashboard";
			} else {
				window.location.href = "/user/bookacab"
			}
		}
	} catch (e) {
		console.error(e)
		//jsExceptionHandling(e, "login.js-onloadFunction");
	}
}

function checkErrorCode(errorCode) {

	try {
		if (errorCode == 561) {
			
			$("#actionblock").modal("show");
			return false;
		}
		if (errorCode == 563) {
			$("#contactHr").modal("show");
			return false;
		}
	} catch (e) {
		console.error(e)
		//jsExceptionHandling(e, "login.js-onloadFunction");
	}
}

var loginBut = document.getElementById("loginBut");
loginBut.addEventListener('click', redirectToOauth);

/**
	redirect to oauth2 onClick of login button
 */
function redirectToOauth() {
	window.location.href = "/oauth2/authorization/azure-client"
}