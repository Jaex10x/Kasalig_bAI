package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import org.springframework.http.HttpStatus;

public class AuthException extends RuntimeException{
    private final HttpStatus status;

    public AuthException(HttpStatus status, String message){
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus(){
        return status;
    }
}