package com.cabapplication.controller;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.cabapplication.bo.DriverBO;
import com.cabapplication.bo.EmployeeBO;
import com.cabapplication.logger.ExceptionHandler;
import com.cabapplication.utils.CustomStatus;

@RestController
public class AuthenticationController {

	@Autowired
	private ApplicationContext context;

	@Value("${url.gateway}")
	private String gatewayUrl;

	@Autowired
	private RestTemplate template;
	
	@Autowired
	private ExceptionHandler exHandler;

	/**
	 * To get GatewayUrl - specified in env
	 *
	 */
	@GetMapping("/gateway")
	public ResponseEntity<String> gatewayUrl(HttpServletRequest request) {

		try {
			return ResponseEntity.ok(gatewayUrl);
		} catch (Exception e) {
			exHandler.writeExceptionToDB(e, request);
		}
		return null;
	}

	/**
	 * To authorize user from authorization code
	 * 
	 * @param code - authCode from azure
	 * @apiNote ResponseStatus<br>
	 *          - 561, if account is blocked<br>
	 *          - 563, if user not found
	 */
	@GetMapping(value = "/authorized")
	public void getUserByAuthCode(@RequestParam(value = "code") String code, HttpServletRequest request,
			HttpServletResponse response) {

		ResponseEntity<EmployeeBO> empBoResp = null;

		try {

			empBoResp = template.exchange(gatewayUrl + "/auth/authorize/" + code, HttpMethod.GET, null,
					EmployeeBO.class);

			if (CustomStatus.isPresent(empBoResp.getStatusCodeValue())) {
				response.sendRedirect("/login?errorCode=" + empBoResp.getStatusCodeValue());
				return;
			}

			// get user originally requested URL before login
			String redirectUri = getSavedRequest(request, response);

			EmployeeBO empBo = empBoResp.getBody();

			StringBuilder returnUrl = new StringBuilder();
			returnUrl.append("/login?token=" + empBo.getAccessToken() + "&role=" + empBo.getRole() + "&empId="
					+ empBo.getEmployeeId()+"&empDetailId="+empBo.getEmployeeDetailId());

			if (redirectUri != null && !redirectUri.contains("error") && !redirectUri.equals("/")) {
				returnUrl.append("&redirect=" + redirectUri);
			}

			// set authentication
			setAuthentication(empBo.getEmployeeMail(), empBo.getRole(), request);
			request.getSession().setMaxInactiveInterval(1800);

			response.sendRedirect(returnUrl.toString());

		} catch (Exception e) {
			exHandler.writeExceptionToDB(e, request);
		}
	}

	/**
	 * To authorize cab details
	 * 
	 * @apiNote <b>@statusCode</b><br>
	 *          - 563, if user not found<br>
	 *          - 564, if password is incorrect
	 */
	@PostMapping(value = "/authorize/cab")
	public ResponseEntity<String> validateCabInfo(@RequestBody DriverBO driverBo, HttpServletRequest request,
			HttpServletResponse response) {

		ResponseEntity<String> driverBoResp = null;

		try {

			HttpEntity<DriverBO> driverEntity = new HttpEntity<>(driverBo);
			driverBoResp = template.exchange(gatewayUrl + "/auth/authorize/cab", HttpMethod.POST, driverEntity,
					String.class);

			if (CustomStatus.isPresent(driverBoResp.getStatusCodeValue())) {
				return ResponseEntity.status(driverBoResp.getStatusCodeValue()).body(null);
			}

			// set authentication
			setAuthentication(driverBo.getCabNumber(), "DRIVER", request);
			request.getSession().setMaxInactiveInterval(3600);

			return ResponseEntity.ok(driverBoResp.getBody());
		} catch (Exception e) {
			exHandler.writeExceptionToDB(e, request);
		}

		return driverBoResp;
	}

	private void setAuthentication(String userName, String role, HttpServletRequest request) {

		try {
			Collection<GrantedAuthority> authorityList = Arrays.asList(new SimpleGrantedAuthority("ROLE_" + role));

			// userName, pass credentials as null and list of roles permitted
			UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userName,
					null, authorityList);

			SecurityContextHolder.getContext().setAuthentication(authenticationToken);

		} catch (Exception e) {
			exHandler.writeExceptionToDB(e, request);
		}

	}

	/**
	 * To get saved requests from HttpSessionRequestCache
	 */
	private String getSavedRequest(HttpServletRequest request, HttpServletResponse response) {
		try {
			DefaultSavedRequest savedRequest = (DefaultSavedRequest) new HttpSessionRequestCache().getRequest(request,
					response);
			if (savedRequest != null) {

				//Get all endpoints
				RequestMappingHandlerMapping requestMappingHandlerMapping = context
						.getBean("requestMappingHandlerMapping", RequestMappingHandlerMapping.class);
				Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping
						.getHandlerMethods();
				
				//If saved request present in endpoints return savedRequest
				boolean isUriPresent = handlerMethods.keySet().stream().anyMatch(eachRequestInfo -> eachRequestInfo
						.getActivePatternsCondition().equals(new PatternsRequestCondition(savedRequest.getRequestURI())));

				return isUriPresent ? savedRequest.getRequestURI() : null;
			}
		} catch (Exception e) {
			exHandler.writeExceptionToDB(e, request);
		}

		return null;
	}

}
