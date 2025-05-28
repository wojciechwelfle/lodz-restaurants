package com.lodzrestaurants.lodzrestaurants.dataaccess.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "menu")
@Getter
@Setter
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @Column(name = "menu_name", nullable = false)
    private String menuName;

    @Column(name = "menu_description")
    private String menuDescription;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dish> dishes;

    public Menu() {
    }

    public Menu(String menuName, String menuDescription) {
        this.menuName = menuName;
        this.menuDescription = menuDescription;
    }

}
