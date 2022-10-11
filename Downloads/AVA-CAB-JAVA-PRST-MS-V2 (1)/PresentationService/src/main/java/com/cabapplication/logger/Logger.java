package com.cabapplication.logger;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cabapplication.bo.LogInfo;

@Service
public class Logger {

	@Value("${url.gateway}")
	private String gatewayUrl;

	@Autowired
	ExceptionHandler exceptionHandler;
	@Autowired
	private RestTemplate restTemplate;

	/**
	 * To log the request
	 * 
	 * @param method
	 * @param request
	 * @param logInfo
	 * @throws IOException
	 */
	public void logRequestToDB(String method, HttpServletRequest request, String logInfo) {

		try {
			LogInfo logRequestInfo = new LogInfo(String.valueOf(ObjectId.get()), request.getHeader("Role"),
					LocalDateTime.now(ZoneId.of("Asia/Kolkata")), method, request.getRequestURI(), request.getMethod(),
					logInfo, null);

			HttpEntity<LogInfo> entity = new HttpEntity<>(logRequestInfo);
			restTemplate.exchange(gatewayUrl + "/logger/save/logs", HttpMethod.POST, entity, Void.class);

		} catch (Exception exception) {
			exceptionHandler.writeExceptionToDB(exception, request);
		}

	}

	/**
	 * To record the response
	 * 
	 * @param method
	 * @param request
	 * @param logInfo
	 * @param response
	 * @throws IOException
	 */
	public void logResponseToDB(String method, HttpServletRequest request, String logInfo, ResponseEntity<?> response) {
		try {
			LogInfo logResponseInfo = new LogInfo(String.valueOf(ObjectId.get()), request.getHeader("Role"),
					LocalDateTime.now(ZoneId.of("Asia/Kolkata")), method, request.getRequestURI(), request.getMethod(),
					logInfo, response);
			HttpEntity<LogInfo> entity = new HttpEntity<>(logResponseInfo);
			restTemplate.exchange(gatewayUrl + "/logger/save/logs", HttpMethod.POST, entity, Void.class);
		} catch (Exception exception) {
			exceptionHandler.writeExceptionToDB(exception, request);
		}

	}
}
