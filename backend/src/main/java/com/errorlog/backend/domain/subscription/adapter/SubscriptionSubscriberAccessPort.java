package com.errorlog.backend.domain.subscription.adapter;

import org.springframework.stereotype.Component;

import com.errorlog.backend.domain.board.port.SubscriberAccessPort;
import com.errorlog.backend.domain.subscription.service.SubscriptionService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionSubscriberAccessPort implements SubscriberAccessPort {

	private final SubscriptionService subscriptionService;

	@Override
	public boolean canAccessCreatorContent(Long viewerId, Long creatorId) {
		if (viewerId == null || creatorId == null) {
			return false;
		}
		if (viewerId.equals(creatorId)) {
			return true;
		}
		return subscriptionService.isActiveSubscription(viewerId, creatorId);
	}
}
