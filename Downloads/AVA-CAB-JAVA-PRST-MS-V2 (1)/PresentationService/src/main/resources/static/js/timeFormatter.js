
function timeFormatTo12Hr(time, secNeeded) {

		//LocalDateTime formatter
		if (time.includes("T")) {

			time = time.split("T")[1];
			return includeOrExcludeSeconds(time, secNeeded);

		}

		//LocalTime formatter
		else {

			return includeOrExcludeSeconds(time, secNeeded);

		}

}

//For including/excluding seconds
function includeOrExcludeSeconds(time, secNeeded) {

		var slotSplitted = time.split(":");
		slotHour = slotSplitted[0];
		secs = slotSplitted[2].split(".")[0];
		if (slotHour < 12) {
			if (slotHour == 00) {
				if (secNeeded == 0) {
					return "12" + ":" + slotSplitted[1] + " AM";
				}
				else {
					return "12" + ":" + slotSplitted[1] + ":" + secs + " AM";
				}
			}
			else {
				if (secNeeded == 0) {
					return slotHour + ":" + slotSplitted[1] + " AM";
				}
				else {
					return slotHour + ":" + slotSplitted[1] + ":" + secs + " AM";
				}
			}
		}
		else {
			slotHour = slotHour - 12;
			if (slotHour == 0) {
				if (secNeeded == 0) {
					return "12" + ":" + slotSplitted[1] + " PM";
				}
				else {
					return "12" + ":" + slotSplitted[1] + ":" + secs + " PM";
				}
			}
			else if (slotHour < 10) {
				if (secNeeded == 0) {
					return "0" + slotHour + ":" + slotSplitted[1] + " PM";
				}
				else {
					return "0" + slotHour + ":" + slotSplitted[1] + ":" + secs + " PM";
				}
			}
			else {
				if (secNeeded == 0) {
					return slotHour + ":" + slotSplitted[1] + " PM";
				}
				else {
					return slotHour + ":" + slotSplitted[1] + ":" + secs + " PM";
				}
			}
		}
	}

