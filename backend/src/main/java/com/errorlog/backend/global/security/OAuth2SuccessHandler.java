package com.errorlog.backend.global.security;

import com.errorlog.backend.domain.user.entity.User;
import com.errorlog.backend.domain.user.repository.UserRepository;
import com.errorlog.backend.global.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");

        Optional<User> existing = userRepository.findByProviderAndProviderId(User.Provider.GOOGLE, providerId);

        if (existing.isPresent()) {
            User user = existing.get();

            // 탈퇴한 유저면 신규 가입 페이지로
            if (user.getStatus() == User.Status.DELETED) {
                String tempToken = jwtUtil.generateTempToken(email, providerId);
                log.info("구글 로그인 시도 (탈퇴 유저 → 신규 가입 유도): {}", email);
                getRedirectStrategy().sendRedirect(request, response,
                        frontendUrl + "/oauth/additional-info?tempToken=" + tempToken);
                return;
            }

            // 정지된 유저면 로그인 페이지로
            if (user.getStatus() == User.Status.SUSPENDED) {
                log.warn("구글 로그인 시도 (정지 유저): {}", email);
                getRedirectStrategy().sendRedirect(request, response,
                        frontendUrl + "/login?error=suspended");
                return;
            }

            // 정상 유저 → 토큰 발급 후 메인으로
            String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());
            String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getRole().name());
            log.info("구글 로그인 성공 (기존 유저): {}", email);
            getRedirectStrategy().sendRedirect(request, response,
                    frontendUrl + "/oauth/callback?accessToken=" + accessToken + "&refreshToken=" + refreshToken);
        } else {
            // 신규 유저 → 임시 토큰으로 추가 정보 입력 페이지로
            String tempToken = jwtUtil.generateTempToken(email, providerId);
            log.info("구글 로그인 성공 (신규 유저): {}", email);
            getRedirectStrategy().sendRedirect(request, response,
                    frontendUrl + "/oauth/additional-info?tempToken=" + tempToken);
        }
    }
}
