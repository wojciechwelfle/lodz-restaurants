package com.lodzrestaurants.lodzrestaurants.dataaccess.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "restaurant_category")
@Getter
@Setter
public class RestaurantCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "restaurant_category_id", nullable = false)
    private Long restaurantCategoryId;

    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    public RestaurantCategory() {
    }

    public RestaurantCategory(String categoryName) {
        this.categoryName = categoryName;
    }
}
