package com.lodzrestaurants.lodzrestaurants.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends StatusException {

    public NotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

}
