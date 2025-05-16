package edu.kh.project.email.model.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.email.model.mapper.EmailMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

	// 필드 의존성 주입될 객체들
	private final EmailMapper mapper; // EmailMapper 의존성주입
	private final JavaMailSender mailSender; // JavaMailSender : 실제 메일 발송을 담당하는 객체(EmailConfig 설정이 적용된 객체)

	// 인증번호 생성 및 이메일 전송
	@Override
	public boolean createAndSendAuthKey(String email) {
		// 1. 인증번호 생성
		String authKey = makeRandomKey();

		// 2. 이메일 전송
		sendEmail(email, authKey);

		Map<String, String> map = new HashMap<>();
		map.put("authKey", authKey);
		map.put("email", email);

		// 3. DB에 저장
		return storeAuthKey(map);
		
	}

	private void sendEmail(String to, String authKey) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("회원가입 인증번호");
		message.setText("인증번호는 [ " + authKey + " ] 입니다.\n5분 내로 입력해주세요.");
		mailSender.send(message);
	}

	// 인증키와 이메일을 DB에 저장하는 메서드
	@Transactional(rollbackFor = Exception.class) // 메서드 레벨에서도 이용 가능(해당 메서드에서만 트랜잭션 커밋/롤백)
	private boolean storeAuthKey(Map<String, String> map) {

		// 1. 기존 이메일에 대한 인증키 update 수행
		int result = mapper.updateAuthKey(map);

		// 2. update 실패 (== 기존 데이터 없음) 시 insert 수행
		if (result == 0) {
			result = mapper.insertAuthKey(map);
		}

		return result > 0; // 성공 여부 반환 (true/false)

	}

	// 인증번호 발급 메서드
	// UUID를 사용하여 인증키 생성
	// (Universally Unique IDentifier) : 전 세계에서 고유한 식별자를 생성하기 위한 표준
	// 매우 낮은 확률로 중복되는 식별자를 생성
	// 주로 데이터베이스 기본 키, 고유한 식별자를 생성해야 할 때 사용
	private String makeRandomKey() {
		return UUID.randomUUID().toString().substring(0, 6);
	}

	// 입력받은 이메일, 인증번호가 DB에 있는지 조회
	@Override
	public int checkAuthKey(Map<String, String> map) {
		return mapper.checkAuthKey(map);
	}

}
