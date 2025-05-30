package edu.kh.project.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.member.model.dto.Member;
import edu.kh.project.member.model.mapper.MemberMapper;

@Service
@Transactional(rollbackFor = Exception.class)
public class MemberServiceImpl implements MemberService {

	// 등록된 Bean 중에서 같은 타입 or 상속관계인 Bean
	@Autowired // 의존성 주입(DI)
	private MemberMapper mapper;

	// Bcrypt 암호화 객체 의존성 주입(SecurityConfig 참고)
	@Autowired
	private BCryptPasswordEncoder bcrypt;

	// 로그인 서비스
	@Override
	public Member selectMember(Member inputMember) {
		// 암호화 진행

		// bcrypt.encode(문자열) : 문자열을 암호화하여 반환
		// String bcryptPassword = bcrypt.encode(inputMember.getMemberPw());
		// log.debug("bcryptPassword : " + bcryptPassword);

		// bcrypt.matches(평문, 암호화) : 평문과 암호화가 일치하면 true, 아니면 false

		// 1. 이메일이 일치하면서 탈퇴하지 않은 회원 조회
		Member loginMember = mapper.login(inputMember.getMemberEmail());

		// 2. 만약에 일치하는 이메일이 없어서 조회 결과가 null 인 경우
		if (loginMember == null)
			return null;

		// 3. 입력 받은 비밀번호(평문 : inputMember.getMemberPw())와
		// 암호화된 비밀번호(loginMember.getMemberPw())
		// 두 비밀번호가 일치하는지 확인

		// 일치하지 않으면
		if (!bcrypt.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
			return null;
		}

		// 로그인 결과에서 비밀번호 제거
		loginMember.setMemberPw(null);

		return loginMember;
	}

	// 로그인 회원 정보 조회
	@Override
	public Member findByEmailAndId(Member inputMember) {
		return mapper.findByEmailAndId(inputMember);
	}

	// 이메일 중복 검사 서비스
	@Override
	public int checkEmail(String memberEmail) {
		return mapper.checkEmail(memberEmail);
	}
	
	// 닉네임 중복 검사 서비스
	@Override
	public int checkNickname(String memberNickname) {
		return mapper.checkNickname(memberNickname);
	}
	
	// 회원가입 서비스
	@Override
	public int signup(Member member) {
		
		// 주소가 입력되지 않은 경우
		if(member.getMemberAddress().equals("")) { 
			member.setMemberAddress(null); // null 저장
		}
		
		// inputMember 안의 memberPw -> 평문
		// 비밀번호를 암호화하여 inputMember에 세팅
		String encPw = bcrypt.encode(member.getMemberPw());
		member.setMemberPw(encPw);

		// 회원 가입 매퍼 메서드 호출
		return mapper.signup(member);
	}

}
