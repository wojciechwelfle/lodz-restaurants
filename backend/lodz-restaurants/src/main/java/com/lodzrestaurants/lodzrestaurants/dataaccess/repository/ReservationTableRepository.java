package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.ReservationTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationTableRepository extends JpaRepository<ReservationTable, Long> {
    List<ReservationTable> findAllByRestaurantId(Long restaurantId);
}
