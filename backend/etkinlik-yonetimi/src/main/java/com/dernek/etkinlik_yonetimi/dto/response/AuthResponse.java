package com.dernek.etkinlik_yonetimi.dto.response;

import com.dernek.etkinlik_yonetimi.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String username;
    private Role role;
    private String type = "Bearer";

    public AuthResponse(String token, String username, Role role) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.type = "Bearer";
    }




}