package com.lodzrestaurants.lodzrestaurants.service;


import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Dish;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.DishDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.DishRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.MenuRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.BadRequest;
import com.lodzrestaurants.lodzrestaurants.exceptions.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DishService {

    private final DishRepository dishRepository;
    private final MenuRepository menuRepository;

    @Autowired
    public DishService(DishRepository dishRepository, MenuRepository menuRepository) {
        this.dishRepository = dishRepository;
        this.menuRepository = menuRepository;
    }

    public void deleteDish(Long dishId) {
        if (dishId == null || !dishRepository.existsById(dishId)) {
            throw new NotFoundException("Dish with ID " + dishId + " does not exist.");
        }
        dishRepository.deleteById(dishId);
    }

    @Transactional
    public DishDto addDish(Long menuId, DishDto dishDto) {
        if (dishDto == null || dishDto.dishName() == null || dishDto.dishPrice() <= 0) {
            log.info("Invalid dish data provided: {}", dishDto);
            throw new BadRequest("Invalid dish data provided. Dish name cannot be null and price must be greater than zero.");
        }
        Dish dish = Dish.builder()
                .price(dishDto.dishPrice())
                .name(dishDto.dishName())
                .description(dishDto.dishDescription())
                .vip(dishDto.vip())
                .menu(menuRepository.findById(menuId)
                        .orElseThrow(() -> {
                            log.info("Menu with ID {} does not exist.", menuId);
                            return new NotFoundException("Menu with ID " + menuId + " does not exist.");
                        }))
                .build();

        log.info("Adding new dish: {}", dish);
        dishRepository.save(dish);
        return dishDto;
    }
}
