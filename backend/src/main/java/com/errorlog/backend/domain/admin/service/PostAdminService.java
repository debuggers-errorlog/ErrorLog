package com.errorlog.backend.domain.admin.service;

import com.errorlog.backend.domain.admin.dto.PostListResponseDto;
import com.errorlog.backend.domain.admin.dto.PostSearchConditionDto;
import com.errorlog.backend.domain.admin.repository.PostAdminQueryRepository;
import com.errorlog.backend.domain.board.domain.entity.Post;
import com.errorlog.backend.domain.board.repository.PostRepository;
import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PostAdminService {

    private final PostAdminQueryRepository postAdminQueryRepository;
    private final PostRepository postRepository;   // 팀원 posts 도메인의 레포

    public PostAdminService(PostAdminQueryRepository postAdminQueryRepository,
                            PostRepository postRepository) {
        this.postAdminQueryRepository = postAdminQueryRepository;
        this.postRepository = postRepository;
    }

    public Page<PostListResponseDto> searchPosts(PostSearchConditionDto condition, Pageable pageable) {
        return postAdminQueryRepository.search(condition, pageable);
    }

    @Transactional
    public void hidePost(Long postId)   { findPostOrThrow(postId).hide(); }

    @Transactional
    public void showPost(Long postId)   { findPostOrThrow(postId).show(); }

    @Transactional
    public void deletePost(Long postId) { findPostOrThrow(postId).markDeleted(); }

    private Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
    }
}