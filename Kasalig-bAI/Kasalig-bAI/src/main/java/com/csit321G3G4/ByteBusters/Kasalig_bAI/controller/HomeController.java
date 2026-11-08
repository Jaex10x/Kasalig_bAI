package com.csit321G3G4.ByteBusters.Kasalig_bAI.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Kasalig  bAI API is running! Open the website at http://localhost:5173";
    }
}
