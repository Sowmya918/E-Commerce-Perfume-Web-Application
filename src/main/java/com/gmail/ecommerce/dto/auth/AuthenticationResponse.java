package com.gmail.ecommerce.dto.auth;

import com.gmail.ecommerce.dto.user.*;
import lombok.Data;

@Data
public class AuthenticationResponse {
    private UserResponse user;
    private String token;
}
