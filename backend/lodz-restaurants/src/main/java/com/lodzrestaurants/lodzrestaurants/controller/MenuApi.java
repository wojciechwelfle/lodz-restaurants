package com.lodzrestaurants.lodzrestaurants.controller;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.MenuDto;
import com.lodzrestaurants.lodzrestaurants.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/menu")
public class MenuApi {

    private final MenuService menuService;

    @Autowired
    public MenuApi(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/{menuId}")
    public ResponseEntity<MenuDto> getMenu(@PathVariable Long menuId) {
        return ResponseEntity.ok(menuService.getMenu(menuId));
    }

}
