package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record ReservationRequestDto(
        Long reservationTableId,
        String firstName,
        String lastName,
        String phoneNumber,
        String email
) {
}
