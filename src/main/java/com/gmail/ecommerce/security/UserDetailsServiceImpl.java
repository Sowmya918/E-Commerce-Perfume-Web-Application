package com.gmail.ecommerce.security;

import com.gmail.ecommerce.domain.User;
import com.gmail.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static com.gmail.ecommerce.constants.ErrorMessage.USER_NOT_FOUND;

@Service("userDetailsServiceImpl")
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND));

        // ✅ FIX: use active instead of activationCode
        if (!user.isActive()) {
            throw new LockedException("Email not activated");
        }

        return UserPrincipal.create(user);
    }
}