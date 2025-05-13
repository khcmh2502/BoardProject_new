package edu.kh.project.common.util;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
@PropertySource("classpath:/config.properties")
public class JwtUtil {

	// 비밀 키
	@Value("${spring.jwt.secret}")
	private String secret;
	
	// JWT의 유효 시간 (단위: 밀리초) -> 1시간
    private final long accessTokenExpiration = 1000 * 60 * 60; // 60분

    // JWT에서 사용할 서명용 키 객체 생성 (secret을 디코딩하여 Key 객체로 변환)
    private Key getKey() {
    	// secret키를 JWT 서명을 위해 사용할 수 있도록 바이트 배열로 변환
        return Keys.hmacShaKeyFor(secret.getBytes());
        // Keys.hmacShaKeyFor() : jjwt 라이브러리에서 제공하는 유틸
    } 

    // Access Token 생성
    public String createAccessToken(String memberEmail, int memberNo) {
    	
    	Date now = new Date(); // 현재 시간
        Date expiryDate = new Date(now.getTime() + accessTokenExpiration); // 만료 시간 계산
        
        return Jwts.builder()
                .setSubject(memberEmail)           // 토큰 주제(subject)에 사용자 이메일 설정
                .claim("memberNo", memberNo)       // 사용자 번호
                .setIssuedAt(now)                  // 발급 시간
                .setExpiration(expiryDate)         // 만료 시간
                .signWith(getKey(), SignatureAlgorithm.HS256) // 서명 알고리즘과 키 설정
                .compact();                        // JWT 문자열로 직렬화
    }
    

    // 토큰에서 Claims 읽기
    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    // 토큰에서 이메일 추출하기
    public String extractMemberEmail(String token) {
    	return parseToken(token).getSubject();
    }

    // 토큰에서 사용자번호 추출하기
    public int extractMemberNo(String token) {
        return parseToken(token).get("memberNo", Integer.class);
    }

    // 토큰 만료 확인
    public boolean isTokenExpired(String token) {
        try {
        	// JWT를 파싱해서 Claims를 가져옴
    		// 토큰의 만료 날짜를 가져와 만료일이 현재 시간보다 전이면 true.
            return parseToken(token).getExpiration().before(new Date());
            //토큰이 만료됨 	true
            //토큰이 유효함 	false
        } catch (JwtException e) { 
        	// 유효하지 않은 토큰일 경우도 만료된 것으로 처리.
        	//토큰 자체가 잘못됨 (예: 변조, 형식 오류 등)	true
            return true;
        }
    }
 
  
}
