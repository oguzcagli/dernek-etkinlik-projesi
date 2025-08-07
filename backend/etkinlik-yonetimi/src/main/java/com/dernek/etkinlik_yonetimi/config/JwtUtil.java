package com.dernek.etkinlik_yonetimi.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.dernek.etkinlik_yonetimi.entity.User;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import lombok.Getter;



@Data
@Getter
@Component
public class JwtUtil {



        @Value("${app.jwt.secret:myVerySecretKeyForJWTTokenGeneration12345678901234567890}")
        private String jwtSecret;


        @Value("${app.jwt.expiration:86400000}")
        private int jwtExpirationMs;


        private SecretKey getSigningKey() {
            return Keys.hmacShaKeyFor(jwtSecret.getBytes());

        }


        public String generateToken(User user) {
            return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("role", user.getRole().name())
            .claim("userId", user.getId())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(getSigningKey(),SignatureAlgorithm.HS256)
            .compact();

            
        }

        public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();


    }


    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);

    }
    


    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
            
        } catch (JwtException | IllegalArgumentException e) {
            return false;


        }


    }

    


    
}
