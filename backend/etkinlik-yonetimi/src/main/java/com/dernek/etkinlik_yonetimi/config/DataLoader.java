package com.dernek.etkinlik_yonetimi.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.dernek.etkinlik_yonetimi.entity.Role;
import com.dernek.etkinlik_yonetimi.entity.User;
import com.dernek.etkinlik_yonetimi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() == 0) {
            
            User admin = new User("admin", passwordEncoder.encode("123456"), Role.ADMIN);
            
            userRepository.save(admin);


            System.out.println(" Default admin kullanıcısı oluşturuldu: admin/123456");
        }
        
    }



}