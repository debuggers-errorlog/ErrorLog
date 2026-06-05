package com.errorlog.backend.domain.board.port;

/**
 * 구독/결제 도메인 연동용. 병합 시 subscription 팀 구현체로 교체합니다.
 */
public interface SubscriberAccessPort {

	boolean canAccessCreatorContent(Long viewerId, Long creatorId);
}
