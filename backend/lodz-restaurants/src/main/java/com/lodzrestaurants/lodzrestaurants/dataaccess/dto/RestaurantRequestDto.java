package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record RestaurantRequestDto(
        String name,
        String description,
        double[] position,
        String category
) {
}
