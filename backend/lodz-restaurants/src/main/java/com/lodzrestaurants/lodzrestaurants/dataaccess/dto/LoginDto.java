package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User.UserRole;

public record LoginDto(String username, String token, UserRole role) {
}
