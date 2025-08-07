package com.dernek.etkinlik_yonetimi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dernek.etkinlik_yonetimi.dto.request.LoginRequest;
import com.dernek.etkinlik_yonetimi.dto.request.RegisterRequest;
import com.dernek.etkinlik_yonetimi.dto.response.ApiResponse;
import com.dernek.etkinlik_yonetimi.dto.response.AuthResponse;
import com.dernek.etkinlik_yonetimi.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {



    private final AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e){

            return ResponseEntity.badRequest().build();

        }


    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {

        try {

            authService.register(request);
            
            return ResponseEntity.ok(new ApiResponse(true, "Kullanıcı başarıyla kaydedildi", null));

        } catch (RuntimeException e) {


            return ResponseEntity.badRequest()
                .body(new ApiResponse(false,e.getMessage(), null));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse> validateToken(@RequestHeader("Authorization") String token) {

        try {


            if (token.startsWith("Bearer ")) {
                token = token.substring(7);

            }
            
            boolean isValid = authService.validateToken(token);
            
            if (isValid) {

                String username = authService.getUsernameFromToken(token);
                String role = authService.getRoleFromToken(token);
                return ResponseEntity.ok(new ApiResponse(true, "Token geçerli - User: " + username + ", Role: " + role, null));

            } else {

                return ResponseEntity.badRequest().body(new ApiResponse(false, "Token geçersiz", null));
            }


        } catch (Exception e) {

            return ResponseEntity.badRequest().body(new ApiResponse(false, "Token doğrulama hatası: " + e.getMessage(), null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        
        return ResponseEntity.ok(new ApiResponse(true, "Başarıyla çıkış yapıldı", null));
    }
}