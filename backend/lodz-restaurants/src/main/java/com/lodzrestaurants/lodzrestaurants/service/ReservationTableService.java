package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.ReservationTable;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Restaurant;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.GenerateTablesDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.ReservationRequestDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.ReservationTableDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.ReservationTableRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.UserRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.BadRequest;
import com.lodzrestaurants.lodzrestaurants.exceptions.NotFoundException;
import com.lodzrestaurants.lodzrestaurants.configuration.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

@Service
@Slf4j
public class ReservationTableService {

    private final ReservationTableRepository reservationTableRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    public ReservationTableService(ReservationTableRepository reservationTableRepository,
                                   RestaurantRepository restaurantRepository,
                                   UserRepository userRepository,
                                   JwtService jwtService) {
        this.reservationTableRepository = reservationTableRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public List<ReservationTableDto> getAllReservationTables(Long restaurantId) {
        return reservationTableRepository.findAllByRestaurantId(restaurantId)
                .stream()
                .map(mapReservationTableToDto())
                .toList();
    }

    @Transactional
    public String bookTable(ReservationRequestDto reservationRequestDto) {
        if (reservationRequestDto.reservationTableId() == null || reservationRequestDto.reservationTableId() <= 0) {
            throw new BadRequest("Invalid reservation table ID.");
        }
        ReservationTable reservationTable = reservationTableRepository.findById(reservationRequestDto.reservationTableId())
                .orElseThrow(() -> new BadRequest("Reservation table not found with ID: " + reservationRequestDto.reservationTableId()));

        if (!reservationTable.isAvailable()) {
            throw new BadRequest("Reservation table is not available for booking.");
        }

        reservationTable.setFirstName(reservationRequestDto.firstName());
        reservationTable.setLastName(reservationRequestDto.lastName());
        reservationTable.setPhoneNumber(reservationRequestDto.phoneNumber());
        reservationTable.setEmail(reservationRequestDto.email());
        reservationTable.setAvailable(false);

        reservationTableRepository.save(reservationTable);
        log.info("Reservation created for table ID: {}", reservationRequestDto.reservationTableId());
        return "Reservation created successfully for table ID: " + reservationRequestDto.reservationTableId();
    }

    @Transactional
    public String generateTables(GenerateTablesDto request) {
        if (request.numberOfTables() <= 0 || request.seats() <= 0) {
            throw new BadRequest("Number of tables and seats must be greater than zero.");
        }
        Restaurant restaurant = restaurantRepository.findById(request.restaurantId())
                .orElseThrow(() -> new BadRequest("Restaurant not found with ID: " + request.restaurantId()));

        List<ReservationTable> tables = new ArrayList<>();

        long tableNumber = reservationTableRepository.findMaxTableNumberByRestaurantId(request.restaurantId()) != null
                ? reservationTableRepository.findMaxTableNumberByRestaurantId(request.restaurantId()) + 1
                : 1;
        for (int i = 0; i < request.numberOfTables(); i++) {
            generateTablesForEachHour(request, restaurant, tables, tableNumber);
        }
        if (tables.isEmpty()) {
            throw new BadRequest("No tables generated. Please check the input parameters.");
        }
        reservationTableRepository.saveAll(tables);
        log.info("Generated {} reservation tables for restaurant ID: {}", tables.size(), request.restaurantId());
        log.info("Tables: {}", tables);
        return "Reservation tables generated successfully for restaurant ID: " + request.restaurantId();
    }

    private void generateTablesForEachHour(GenerateTablesDto request, Restaurant restaurant, List<ReservationTable> tables, long tableNumber) {
        for (long hour = request.fromHour(); hour < request.toHour(); hour++) {
            ReservationTable table = bookTable(request, restaurant, hour, tableNumber++);
            tables.add(table);
        }
    }

    private static ReservationTable bookTable(GenerateTablesDto request, Restaurant restaurant, long hour, long tableNumber) {
        ReservationTable table = new ReservationTable();
        table.setRestaurant(restaurant);
        table.setSeats(request.seats());
        table.setDate(request.date());
        table.setHour(hour);
        table.setAvailable(true);
        table.setTableNumber((int) tableNumber);
        return table;
    }

    private static Function<ReservationTable, ReservationTableDto> mapReservationTableToDto() {
        return reservationTable -> new ReservationTableDto(
                reservationTable.getReservationId(),
                reservationTable.getTableNumber(),
                reservationTable.getSeats(),
                reservationTable.getDate(),
                reservationTable.getHour(),
                reservationTable.isAvailable()
        );
    }

    @Transactional
    public String quickReservation(Long reservationTableId, String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new BadRequest("Invalid or missing authentication token");
        }

        String jwt = token.substring(7);
        String username;

        try {
            username = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            log.error("Failed to extract username from token", e);
            throw new BadRequest("Invalid authentication token");
        }

        User user = userRepository.findById(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        ReservationTable reservationTable = reservationTableRepository.findById(reservationTableId)
                .orElseThrow(() -> new NotFoundException("Reservation table not found with ID: " + reservationTableId));
        if (!reservationTable.isAvailable()) {
            throw new BadRequest("Reservation table is not available for quick reservation.");
        }
        reservationTable.setFirstName(user.getFirstName());
        reservationTable.setLastName(user.getLastName());
        reservationTable.setPhoneNumber(user.getPhoneNumber());
        reservationTable.setEmail(user.getEmail());
        reservationTable.setAvailable(false);
        reservationTableRepository.save(reservationTable);
        log.info("Quick reservation created for table ID: {}", reservationTableId);
        return "Quick reservation created successfully for table ID: " + reservationTableId;
    }
}