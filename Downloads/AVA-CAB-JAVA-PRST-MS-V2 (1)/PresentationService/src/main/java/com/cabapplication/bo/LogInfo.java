package com.cabapplication.bo;

import java.time.LocalDateTime;
import org.springframework.http.ResponseEntity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level=AccessLevel.PRIVATE)
public class LogInfo {

	String id;
	String role;
	LocalDateTime localDateTime;
	String method;
	String requestPath;
	String restApiMethod;
	String info;
	ResponseEntity<?> response;
	

}
