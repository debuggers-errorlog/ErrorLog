package com.errorlog.backend.domain.admin.service;

import com.errorlog.backend.domain.admin.dto.MemberListResponseDto;
import com.errorlog.backend.domain.admin.dto.MemberSearchConditionDto;
import com.errorlog.backend.domain.admin.repository.MemberAdminQueryRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MemberAdminService {

    private final MemberAdminQueryRepository memberAdminQueryRepository;
    private final UserRepository userRepository;

    public MemberAdminService(MemberAdminQueryRepository memberAdminQueryRepository,
                              UserRepository userRepository) {
        this.memberAdminQueryRepository = memberAdminQueryRepository;
        this.userRepository = userRepository;
    }

    // ===== 목록 조회 (QueryDSL 동적 검색) =====
    public Page<MemberListResponseDto> searchMembers(MemberSearchConditionDto condition, Pageable pageable) {
        return memberAdminQueryRepository.search(condition, pageable);
    }

    // ===== 정지 =====
    @Transactional
    public void suspendMember(Long userId) {
        User user = findUserOrThrow(userId);
        user.suspend();   // 변경 감지로 UPDATE 자동 반영 (save 없음)
    }

    // ===== 해제 =====
    @Transactional
    public void restoreMember(Long userId) {
        User user = findUserOrThrow(userId);
        user.restore();
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
