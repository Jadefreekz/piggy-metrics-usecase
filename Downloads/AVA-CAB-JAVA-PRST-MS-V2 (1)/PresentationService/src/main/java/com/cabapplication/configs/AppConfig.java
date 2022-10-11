package com.cabapplication.configs;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import com.cabapplication.utils.RestErrorHandler;

@Configuration
public class AppConfig {

	// rest template bean
	@Bean
	public RestTemplate restTemplateBean() {
		return new RestTemplateBuilder().errorHandler(new RestErrorHandler()).build();
	}
	
}