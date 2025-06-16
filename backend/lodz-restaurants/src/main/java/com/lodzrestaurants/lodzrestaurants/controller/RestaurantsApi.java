package com.lodzrestaurants.lodzrestaurants.controller;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantCategoryDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantRequestDto;
import com.lodzrestaurants.lodzrestaurants.service.RestaurantService;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

    @Schema(name = "Get Restaurant", description = "Get a restaurant by ID")
    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantDto> getRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(restaurantService.getRestaurant(restaurantId));
    }

    @Schema(name = "Get Restaurants Paginated", description = "Get a paginated list of restaurants with optional search")
    @GetMapping("/paginated")
    public ResponseEntity<Page<RestaurantDto>> getPaginatedRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDto> restaurants;

        if (search != null && !search.isEmpty()) {
            restaurants = restaurantService.searchRestaurants(search, pageable);
        } else {
            restaurants = restaurantService.getPaginatedRestaurants(pageable);
        }

        return ResponseEntity.ok(restaurants);
    }

    @Schema(name = "Get Categories", description = "Get a list of restaurant categories")
    @GetMapping("/categories")
    public ResponseEntity<List<RestaurantCategoryDto>> getCategories() {
        return ResponseEntity.ok(restaurantService.getCategories());
    }

    @Schema(name = "Create Restaurant", description = "Create a new restaurant")
    @PostMapping
    public ResponseEntity<RestaurantDto> createRestaurant(@RequestBody RestaurantRequestDto restaurantDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.createRestaurant(restaurantDto));
    }

    @Schema(name = "Update Restaurant", description = "Update a restaurant by ID")
    @PutMapping("/{restaurantId}")
    public ResponseEntity<RestaurantDto> updateRestaurant(@PathVariable Long restaurantId, @RequestBody RestaurantRequestDto restaurantDto) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(restaurantId, restaurantDto));
    }

    @Schema(name = "Delete Restaurant", description = "Delete a restaurant by ID")
    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long restaurantId) {
        restaurantService.deleteRestaurant(restaurantId);
        return ResponseEntity.noContent().build();
    }
}
