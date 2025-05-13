package edu.kh.project.common.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import edu.kh.project.common.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/*
 * Interceptor : 요청/응답/뷰 완성 후 가로채는 객체 (Spring 지원)
 * 
 * * HandlerInterceptor 인터페이스를 상속받아서 구현 해야 한다.
 * 
 * - preHandle (전처리)  : Dispatcher Servlet -> Controller 사이 수행
 * 
 * - postHandle (후처리) : Controller -> Dispatcher Servlet 사이 수행
 * 
 * - afterCompletion (뷰 완성(forward 코드 해석) 후) : View Resolver -> Dispatcher Servlet 사이 수행
 * 
 * */

@Slf4j
public class JwtInterceptor implements HandlerInterceptor {

	@Autowired
    private JwtUtil jwtUtil;


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

    	 // OPTIONS 요청은 CORS preflight이므로 통과시킴
    	// -> Spring의 Interceptor는 OPTIONS 요청도 처리하는데,
    	// 이 때 Authorization 헤더가 없으니까 "토큰 없음"으로 막힘.
    	// 그래서 아래처럼 OPTIONS는 인터셉터 동작 수행하지 말고 그냥 통과시켜야함.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true; // CORS preflight 허용
        }
    	
        // 1. 요청 헤더에 포함된 Access Token 가져오기
        String token = request.getHeader("Authorization");
        
        log.debug("token {}", token);

        // 2. 토큰 부분만 추출하기
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 제거
            
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 없음 또는 형식 오류");
            return false;
        }

        // 3. 토큰 검증
        // 토큰이 유효하지 않을 때(== 만료됨)
        if (jwtUtil.isTokenExpired(token)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 유효하지 않음");
            return false;
        }

        // 4. 토큰 유효 시 클레임에서 memberNo, memberEmail 추출
        int memberNo = jwtUtil.extractMemberNo(token);
        String memberEmail = jwtUtil.extractMemberEmail(token);
        request.setAttribute("memberNo", memberNo);
        request.setAttribute("memberEmail", memberEmail);
        
        return true; // 컨트롤러로 진행
    }
}
