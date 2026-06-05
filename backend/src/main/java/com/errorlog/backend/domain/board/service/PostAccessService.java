package com.errorlog.backend.board.service;

import org.springframework.stereotype.Service;

import com.errorlog.backend.board.domain.entity.Post;
import com.errorlog.backend.board.port.SubscriberAccessPort;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostAccessService {

	private final SubscriberAccessPort subscriberAccessPort;

	public boolean canViewFullContent(Post post, Long viewerId) {
		if (!post.isSubscriberOnly()) {
			return true;
		}
		if (viewerId == null) {
			return false;
		}
		if (post.isOwnedBy(viewerId)) {
			return true;
		}
		return subscriberAccessPort.canAccessCreatorContent(viewerId, post.getUserId());
	}

	public boolean isLocked(Post post, Long viewerId) {
		return !canViewFullContent(post, viewerId);
	}
}
