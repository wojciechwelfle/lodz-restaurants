package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.ReservationTable;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Restaurant;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.GenerateTablesRequest;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.ReservationTableDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.ReservationTableRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.BadRequest;
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

    @Autowired
    public ReservationTableService(ReservationTableRepository reservationTableRepository,
                                   RestaurantRepository restaurantRepository) {
        this.reservationTableRepository = reservationTableRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public List<ReservationTableDto> getAllReservationTables(Long restaurantId) {
        return reservationTableRepository.findAllByRestaurantId(restaurantId)
                .stream()
                .map(mapReservationTableToDto())
                .toList();
    }

    @Transactional
    public String generateTables(GenerateTablesRequest request) {
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

    private void generateTablesForEachHour(GenerateTablesRequest request, Restaurant restaurant, List<ReservationTable> tables, long tableNumber) {
        for (long hour = request.fromHour(); hour < request.toHour(); hour++) {
            ReservationTable table = createReservationTable(request, restaurant, hour, tableNumber++);
            tables.add(table);
        }
    }

    private static ReservationTable createReservationTable(GenerateTablesRequest request, Restaurant restaurant, long hour, long tableNumber) {
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
}
