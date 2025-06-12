package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User.UserRole;

public record UserDto(String username, String password, UserRole role) {
    public UserDto(String username, String password) {
        this(username, password, null);
    }
}
