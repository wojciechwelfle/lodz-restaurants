package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

public record ReservationRequest(
        Long reservationTableId,
        String firstName,
        String lastName,
        String phoneNumber,
        String email
) {
}
