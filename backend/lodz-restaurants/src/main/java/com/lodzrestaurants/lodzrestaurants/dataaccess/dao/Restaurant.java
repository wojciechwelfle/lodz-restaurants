package com.lodzrestaurants.lodzrestaurants.dataaccess.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "description")
    private String description;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "localization_id", nullable = false)
    private Localization localization;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "restaurant_category_id", nullable = false)
    private RestaurantCategory restaurantCategory;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ranking_id")
    private Ranking ranking;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "menu_id")
    private Menu menu;

    public Restaurant() {
    }

    public Restaurant(String name, String description, Localization localization, RestaurantCategory restaurantCategory) {
        this.name = name;
        this.description = description;
        this.localization = localization;
        this.restaurantCategory = restaurantCategory;
        this.ranking = null;
    }

    public Restaurant(String name, String description, Localization localization, RestaurantCategory restaurantCategory, Ranking ranking) {
        this.name = name;
        this.description = description;
        this.localization = localization;
        this.restaurantCategory = restaurantCategory;
        this.ranking = ranking;
    }
}
