package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.RestaurantCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantCategoryRepository extends JpaRepository<RestaurantCategory, Long> {
}
