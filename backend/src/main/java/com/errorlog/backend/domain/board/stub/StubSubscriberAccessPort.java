package com.errorlog.backend.board.stub;

import org.springframework.stereotype.Component;

import com.errorlog.backend.board.port.SubscriberAccessPort;

/**
 * 구독 도메인 병합 전 임시 구현. 항상 미구독으로 처리합니다.
 */
@Component
public class StubSubscriberAccessPort implements SubscriberAccessPort {

	@Override
	public boolean canAccessCreatorContent(Long viewerId, Long creatorId) {
		return false;
	}
}
