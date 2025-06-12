package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record DishDto(
        Long dishId,
        String dishName,
        String dishDescription,
        double dishPrice,
        boolean vip // New field for VIP dishes
) {
}
