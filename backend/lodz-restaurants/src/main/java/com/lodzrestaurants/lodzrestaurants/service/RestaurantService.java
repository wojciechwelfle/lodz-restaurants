package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
                .map(restaurant -> new RestaurantDto(
                        restaurant.getId(),
                        restaurant.getName(),
                        restaurant.getDescription(),
                        new double[]{restaurant.getLocalization().getLatitude(), restaurant.getLocalization().getLongitude()}
                ))
                .toList();
    }

}
