package com.lodzrestaurants.lodzrestaurants.controller;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantDto;
import com.lodzrestaurants.lodzrestaurants.service.RestaurantService;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/restaurants")
@Tag(name = "Restaurants API", description = "API for managing restaurants in Lodz")
public class RestaurantsApi {

    private final RestaurantService restaurantService;

    @Autowired
    public RestaurantsApi(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @Schema(name = "Get Restaurants", description = "Get a list of restaurants")
    @GetMapping
    public ResponseEntity<List<RestaurantDto>> getRestaurants() {
        return ResponseEntity.ok(restaurantService.getRestaurants());
    }

    @Schema(name = "Delete Restaurant", description = "Delete a restaurant by ID")
    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long restaurantId) {
        restaurantService.deleteRestaurant(restaurantId);
        return ResponseEntity.noContent().build();
    }
}
