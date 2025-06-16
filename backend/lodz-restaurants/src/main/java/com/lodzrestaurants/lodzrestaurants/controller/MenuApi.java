package com.lodzrestaurants.lodzrestaurants.controller;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.MenuDto;
import com.lodzrestaurants.lodzrestaurants.service.MenuService;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/menu")
@Tag(name = "Menu API", description = "API for managing menus")
@Slf4j
public class MenuApi {

    private final MenuService menuService;

    @Autowired
    public MenuApi(MenuService menuService) {
        this.menuService = menuService;
    }

    @Schema(name = "Get menus", description = "Get all menus")
    @GetMapping
    public ResponseEntity<List<MenuDto>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    @Schema(name = "Get menu by ID", description = "Get a specific menu by its ID")
    @GetMapping("/{menuId}")
    public ResponseEntity<MenuDto> getMenu(@PathVariable Long menuId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && 
                                 authentication.isAuthenticated() && 
                                 !"anonymousUser".equals(authentication.getPrincipal());
        
        return ResponseEntity.ok(menuService.getMenu(menuId, isAuthenticated));
    }


}
