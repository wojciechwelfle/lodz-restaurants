package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Menu;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.Restaurant;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.DishDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.MenuDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.DishRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.MenuRepository;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.RestaurantRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class MenuService {

    private final DishRepository dishRepository;
    private final MenuRepository menuRepository;
    private final RestaurantRepository restaurantRepository;

    @Autowired
    public MenuService(DishRepository dishRepository,
                       MenuRepository menuRepository,
                       RestaurantRepository restaurantRepository) {
        this.dishRepository = dishRepository;
        this.menuRepository = menuRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public MenuDto getMenu(Long menuId) {
        return menuRepository.findById(menuId)
                .map(mapMenuToDto())
                .orElseThrow(() -> new NotFoundException("Menu not found"));
    }

    public List<MenuDto> getAllMenus() {
        return menuRepository.findAll()
                .stream()
                .map(mapMenuToDto())
                .toList();
    }

    private Function<Menu, MenuDto> mapMenuToDto() {
        return menu -> new MenuDto(
                menu.getMenuId(),
                getRestaurantNameOrNullIfNotFound(menu.getMenuId()),
                menu.getMenuName(),
                menu.getMenuDescription(),
                getDishListAndMapToDto(menu.getMenuId())
        );
    }

    private String getRestaurantNameOrNullIfNotFound(Long menuId) {
        return restaurantRepository.findByMenuId(menuId)
                .map(Restaurant::getName)
                .orElse(null);
    }

    private List<DishDto> getDishListAndMapToDto(Long menuId) {
        return dishRepository.findAllByMenuId(menuId)
                .stream()
                .map(dish -> new DishDto(
                        dish.getDishId(),
                        dish.getName(),
                        dish.getDescription(),
                        dish.getPrice()
                ))
                .toList();
    }


}
