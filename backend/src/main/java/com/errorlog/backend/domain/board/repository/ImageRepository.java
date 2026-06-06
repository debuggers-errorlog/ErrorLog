package com.errorlog.backend.domain.board.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.errorlog.backend.domain.board.domain.entity.Image;
import com.errorlog.backend.domain.board.domain.enums.ImageTargetType;

public interface ImageRepository extends JpaRepository<Image, Long> {

	List<Image> findByTargetTypeAndTargetIdOrderByImageSeqAsc(ImageTargetType targetType, Long targetId);

	Optional<Image> findByIdAndTargetTypeAndTargetId(Long id, ImageTargetType targetType, Long targetId);

	@Query("select coalesce(max(i.imageSeq), 0) from Image i where i.targetType = :targetType and i.targetId = :targetId")
	int findMaxSeq(@Param("targetType") ImageTargetType targetType, @Param("targetId") Long targetId);
}
