package com.errorlog.backend.domain.board.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.errorlog.backend.domain.board.domain.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

	Optional<Tag> findByName(String name);

	List<Tag> findByNameIn(Collection<String> names);

	Page<Tag> findByNameStartingWith(String name, Pageable pageable);

	@Query(
			value = """
					SELECT t.*
					FROM tags t
					INNER JOIN post_tags pt ON t.id = pt.tag_id
					INNER JOIN posts p ON pt.post_id = p.id AND p.status = 'ACTIVE'
					GROUP BY t.id, t.name
					ORDER BY COUNT(pt.post_id) DESC
					""",
			nativeQuery = true)
	List<Tag> findPopularTags(Pageable pageable);
}
