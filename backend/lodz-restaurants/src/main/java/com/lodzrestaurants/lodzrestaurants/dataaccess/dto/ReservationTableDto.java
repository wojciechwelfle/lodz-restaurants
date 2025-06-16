package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record ReservationTableDto(
        Long reservationId,
        int tableNumber,
        int seats,
        String date,
        long hour,
        boolean isAvailable
) {
}
