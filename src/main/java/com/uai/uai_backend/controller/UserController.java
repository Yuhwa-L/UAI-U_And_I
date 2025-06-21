package com.uai.uai_backend.controller;

import com.uai.uai_backend.dto.LoginRequest;
import com.uai.uai_backend.model.User;
import com.uai.uai_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/sign-up")
    public String registerUser(@RequestBody User user){
        try {
            userService.saveUser(user);
            return "User registered successfully";
        }
        catch (Exception e){
            if(e.getMessage().equals("Email already registered.")){
                return "Email already registered.";
            }
        }
        return "Email already registered, please login!";
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
            return userService.loginUser(loginRequest);
    }

//    @PatchMapping("/verify-user/{id}")
//    public ResponseEntity<?> verifyIdentity(@PathVariable Long id) {
//        userService.verifyUser(id);
//        return ResponseEntity.ok(Map.of(
//                "message", "User identity verified.",
//                "userId", id
//        ));
//    }

    }

