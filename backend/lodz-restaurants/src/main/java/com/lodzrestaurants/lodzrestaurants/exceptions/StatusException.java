package com.lodzrestaurants.lodzrestaurants.exceptions;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Setter
@Getter
public abstract class StatusException extends RuntimeException {

    private HttpStatus status;

    public StatusException(String message, HttpStatus status) {
        super(message);
        setStatus(status);
    }
}
