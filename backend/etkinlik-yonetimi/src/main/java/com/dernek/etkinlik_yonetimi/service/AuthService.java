package com.dernek.etkinlik_yonetimi.service;

import com.dernek.etkinlik_yonetimi.dto.request.LoginRequest;
import com.dernek.etkinlik_yonetimi.dto.request.RegisterRequest;
import com.dernek.etkinlik_yonetimi.dto.response.AuthResponse;
import com.dernek.etkinlik_yonetimi.entity.User;
import com.dernek.etkinlik_yonetimi.repository.UserRepository;
import com.dernek.etkinlik_yonetimi.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            
            throw new RuntimeException("Hatalı şifre");




        }
        
        if (!user.isEnabled()) {


            throw new RuntimeException("Kullanıcı hesabı devre dışı");



        }
        
        String token = jwtUtil.generateToken(user);
        
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
    
    public User register(RegisterRequest request) {


        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanımda");


        }
        
        User user = new User();
    
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEnabled(true);
        
        return userRepository.save(user);
    }
    
    public boolean validateToken(String token) {

        return jwtUtil.validateToken(token);


    }

    
    public String getUsernameFromToken(String token) {


        return jwtUtil.getUsernameFromToken(token);




    }
    
    public String getRoleFromToken(String token) {

        return jwtUtil.getRoleFromToken(token);


    }
}