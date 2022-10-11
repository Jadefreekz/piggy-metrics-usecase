package com.cabapplication.configs.security;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private static final String DRIVER_LOGIN = "/driver/login";
	private static final String LOGIN = "/login";
	private static final String SESSION_COOKIE = "JSESSIONID";
	private static final String ACCESS_DENIED= "/accessdenied";

	@Configuration
	@Order(1)
	public static class DriverConfig extends WebSecurityConfigurerAdapter {
		public DriverConfig() {
			super();
		}

		@Override
		protected void configure(HttpSecurity http) throws Exception {
			
			http.csrf().disable()
				.antMatcher("/driver/**").authorizeRequests().anyRequest().hasRole("DRIVER")
				
				.and().formLogin().loginPage(DRIVER_LOGIN).permitAll()

				.and().exceptionHandling().accessDeniedPage(ACCESS_DENIED)
				
				.and().logout().addLogoutHandler((req, res, auth) -> {
					try {
						res.sendRedirect(DRIVER_LOGIN);
					} catch (IOException e) {
						e.printStackTrace();
					}
				}).logoutUrl("/driver/logout").invalidateHttpSession(true).clearAuthentication(true)
				.deleteCookies(SESSION_COOKIE);
		}
		
		@Override
		public void configure(WebSecurity web) throws Exception {
			web.ignoring().antMatchers("/driver/css/**", "/driver/js/**", "/driver/images/**", "/driver/Fonts/**");
		}
	}

	@Configuration
	@Order(2)
	public static class UserConfig extends WebSecurityConfigurerAdapter {
		public UserConfig() {
			super();
		}

		@Override
		protected void configure(HttpSecurity http) throws Exception {

			http.csrf().disable()
					.antMatcher("/user/**").authorizeRequests().anyRequest().hasAnyRole("EMPLOYEE", "ADMIN")
					
					.and().exceptionHandling().accessDeniedPage(ACCESS_DENIED)
		
					.and().oauth2Login().loginPage(LOGIN)
		
					// this will log which user is logging out and redirect to login page
					.and().logout().addLogoutHandler((req, res, auth) -> {
						try {
							res.sendRedirect(LOGIN);
						} catch (IOException e) {
							e.printStackTrace();
						}
					}).logoutUrl("/user/logout").invalidateHttpSession(true).clearAuthentication(true)
					.deleteCookies(SESSION_COOKIE);
		}
		
		@Override
		public void configure(WebSecurity web) throws Exception {
			web.ignoring().antMatchers("/css/**", "/js/**", "/images/**", "/Fonts/**","/Videos/**");
		}
	}

	@Configuration
	public static class AdminConfig extends WebSecurityConfigurerAdapter {

		public AdminConfig() {
			super();
		}

		@Override
		public void configure(HttpSecurity http) throws Exception {
			
			http.csrf().disable().authorizeRequests()
					.antMatchers("/gateway", "/oauth2**", "/authorized", "/authorize/cab", "/login**", ACCESS_DENIED).permitAll()
					.anyRequest().hasRole("ADMIN")

					.and().oauth2Login().loginPage(LOGIN)
					
					.and().exceptionHandling().accessDeniedPage(ACCESS_DENIED)

					// this will log which user is logging out and redirect to login page
					.and().logout().addLogoutHandler((req, res, auth) -> {
						try {
							res.sendRedirect(LOGIN);
						} catch (IOException e) {
							e.printStackTrace();
						}
					}).logoutUrl("/admin/logout").invalidateHttpSession(true).clearAuthentication(true)
					.deleteCookies(SESSION_COOKIE);
		}
		
		@Override
		public void configure(WebSecurity web) throws Exception {
			web.ignoring().antMatchers("/admin/css/**", "/admin/js/**", "/admin/images/**", "/admin/Fonts/**","admin/Videos/**");
		}
	}

}
