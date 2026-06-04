package com.errorlog.backend.domain.subscription.repository;

import com.errorlog.backend.domain.subscription.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}
