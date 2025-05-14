package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.DishDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.MenuDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.DishRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.MenuRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MenuService {

    private final DishRepository dishRepository;
    private final MenuRepository menuRepository;

    @Autowired
    public MenuService(DishRepository dishRepository, MenuRepository menuRepository) {
        this.dishRepository = dishRepository;
        this.menuRepository = menuRepository;
    }

    public MenuDto getMenu(Long menuId) {
        return menuRepository.findById(menuId)
                .map(menu -> new MenuDto(
                        menu.getMenuId(),
                        menu.getMenuName(),
                        menu.getMenuDescription(),
                        dishRepository.findAllByMenuId(menuId)
                                .stream()
                                .map(dish -> new DishDto(
                                        dish.getName(),
                                        dish.getDescription(),
                                        dish.getPrice()
                                ))
                                .toList()
                ))
                .orElseThrow(() -> new NotFoundException("Menu not found"));
    }

}
