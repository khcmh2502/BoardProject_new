package edu.kh.project.member.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.model.service.MemberService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("member")
public class MemberController {
	
	@Autowired
	private MemberService service;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * 이메일 + 비밀번호 로그인: (access 토큰 발급) 로그인 시 최초 1회 사용
	 * 
	 * @param inputMember
	 * @param response
	 * @return
	 */
	@PostMapping("login")
	public ResponseEntity<?> login(@RequestBody Member inputMember, HttpServletResponse response) {

		// 로그인 서비스 호출 및 결과 반환받기
		Member loginMember = service.selectMember(inputMember);

		if (loginMember != null) {
			// accessToken과 refreshToken 발급, 유효기간 얻어오기
			String accessToken = jwtUtil.createAccessToken(loginMember.getMemberEmail(), loginMember.getMemberNo());

			return ResponseEntity.ok(Map.of("accessToken", accessToken, "member", loginMember));

		} else {
			// (로그인 정보 없음)유저 정보가 잘못되었을 때
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "유저 정보가 잘못되었습니다"));
		}

	}

}
