package com.lodzrestaurants.lodzrestaurants.configuration;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.*;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.DishRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.MenuRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final MenuRepository menuRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (restaurantRepository.count() > 0) {
                return;
            }

            restaurantRepository.save(new Restaurant("Restaurant 1", "Description 1", new Localization(51.7592, 19.4560), new RestaurantCategory("Sushi")));
            restaurantRepository.save(new Restaurant("Restaurant 2", "Description 2", new Localization(51.7593, 19.4561), new RestaurantCategory("Sushi1")));
            restaurantRepository.save(new Restaurant("Restaurant 3", "Description 3", new Localization(51.7594, 19.4562), new RestaurantCategory("Sushi2"), new Ranking(4.5)));

            menuRepository.save(new Menu("Menu 1", "Menu description"));
            menuRepository.save(new Menu("Menu 2", "Menu description"));

            restaurantRepository.save(new Restaurant("Restaurant 4", "Description 4", new Localization(51.7595, 19.4563), new RestaurantCategory("Sushi3"), new Ranking(4.5), new Menu("Menu 3", "Menu description")));

            dishRepository.save(new Dish("Dish 1", "Dish description", 10.0, menuRepository.findById(1L).orElse(null)));
            dishRepository.save(new Dish("Dish 2", "Dish description", 20.0, menuRepository.findById(1L).orElse(null)));
            dishRepository.save(new Dish("Dish 3", "Dish description", 30.0, menuRepository.findById(2L).orElse(null)));
            dishRepository.save(new Dish("Dish 4", "Dish description", 40.0, menuRepository.findById(2L).orElse(null)));
        };
    }
}
