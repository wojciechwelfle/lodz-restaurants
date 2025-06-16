package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {

    @Query("SELECT d FROM Dish d WHERE d.menu.menuId = :menuId")
    List<Dish> findAllByMenuId(Long menuId);
}
