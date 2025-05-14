package com.lodzrestaurants.lodzrestaurants.dataaccess.dto;

import java.util.List;

public record MenuDto(
        Long menuId,
        String menuName,
        String menuDescription,
        List<DishDto> dishes
) {
}
