package com.gmail.ecommerce.service.Impl;

import com.gmail.ecommerce.enums.AuthProvider;
import com.gmail.ecommerce.enums.Role;
import com.gmail.ecommerce.domain.User;
import com.gmail.ecommerce.exception.ApiRequestException;
import com.gmail.ecommerce.exception.EmailException;
import com.gmail.ecommerce.exception.PasswordConfirmationException;
import com.gmail.ecommerce.exception.PasswordException;
import com.gmail.ecommerce.repository.UserRepository;
import com.gmail.ecommerce.security.JwtProvider;
import com.gmail.ecommerce.security.oauth2.OAuth2UserInfo;
import com.gmail.ecommerce.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static com.gmail.ecommerce.constants.ErrorMessage.*;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    // ================= LOGIN =================
    @Override
    public Map<String, Object> login(String email, String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ApiRequestException(EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND));

            String userRole = user.getRoles().iterator().next().name();
            String token = jwtProvider.createToken(email, userRole);

            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);

            return response;

        } catch (AuthenticationException e) {
            throw new ApiRequestException("Incorrect password or email", HttpStatus.UNAUTHORIZED);
        }
    }

    // ================= REGISTER =================
    @Override
    @Transactional
    public String registerUser(User user, String captcha, String password2) {

        // Password match check
        if (user.getPassword() != null && !user.getPassword().equals(password2)) {
            throw new PasswordException(PASSWORDS_DO_NOT_MATCH);
        }

        // Email check
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);
        if (existingUser != null && existingUser.isActive()) {
            throw new EmailException(EMAIL_IN_USE);
        }

        // ✅ FIX: user must be active for login
        user.setActive(true);

        user.setRoles(Collections.singleton(Role.USER));
        user.setProvider(AuthProvider.LOCAL);
        user.setActivationCode(UUID.randomUUID().toString());

        // Password encoding
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return "User successfully registered.";
    }

    // ================= OAUTH =================
    @Override
    @Transactional
    public User registerOauth2User(String provider, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setFirstName(oAuth2UserInfo.getFirstName());
        user.setLastName(oAuth2UserInfo.getLastName());
        user.setActive(true);
        user.setRoles(Collections.singleton(Role.USER));
        user.setProvider(AuthProvider.valueOf(provider.toUpperCase()));
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateOauth2User(User user, String provider, OAuth2UserInfo oAuth2UserInfo) {
        user.setFirstName(oAuth2UserInfo.getFirstName());
        user.setLastName(oAuth2UserInfo.getLastName());
        user.setProvider(AuthProvider.valueOf(provider.toUpperCase()));
        return userRepository.save(user);
    }

    // ================= PASSWORD RESET =================
    @Override
    public String getEmailByPasswordResetCode(String code) {
        return userRepository.getEmailByPasswordResetCode(code)
                .orElseThrow(() -> new ApiRequestException(INVALID_PASSWORD_CODE, HttpStatus.BAD_REQUEST));
    }

    @Override
    @Transactional
    public String sendPasswordResetCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiRequestException(EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND));

        user.setPasswordResetCode(UUID.randomUUID().toString());
        userRepository.save(user);

        return "Reset password code is send to your E-mail";
    }

    @Override
    @Transactional
    public String passwordReset(String email, String password, String password2) {
        if (StringUtils.isEmpty(password2)) {
            throw new PasswordConfirmationException(EMPTY_PASSWORD_CONFIRMATION);
        }
        if (password != null && !password.equals(password2)) {
            throw new PasswordException(PASSWORDS_DO_NOT_MATCH);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiRequestException(EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND));

        user.setPassword(passwordEncoder.encode(password));
        user.setPasswordResetCode(null);
        userRepository.save(user);

        return "Password successfully changed!";
    }

    // ================= ACTIVATE =================
    @Override
    @Transactional
    public String activateUser(String code) {
        User user = userRepository.findByActivationCode(code)
                .orElseThrow(() -> new ApiRequestException(ACTIVATION_CODE_NOT_FOUND, HttpStatus.NOT_FOUND));

        user.setActivationCode(null);
        user.setActive(true);
        userRepository.save(user);

        return "User successfully activated.";
    }
}