package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("SELECT r FROM Restaurant r JOIN r.menu m WHERE m.menuId = :menuId")
    Optional<Restaurant> findByMenuId(Long menuId);
}
