package edu.kh.project.member.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.kh.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	/** 이메일로 로그인 조회
	 * @param memberEmail
	 * @return
	 */
	Member login(String memberEmail);

	/** 로그인 회원 정보 조회
	 * @param inputMember
	 * @return
	 */
	Member findByEmailAndId(Member inputMember);

	/** 이메일 중복검사
	 * @param memberEmail
	 * @return count
	 */
	int checkEmail(String memberEmail);

	/** 닉네임 중복검사
	 * @param memberNickname
	 * @return count
	 */
	int checkNickname(String memberNickname);

	/** 회원가입
	 * @param member
	 * @return
	 */
	int signup(Member member);
}
