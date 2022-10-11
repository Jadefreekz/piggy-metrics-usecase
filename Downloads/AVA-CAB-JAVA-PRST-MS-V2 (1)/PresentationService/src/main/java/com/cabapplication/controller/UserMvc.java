package com.cabapplication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserMvc {
	
	@GetMapping("/login")
	public String login() {
		return "/login.html";
	}
	
	@GetMapping("") 
	public String bookACabRedirect() {
		return "redirect:/user/bookacab";
	} 
	
	@GetMapping("/user/bookacab")
	public String bookACab() {
		return "/user_reserve_cab.html";
	}
	
	@GetMapping("/user/ongoingtrip")
	public String ongoingTrip() {
		return "/trip_sheet.html";
	}
	
	@GetMapping("/user/myrequest")
	public String myRequest() {
		return "/cab-app-my request.html";
	}
	
	@GetMapping("/user/completedtrip")
	public String completedTrip() {
		return "/cab-app-completedtrip.html";
	}
	
	@GetMapping("/notfound")
	public String notFoundError() {
		return "/notFound.html";
	}

	@GetMapping("/accessdenied")
	public String accessDenied() {
		return "/accessDenied.html";
	}
	
}
