package com.lodzrestaurants.lodzrestaurants.controller;

import com.lodzrestaurants.lodzrestaurants.service.DishService;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/dishes")
@Tag(name = "Dish API", description = "API for managing dishes in Lodz restaurants")
public class DishApi {

    private final DishService dishService;

    @Autowired
    public DishApi(DishService dishService) {
        this.dishService = dishService;
    }

    @Schema(name = "Delete Dish", description = "Delete a dish by ID")
    @DeleteMapping("/{dishId}")
    public ResponseEntity<String> deleteDish(@PathVariable Long dishId) {
        dishService.deleteDish(dishId);
        return ResponseEntity.ok("Dish with ID " + dishId + " deleted successfully.");
    }
}
