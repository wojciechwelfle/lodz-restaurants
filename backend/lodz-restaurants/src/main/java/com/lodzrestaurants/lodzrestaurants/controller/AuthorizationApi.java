package com.lodzrestaurants.lodzrestaurants.controller;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.LoginDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.UserDto;
import com.lodzrestaurants.lodzrestaurants.service.AuthorizationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/authorization")
@Tag(name = "Authorization API", description = "API for user authorization")
public class AuthorizationApi {

    private final AuthorizationService authorizationService;

    @Autowired
    public AuthorizationApi(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginDto> login(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(authorizationService.login(userDto));
    }
    
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserDto userDto) {
        authorizationService.register(userDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
