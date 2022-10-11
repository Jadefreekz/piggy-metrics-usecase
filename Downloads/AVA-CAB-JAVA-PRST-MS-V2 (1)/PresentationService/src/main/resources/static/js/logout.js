var logoutBtn = document.getElementById("logout");
var logoutBtnMob = document.getElementById("logoutMobile");
var driverlogout = document.getElementById("driverlogout");

if(logoutBtn != null) logoutBtn.addEventListener("click", performLogout);
if(logoutBtnMob != null) logoutBtnMob.addEventListener("click", performLogout);

function performLogout() {

	try {
		localStorage.clear();
		if(window.location.pathname.includes("admin")) {
			window.location.href = "/admin/logout"
		} else {
			window.location.href = "/user/logout"
		}
		
	}
	catch (e) {
		//console.error(e);
		jsExceptionHandling(e, "logout.js-performLogout()");
	}

}

if(driverlogout != null) driverlogout.addEventListener("click", performDriverLogout);

function performDriverLogout() {
	
	try {
		localStorage.clear();
		window.location.href = "/driver/logout"
	} catch (e) {
		console.error(e);
		jsExceptionHandling(e, "logout.js-performDriverLogout()");
	}
}