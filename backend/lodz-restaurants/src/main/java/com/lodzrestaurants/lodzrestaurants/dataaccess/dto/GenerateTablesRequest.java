package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record GenerateTablesRequest(
        Long restaurantId,
        Integer numberOfTables,
        Integer seats,
        String date,
        Long fromHour,
        Long toHour
) {
}
