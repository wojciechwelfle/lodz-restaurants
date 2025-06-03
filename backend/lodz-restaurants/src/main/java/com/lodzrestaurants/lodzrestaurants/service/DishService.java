package com.lodzrestaurants.lodzrestaurants.service;


import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.DishRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DishService {

    private final DishRepository dishRepository;

    @Autowired
    public DishService(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    public void deleteDish(Long dishId) {
        if (dishId == null || !dishRepository.existsById(dishId)) {
            throw new NotFoundException("Dish with ID " + dishId + " does not exist.");
        }
        dishRepository.deleteById(dishId);
    }
}
