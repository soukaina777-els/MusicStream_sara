package com.spotify.backend.service;

import com.spotify.backend.config.JwtUtil;
import com.spotify.backend.dto.Dtos;
import com.spotify.backend.model.Account;
import com.spotify.backend.model.User;
import com.spotify.backend.repository.AccountRepository;
import com.spotify.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AccountRepository accountRepository, UserRepository userRepository,
                       JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public Dtos.LoginResponse login(Dtos.LoginRequest request) {
        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        boolean matches = false;
        if (account.getPassword() != null) {
            if (account.getPassword().startsWith("$2a$")) {
                matches = passwordEncoder.matches(request.getPassword(), account.getPassword());
            } else {
                matches = account.getPassword().equals(request.getPassword());
            }
        }

        if (!matches) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        User user = userRepository.findByAccountId(account.getId()).orElse(null);
        String token = jwtUtil.generateToken(account.getEmail(),
                user != null ? user.getId() : null);

        String name = user != null ? user.getName() : account.getEmail().split("@")[0];
        Long userId = user != null ? user.getId() : null;

        return new Dtos.LoginResponse(token, account.getEmail(), name, userId);
    }
}
