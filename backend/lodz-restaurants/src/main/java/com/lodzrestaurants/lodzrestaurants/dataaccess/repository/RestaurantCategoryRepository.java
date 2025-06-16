package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.RestaurantCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantCategoryRepository extends JpaRepository<RestaurantCategory, Long> {

    Optional<RestaurantCategory> findByCategoryName(String categoryName);
}
