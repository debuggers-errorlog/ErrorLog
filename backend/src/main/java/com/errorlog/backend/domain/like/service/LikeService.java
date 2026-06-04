package com.errorlog.backend.like.service;

import com.errorlog.backend.like.dto.LikeResponse;
import com.errorlog.backend.like.entity.Like;
import com.errorlog.backend.like.repository.LikeRepository;
import com.errorlog.backend.post.entity.Post;
import com.errorlog.backend.post.repository.PostRepository;
import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public boolean toggleLike(Long userId, Long postId) {
        if (likeRepository.existsByUser_IdAndPost_Id(userId, postId)) {
            likeRepository.deleteByUser_IdAndPost_Id(userId, postId);
            return false;   // 좋아요 취소됨
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 없습니다: " + userId));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글이 없습니다: " + postId));
        likeRepository.save(new Like(user, post));
        return true;        // 좋아요됨
    }

    @Transactional(readOnly = true)
    public LikeResponse getStatus(Long userId, Long postId) {
        boolean liked = likeRepository.existsByUser_IdAndPost_Id(userId, postId);
        long count = likeRepository.countByPost_Id(postId);
        return new LikeResponse(liked, count);
    }
}