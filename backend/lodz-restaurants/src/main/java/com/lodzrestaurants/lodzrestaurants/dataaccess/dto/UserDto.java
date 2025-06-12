package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User.UserRole;

public record UserDto(
        String username, 
        String password, 
        UserRole role,
        String firstName,
        String lastName,
        String phoneNumber,
        String email
) {
    public UserDto(String username, String password) {
        this(username, password, null, null, null, null, null);
    }
    
    public UserDto(String username, String password, UserRole role) {
        this(username, password, role, null, null, null, null);
    }
}
