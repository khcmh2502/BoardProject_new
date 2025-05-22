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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.model.service.MemberService;
import edu.kh.project.myPage.model.service.MyPageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("myPage")
public class MyPageController {

	@Autowired
	private MemberService memberService;
	
	@Autowired
	private MyPageService myPageService;

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
		member = memberService.findByEmailAndId(member);
		
		log.debug("memberInfo: {}", member);

		// db에 정보가 없다면
		if (member == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "사용자를 찾을 수 없습니다."));
		}

		return ResponseEntity.ok(Map.of("member", member));

	}
	
	// @RequestBody는 JSON 형식을 처리하는 데 사용됨
	// multipart/form-data 형식은 @RequestParam 또는 @ModelAttribute로 처리(JSON이 아니라 파일 업로드용 바이너리 데이터이기 때문에)
	@PostMapping("update/profile")
	public ResponseEntity<?> updateProfileImage(@RequestParam(value = "profileImg", required = false) MultipartFile profileImg, 
												HttpServletRequest request) throws Exception {
		
		int memberNo = (int) request.getAttribute("memberNo");
	
		// 서비스 호출
		int result = myPageService.profile(profileImg, memberNo);
		
		if(result > 0) {
			return ResponseEntity.ok(200);
		}
				
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로필 이미지 업데이트 실패");
		
	}

}
