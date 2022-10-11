package com.cabapplication.utils;

public enum CustomStatus {

	ACCOUNT_LOCKED(561, "User Blocked"),
	
	ACCESS_DENIED(562, "Access Denied"),
	
	DETAILS_NOT_FOUND(563, "UserName Not Found"),
	
	BAD_CREDENTIALS(564, "Incorrect Password");
	
	private static final CustomStatus[] VALUES;
	
	static {
		VALUES = values();
	}
	
	private final int value;
	private final String description;
	
	CustomStatus(int value, String description) {
		this.value = value;
		this.description = description;
	}

	public int getValue() {
		return value;
	}

	public String getDescription() {
		return description;
	}
	
	public static boolean isPresent(int statusCode) {
		for(CustomStatus status : VALUES) {
			if (status.value == statusCode) {
				return true;
			}
		}
		return false;
	}
	
	public static CustomStatus get(int statusCode) {
		for(CustomStatus status : VALUES) {
			if (status.value == statusCode) {
				return status;
			}
		}
		return null;
	}
	
}
