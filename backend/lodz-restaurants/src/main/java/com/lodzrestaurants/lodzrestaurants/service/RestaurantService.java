package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Restaurant;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public List<RestaurantDto> getRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(mapRestaurantToDto())
                .toList();
    }

    public void deleteRestaurant(Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new NotFoundException("Restaurant with ID " + restaurantId + " does not exist.");
        }
        restaurantRepository.deleteById(restaurantId);
    }

    private static Function<Restaurant, RestaurantDto> mapRestaurantToDto() {
        return restaurant -> new RestaurantDto(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getDescription(),
                new double[]{restaurant.getLocalization().getLatitude(), restaurant.getLocalization().getLongitude()},
                restaurant.getRestaurantCategory().getCategoryName(),
                restaurant.getMenu() != null ? restaurant.getMenu().getMenuId() : null
        );
    }

}
