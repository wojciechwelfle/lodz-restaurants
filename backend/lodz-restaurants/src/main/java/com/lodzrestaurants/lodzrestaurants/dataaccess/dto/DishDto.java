package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record DishDto(
        String dishName,
        String dishDescription,
        double dishPrice
) {
}
