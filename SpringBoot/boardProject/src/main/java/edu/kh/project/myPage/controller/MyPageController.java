package edu.kh.project.myPage.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.model.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("myPage")
public class MyPageController {

	@Autowired
	private MemberService service;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * 사용자 정보 조회(로그인 후, 페이지 새로고침&사용자정보 필요 시 사용)
	 * 
	 * @param request : 인터셉터에서 세팅한 클레임속 memberNo와 memberEmail을 가진 request 객체
	 * @return
	 */
	@GetMapping("memberInfo")
	public ResponseEntity<?> getLoginMemberInfo(HttpServletRequest request) {
		
		int memberNo = (int) request.getAttribute("memberNo");
	    String memberEmail = (String) request.getAttribute("memberEmail");
	    
		Member member = Member.builder().memberEmail(memberEmail).memberNo(memberNo).build();

		// 토큰에서 꺼낸 이메일과 사용자번호로 DB에서 정보 조회하기
		member = service.findByEmailAndId(member);

		// db에 정보가 없다면
		if (member == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "사용자를 찾을 수 없습니다."));
		}

		return ResponseEntity.ok(Map.of("member", member));

	}

}
