package edu.kh.project.member.model.service;

import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.member.model.dto.Member;

public interface MemberService{

	/** 로그인 검사
	 * @param member
	 * @return
	 */
	Member selectMember(Member inputMember);
	 
	/** 회원 정보 조회
	 * @param memberEmail
	 * @param memberNo
	 * @return
	 */
	Member findByEmailAndId(Member inputMember);

	/** 이메일 중복검사 서비스
	 * @param memberEmail
	 * @return
	 * @author 조미현
	 */
	int checkEmail(String memberEmail);

	/** 닉네임 중복검사 서비스
	 * @param memberNickname
	 * @return
	 */
	int checkNickname(String memberNickname);

	/** 회원가입 서비스
	 * @param member
	 * @return
	 */
	int signup(Member member);

}
