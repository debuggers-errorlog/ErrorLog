package com.errorlog.backend.board.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tags")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Tag {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 50, unique = true)
	private String name;

	public Tag(String name) {
		this.name = normalize(name);
	}

	public static String normalize(String raw) {
		String trimmed = raw.trim().toLowerCase();
		if (trimmed.startsWith("#")) {
			trimmed = trimmed.substring(1);
		}
		return trimmed;
	}
}
