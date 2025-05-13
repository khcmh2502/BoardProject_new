package edu.kh.project.member.model.service;

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

}
