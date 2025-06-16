package com.lodzrestaurants.lodzrestaurants.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequest extends StatusException {

    public BadRequest(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

}
