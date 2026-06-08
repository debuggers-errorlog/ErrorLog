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

    public enum Purpose { SIGNUP, PASSWORD_RESET }

    private final JavaMailSender mailSender;

    @Value("${email.verification.expiration}")
    private long expirationSeconds;

    @Value("${email.dev-mode:false}")
    private boolean devMode;

    private final Map<String, VerificationEntry> store = new ConcurrentHashMap<>();

    public void sendVerificationCode(String email, Purpose purpose) {
        String code = generateCode();
        LocalDateTime expiredAt = LocalDateTime.now().plusSeconds(expirationSeconds);
        store.put(key(email, purpose), new VerificationEntry(code, expiredAt));

        sendEmail(email, code, purpose);
        log.info("인증 코드 발송 완료: {} ({})", email, purpose);
    }

    public void verifyCode(String email, String inputCode, Purpose purpose) {
        String key = key(email, purpose);
        VerificationEntry entry = store.get(key);

        if (entry == null || LocalDateTime.now().isAfter(entry.expiredAt())) {
            store.remove(key);
            throw new AppException(ErrorCode.EXPIRED_VERIFICATION_CODE);
        }
        if (!entry.code().equals(inputCode)) {
            throw new AppException(ErrorCode.INVALID_VERIFICATION_CODE);
        }

        store.remove(key);
    }

    private String key(String email, Purpose purpose) {
        return purpose.name() + ":" + email;
    }

    private void sendEmail(String to, String code, Purpose purpose) {
        if (devMode) {
            log.warn("[MAIL DEV MODE] {} → {} 인증 코드: {}", purpose, to, code);
            return;
        }

        String subject = purpose == Purpose.PASSWORD_RESET
                ? "[Errorlog] 비밀번호 재설정 인증 코드"
                : "[Errorlog] 이메일 인증 코드";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(
                "안녕하세요. Errorlog입니다.\n\n" +
                "인증 코드: " + code + "\n\n" +
                "코드는 " + (expirationSeconds / 60) + "분 후 만료됩니다.\n" +
                "본인이 요청하지 않은 경우 이 메일을 무시하세요."
        );
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("이메일 발송 실패 ({}): Gmail 앱 비밀번호·MAIL_DEV_MODE 설정 확인", to, e);
            throw e;
        }
    }

    private String generateCode() {
        SecureRandom random = new SecureRandom();
        return String.valueOf(random.nextInt(900000) + 100000);
    }

    private record VerificationEntry(String code, LocalDateTime expiredAt) {}
}
