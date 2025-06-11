package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Localization;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Menu;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Restaurant;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.RestaurantCategory;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantCategoryDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.RestaurantRequestDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantCategoryRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantCategoryRepository restaurantCategoryRepository;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository, RestaurantCategoryRepository restaurantCategoryRepository) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantCategoryRepository = restaurantCategoryRepository;
    }

    public RestaurantDto getRestaurant(Long restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .map(mapRestaurantToDto())
                .orElseThrow(() -> new NotFoundException("Restaurant with ID " + restaurantId + " does not exist."));
    }

    public List<RestaurantDto> getRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(mapRestaurantToDto())
                .toList();
    }

    public List<RestaurantCategoryDto> getCategories() {
        return restaurantCategoryRepository.findAll()
                .stream()
                .map(category -> new RestaurantCategoryDto(
                        category.getRestaurantCategoryId(),
                        category.getCategoryName()
                ))
                .toList();
    }

    public RestaurantDto createRestaurant(RestaurantRequestDto restaurantRequestDto) {
        RestaurantCategory category = restaurantCategoryRepository.findByCategoryName(restaurantRequestDto.category())
                .orElseThrow(() -> new NotFoundException("Category " + restaurantRequestDto.category() + " does not exist."));

        Localization localization = new Localization(restaurantRequestDto.position()[0], restaurantRequestDto.position()[1]);
        Restaurant restaurant = new Restaurant(
                restaurantRequestDto.name(),
                restaurantRequestDto.description(),
                localization,
                category,
                new Menu("Menu for " + restaurantRequestDto.name() + " Restaurant", "")
        );

        return mapRestaurantToDto().apply(restaurantRepository.save(restaurant));
    }

    public RestaurantDto updateRestaurant(Long restaurantId, RestaurantRequestDto restaurantRequestDto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new NotFoundException("Restaurant with ID " + restaurantId + " does not exist."));

        RestaurantCategory category = restaurantCategoryRepository.findByCategoryName(restaurantRequestDto.category())
                .orElseThrow(() -> new NotFoundException("Category " + restaurantRequestDto.category() + " does not exist."));

        Localization localization = new Localization(restaurantRequestDto.position()[0], restaurantRequestDto.position()[1]);

        restaurant.setName(restaurantRequestDto.name());
        restaurant.setDescription(restaurantRequestDto.description());
        restaurant.setLocalization(localization);
        restaurant.setRestaurantCategory(category);

        return mapRestaurantToDto().apply(restaurantRepository.save(restaurant));
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
