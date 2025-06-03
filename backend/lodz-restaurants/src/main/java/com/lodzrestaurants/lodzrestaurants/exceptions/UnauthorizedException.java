package com.lodzrestaurants.lodzrestaurants.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends StatusException {

    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }

}
