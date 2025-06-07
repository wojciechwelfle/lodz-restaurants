package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.ReservationTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationTableRepository extends JpaRepository<ReservationTable, Long> {
    List<ReservationTable> findAllByRestaurantId(Long restaurantId);

    @Query("SELECT MAX(rt.tableNumber) FROM ReservationTable rt WHERE rt.restaurant.id = :restaurantId")
    Long findMaxTableNumberByRestaurantId(@Param("restaurantId") Long restaurantId);

}
