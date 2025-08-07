package com.dernek.etkinlik_yonetimi.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data

public class LoginRequest {
    
    @NotBlank(message = "Kullanıcı adı boş olamaz")
    private String username;
    
    @NotBlank(message = "Şifre boş olamaz")
    private String password;
}
