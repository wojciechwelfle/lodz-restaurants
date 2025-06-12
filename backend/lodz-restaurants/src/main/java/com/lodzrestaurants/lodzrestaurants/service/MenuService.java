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

    public List<MenuDto> getAllMenus() {
        return menuRepository.findAll()
                .stream()
                .map(mapMenuToDto())
                .toList();
    }

    public MenuDto getMenu(Long menuId, boolean loggedIn) {
        return menuRepository.findById(menuId)
                .map(menu -> mapMenuToDto(loggedIn).apply(menu))
                .orElseThrow(() -> new NotFoundException("Menu not found"));
    }

    private Function<Menu, MenuDto> mapMenuToDto(boolean loggedIn) {
        return menu -> new MenuDto(
                menu.getMenuId(),
                getRestaurantNameOrNullIfNotFound(menu.getMenuId()),
                menu.getMenuName(),
                menu.getMenuDescription(),
                getDishListAndMapToDto(menu.getMenuId(), loggedIn)
        );
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
                        dish.getPrice(),
                        dish.isVip()
                ))
                .toList();
    }

    private List<DishDto> getDishListAndMapToDto(Long menuId, boolean loggedIn) {
        return dishRepository.findAllByMenuId(menuId)
                .stream()
                .filter(dish -> loggedIn || !dish.isVip()) // Filter VIP dishes if not logged in
                .map(dish -> new DishDto(
                        dish.getDishId(),
                        dish.getName(),
                        dish.getDescription(),
                        dish.getPrice(),
                        dish.isVip()
                ))
                .toList();
    }


}
