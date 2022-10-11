package com.cabapplication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/driver")
class DriverMvc {

	@GetMapping("/login")
	public String driverLogin() {
		return "/DriverLogin.html";
	}

	@GetMapping("/dashboard")
	public String noTrip() {
		return "/DriverDashboard.html";
	}
	
	@GetMapping("/tripsheet")
	public String tripDetails() {
		return "/MyTrips.html";
	}
	
	@GetMapping("/ongoingtrip")
	public String tripInProgress() {
		return "/Trip-InProgress.html";
	}
	
}