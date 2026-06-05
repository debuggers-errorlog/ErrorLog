package com.errorlog.backend.board.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.errorlog.backend.board.domain.dto.TagResponse;
import com.errorlog.backend.board.domain.entity.Tag;
import com.errorlog.backend.board.repository.TagRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TagService {

	private final TagRepository tagRepository;

	public Set<Tag> resolveTags(List<String> rawNames) {
		if (rawNames == null || rawNames.isEmpty()) {
			return Set.of();
		}

		List<String> names = rawNames.stream()
				.map(Tag::normalize)
				.distinct()
				.toList();

		Map<String, Tag> existing = tagRepository.findByNameIn(names).stream()
				.collect(Collectors.toMap(Tag::getName, Function.identity()));

		Set<Tag> resolved = new HashSet<>();
		for (String name : names) {
			Tag tag = existing.get(name);
			if (tag == null) {
				tag = tagRepository.save(new Tag(name));
			}
			resolved.add(tag);
		}
		return resolved;
	}

	@Transactional(readOnly = true)
	public List<TagResponse> listPopular(int limit) {
		return tagRepository.findPopularTags(PageRequest.of(0, limit)).stream()
				.map(TagResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<TagResponse> suggest(String prefix, int limit) {
		String normalized = Tag.normalize(prefix);
		return tagRepository.findByNameStartingWith(normalized, PageRequest.of(0, limit)).stream()
				.map(TagResponse::from)
				.toList();
	}
}
