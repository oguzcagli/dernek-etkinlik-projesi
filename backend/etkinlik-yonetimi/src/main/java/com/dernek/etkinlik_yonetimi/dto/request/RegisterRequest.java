package com.dernek.etkinlik_yonetimi.dto.request;

import lombok.Data;
import com.dernek.etkinlik_yonetimi.entity.Role;
import jakarta.validation.constraints.NotBlank;

@Data
public class RegisterRequest {

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    private String username;
    
    @NotBlank(message = "Şifre boş olamaz")
    private String password;

    private Role role = Role.USER;
    
}
