package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record LoginResponse (
        String username,
        String token
) {
}
