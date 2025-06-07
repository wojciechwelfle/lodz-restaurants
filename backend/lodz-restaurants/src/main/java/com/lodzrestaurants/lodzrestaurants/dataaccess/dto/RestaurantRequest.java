package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record RestaurantRequest(
        String name,
        String description,
        double[] position,
        String category
) {
}
