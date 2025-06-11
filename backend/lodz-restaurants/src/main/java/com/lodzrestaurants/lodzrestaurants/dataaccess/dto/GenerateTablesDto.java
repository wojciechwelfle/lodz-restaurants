package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record GenerateTablesDto(
        Long restaurantId,
        Integer numberOfTables,
        Integer seats,
        String date,
        Long fromHour,
        Long toHour
) {
}
