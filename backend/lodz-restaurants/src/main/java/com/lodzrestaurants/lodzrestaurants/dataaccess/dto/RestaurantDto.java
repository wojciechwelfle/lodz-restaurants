package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record RestaurantDto(
        Long id,
        String name,
        String description,
        double[] position
) {
}
