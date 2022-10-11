function jsExceptionHandling(e, jsMethod) {
	var jsExceptionXhr = createHttpRequest("POST", pathName + "/exceptionHandler/save/jsExceptions/" + e + "/" + jsMethod, true);

	jsExceptionXhr.send();
	jsExceptionXhr.onreadystatechange = function() {

	};
}