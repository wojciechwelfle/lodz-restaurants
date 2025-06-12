package com.lodzrestaurants.lodzrestaurants.controller;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.GenerateTablesDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.ReservationRequestDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.ReservationTableDto;
import com.lodzrestaurants.lodzrestaurants.service.ReservationTableService;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/reservation-tables")
@Tag(name = "Reservation Tables API", description = "API for managing reservation tables")
public class ReservationTablesApi {

    private final ReservationTableService reservationTableService;

    @Autowired
    public ReservationTablesApi(ReservationTableService reservationTableService) {
        this.reservationTableService = reservationTableService;
    }

    @Schema(description = "Get all reservation tables for restaurant")
    @GetMapping("/{restaurantId}")
    public ResponseEntity<List<ReservationTableDto>> getAllReservationTables(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reservationTableService.getAllReservationTables(restaurantId));
    }

    @Schema(description = "Create a new reservation table for a restaurant")
    @PostMapping
    public ResponseEntity<String> bookTable(
            @RequestBody ReservationRequestDto reservationRequestDto) {
        return ResponseEntity.ok(reservationTableService.bookTable(reservationRequestDto));
    }

    @Schema(description = "Quick reservation for logged in users")
    @PostMapping("/quick/{reservationTableId}")
    public ResponseEntity<String> quickReservation(
            @PathVariable Long reservationTableId,
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(reservationTableService.quickReservation(reservationTableId, token));
    }

    @Schema(description = "Generate reservation tables for a restaurant")
    @PostMapping("/generate")
    public ResponseEntity<String> generateTables(@RequestBody GenerateTablesDto request) {
        return ResponseEntity.ok(reservationTableService.generateTables(request));
    }
}
