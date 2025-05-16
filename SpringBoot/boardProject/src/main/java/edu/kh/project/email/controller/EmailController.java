package edu.kh.project.email.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.email.model.service.EmailService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("email")
@RequiredArgsConstructor // final 필드에 자동으로 의존성 주입 (@Autowired 생성자 방식 코드 자동완성)
public class EmailController {

	private final EmailService service;
	
	@PostMapping("sendAuth")
	public ResponseEntity<String> sendAuthKey(@RequestBody Map<String, String> body) {
		// 수신자 이메일
	    String email = body.get("email");
	    // 인증번호 발급 및 전송
	    boolean sendResult = service.createAndSendAuthKey(email);
	    
	    if(sendResult) {	    	
	    	return ResponseEntity.ok("인증번호 전송 성공");
	    }
	    
	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("이메일 전송 중 서버 오류 발생");

	}
	
	/** 입력받은 이메일, 인증번호가 DB에 있는지 조회
	 * @param map
	 * @return 1 : 이메일 있고, 인증번호 일치 / 0 : 아닐때
	 */
	@PostMapping("checkAuthKey")
	public ResponseEntity<?> checkAuthKey(@RequestBody Map<String, String> map) {
		int result = service.checkAuthKey(map);
		
		if (result > 0) {
	        // 인증번호 일치
	        return ResponseEntity.ok(Map.of(
	            "success", true,
	            "message", "인증번호 인증 성공"
	        ));
	    } else {
	        // 인증번호 불일치
	        return ResponseEntity.ok(Map.of(
	            "success", false,
	            "message", "인증번호 인증 실패"
	        ));
	    }
	}
	
	
	
	
	
	
	
}
