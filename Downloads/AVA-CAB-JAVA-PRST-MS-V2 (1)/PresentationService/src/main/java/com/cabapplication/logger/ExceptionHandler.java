package com.cabapplication.logger;

import java.time.LocalDateTime;
import java.time.ZoneId;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cabapplication.bo.ErrorDetails;

@Service
public class ExceptionHandler {

	@Value("${url.gateway}")
	private String gatewayUrl;
	
	@Autowired
	private RestTemplate restTemplate;

	public void writeExceptionToDB(Exception exception, HttpServletRequest request) {

		ErrorDetails errorDetails = new ErrorDetails(String.valueOf(ObjectId.get()), request.getHeader("Role"),
				LocalDateTime.now(ZoneId.of("Asia/Kolkata")), exception.getMessage(), request.getMethod(),
				request.getRequestURI());

		HttpEntity<ErrorDetails> entity = new HttpEntity<>(errorDetails);
		restTemplate.exchange(gatewayUrl + "/exceptionHandler/save/exceptions", HttpMethod.POST, entity,
				Void.class);
	}
}
