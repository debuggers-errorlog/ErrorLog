package com.errorlog.backend.domain.question.repository;

import com.errorlog.backend.domain.question.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("boardImageRepository")
public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findByTargetTypeAndTargetIdOrderByImageSeqAsc(
            Image.TargetType targetType, Long targetId);

}