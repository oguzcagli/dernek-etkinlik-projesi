package com.dernek.etkinlik_yonetimi.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dernek.etkinlik_yonetimi.entity.User;
import com.dernek.etkinlik_yonetimi.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;




@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");


        if (authHeader == null || !authHeader.startsWith("Bearer ")) {



            filterChain.doFilter(request, response);


            return;


        }
        


        String token = authHeader.substring(7);
        
        try {


            if (jwtUtil.validateToken(token)) {

                String username = jwtUtil.getUsernameFromToken(token);

                String role = jwtUtil.getRoleFromToken(token);
                
                

                User user = userRepository.findByUsername(username).orElse(null);
                


                if (user != null && user.isEnabled()) {
                

                    List<SimpleGrantedAuthority> authorities = List.of(



                        new SimpleGrantedAuthority("ROLE_" + role)
                    );
                    


                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);



                }


            }


            
        } catch (Exception e) {

            System.out.println("JWT Token hatası: " + e.getMessage());

            
        }

        
        filterChain.doFilter(request, response);
    }



}