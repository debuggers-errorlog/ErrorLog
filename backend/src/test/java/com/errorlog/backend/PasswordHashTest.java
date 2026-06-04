package com.errorlog.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashTest {

    @Test
    void generateHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String rawPassword = "1234"; // ★ 네가 로그인 때 쓰고 싶은 평문 비밀번호
        String hashed = encoder.encode(rawPassword);

        System.out.println("=================================");
        System.out.println("해시 결과: " + hashed);
        System.out.println("=================================");
    }
}