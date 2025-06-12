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
}
