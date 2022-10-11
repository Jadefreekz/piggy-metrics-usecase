package com.cabapplication.utils;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus.Series;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResponseErrorHandler;

@Configuration
public class RestErrorHandler implements ResponseErrorHandler {

	@Override
	public boolean hasError(ClientHttpResponse response) throws IOException {
		
		if(CustomStatus.isPresent(response.getRawStatusCode())) {
			return false;
		}

		return (Series.resolve(response.getRawStatusCode()) != null && response.getStatusCode().isError());
	}

	@Override
	public void handleError(ClientHttpResponse response) throws IOException {
			
			throw new HttpClientErrorException(response.getStatusCode(), response.getStatusText(),
                    response.getHeaders(), response.getBody().readAllBytes(), null);
			
	}

}