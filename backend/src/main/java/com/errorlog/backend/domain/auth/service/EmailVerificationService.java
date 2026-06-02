package com.errorlog.backend.domain.auth.service;

import com.errorlog.backend.global.exception.AppException;
import com.errorlog.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final JavaMailSender mailSender;

    @Value("${email.verification.expiration}")
    private long expirationSeconds;

    // email → {code, expiredAt}
    private final Map<String, VerificationEntry> store = new ConcurrentHashMap<>();

    public void sendVerificationCode(String email) {
        String code = generateCode();
        LocalDateTime expiredAt = LocalDateTime.now().plusSeconds(expirationSeconds);
        store.put(email, new VerificationEntry(code, expiredAt));

        sendEmail(email, code);
        log.info("인증 코드 발송 완료: {}", email);
    }

    public void verifyCode(String email, String inputCode) {
        VerificationEntry entry = store.get(email);

        if (entry == null || LocalDateTime.now().isAfter(entry.expiredAt())) {
            store.remove(email);
            throw new AppException(ErrorCode.EXPIRED_VERIFICATION_CODE);
        }
        if (!entry.code().equals(inputCode)) {
            throw new AppException(ErrorCode.INVALID_VERIFICATION_CODE);
        }

        store.remove(email);
    }

    private void sendEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("[Errorlog] 이메일 인증 코드");
        message.setText(
                "안녕하세요. Errorlog입니다.\n\n" +
                "이메일 인증 코드: " + code + "\n\n" +
                "코드는 " + (expirationSeconds / 60) + "분 후 만료됩니다.\n" +
                "본인이 요청하지 않은 경우 이 메일을 무시하세요."
        );
        mailSender.send(message);
    }

    private String generateCode() {
        SecureRandom random = new SecureRandom();
        return String.valueOf(random.nextInt(900000) + 100000);
    }

    private record VerificationEntry(String code, LocalDateTime expiredAt) {}
}
