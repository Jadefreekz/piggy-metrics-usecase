

function createPagination(pages, index) {
	
if(filterApplied==true){
//	getTotalCountFilterAndSearch(index-1);
	  getHistoryOfTripsByFilterAndSearch(index-1);
}
else{
	 getTripSheet(index - 1);
}
   
	let str = '<ul class= "ul-tag">';

	let active;
	let previousButton = index - 1;
	let nextButton = index + 1;


	if (index > 1) {

		str += '<li class="page-item"><a class="page-link pagination-border " onclick="createPagination(pages, ' + (index - 1) + ')"><img src="images/pagination-prev-arrow.svg"  /></a></li>';



	}
	if (pages < 6) {
		for (let p = 1; p <= pages; p++) {
			active = index == p ? "active" : "no";
			str += '<li class="' + active + '" ><a class="page-link pagination-border a-tag" onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
		}
	}

	else {
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
				continue
			}
			active = index == p ? "active" : "no";
			str += '<li class="page-item '+active+'"><a class="page-link pagination-border" onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
		}

		if (index < pages - 1) {
			if (index < pages - 2) {
				str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages,' + (index + 2) + ')">...</a></li>';
			}
			str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, pages)">' + pages + '</a></li>';
		}
	}
	if (index < pages) {
		str += '<li class="page-item"><a class="page-link pagination-border" onclick="createPagination(pages, ' + (index + 1) + ')"><img src="images/pagination-next-arrow.svg" alt="page-arrow"  /></a></li>';
	}
	str += '</ul>';

	document.getElementById('pagination').innerHTML = str;
	return str;

}