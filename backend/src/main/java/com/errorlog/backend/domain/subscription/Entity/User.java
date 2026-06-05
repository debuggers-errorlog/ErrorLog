package com.errorlog.backend.domain.subscription.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    // 구독 리스트 페이지를 위한 임시 User 엔티티,merge 후 import 받아서 사용

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nickname;
}
