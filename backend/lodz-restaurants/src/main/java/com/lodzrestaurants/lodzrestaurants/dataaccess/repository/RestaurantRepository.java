package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
