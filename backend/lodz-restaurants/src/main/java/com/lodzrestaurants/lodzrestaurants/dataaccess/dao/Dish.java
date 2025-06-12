package com.lodzrestaurants.lodzrestaurants.dataaccess.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "dish")
@Getter
@Setter
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "dish_id", nullable = false)
    private Long dishId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "vip", nullable = false)
    private boolean vip = false;

    @ManyToOne
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    public Dish() {
    }

    public Dish(String name, String description, double price, Menu menu) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.menu = menu;
    }

    public Dish(String name, String description, double price, Menu menu, boolean vip) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.menu = menu;
        this.vip = vip;
    }
}
