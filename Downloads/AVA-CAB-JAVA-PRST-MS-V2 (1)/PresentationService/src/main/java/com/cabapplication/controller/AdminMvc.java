package com.cabapplication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminMvc {

	@GetMapping("/dashboard")
	public String todayRequests() {
		return "/cabadmin.html";
	}
	
	@GetMapping("/tripsheet")
	public String tripSheet() {
		return "/tripsheet.html";
	}
	
	@GetMapping("/ongoingtrip")
	public String ongoingtrip() {
		return "/ongoingtripsheet.html";
	}
	
	@GetMapping("/complaints")
	public String complaints() {
		return "/complaints.html";
	}
	
	@GetMapping("/blockedusers")
	public String blockedusers() {
		return "/Blockedusers.html";
	}
	
	@GetMapping("/routedetails")
	public String routeDetails() {
		return "/routeDetails.html";
	}
	
	@GetMapping("/newroute")
	public String newRoute() {
		return "/newRoute.html";
	}
	
	@GetMapping("/history")
	public String history() {
		return "/history.html";
	}
	
	@GetMapping("/history/trip")
	public String tripHistory() {
		return "/accordionhistory.html";
	}
	
	@GetMapping("/tripsheet-pickup")
	public String tripSheetPickup() {
		return "/tripsheet-pickup.html";
	}
	
	@GetMapping("/ongoingtrip-pickup")
	public String ongoingtripPickup() {
		return "/ongoingtripsheet-pickup.html";
	}
}
