package edu.kh.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import edu.kh.project.common.interceptor.JwtInterceptor;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

	// 인터셉터 클래스 Bean 등록
	@Bean // 개발자가 만들어서 반환하는 객체를 Bean 등록 -> 관리는 Spring Container가 수행
	public JwtInterceptor jwtInterceptor() {
		return new JwtInterceptor();
	}

	// 동작할 인터셉터 객체를 추가하는 메서드
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		// Bean으로 등록된 jwtInterceptor를 얻어와서 매개변수로 전달
		registry.addInterceptor(jwtInterceptor()).addPathPatterns("/myPage/**") // 인터셉터 적용 경로
				.excludePathPatterns("/member/login", 
						"/signup", 
						"/myPage/profile/**", 
						"/css/**", "/js/**",
						"/images/**", 
						"/"); // 제외 경로
	}
}
