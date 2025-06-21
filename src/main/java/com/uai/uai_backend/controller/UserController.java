package com.uai.uai_backend.controller;

import com.uai.uai_backend.dto.BioRequest;
import com.uai.uai_backend.dto.LoginRequest;
import com.uai.uai_backend.dto.MultipleChoiceAnswersRequest;
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

    @PostMapping("/submit-bio")
    public ResponseEntity<?> submitBio(@RequestBody BioRequest bioRequest) {
        return userService.saveBioForUser(bioRequest);
    }

    @PostMapping("/submit-answers-mcq")
    public ResponseEntity<?> submitBio(@RequestBody MultipleChoiceAnswersRequest multipleChoiceAnswersRequest) {
        return userService.saveMultipleChoiceAnswers(multipleChoiceAnswersRequest);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        return userService.getUserDetailsByEmail(email);
    }
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsers();
    }
//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
//        return userService.loginUser(loginRequest);
//    }
//    @GetMapping("/{id}")
//    public ResponseEntity<?> loginUser(@PathVariable Long id){
//        return userService.getUserDetails(id);
//    }

//    @PatchMapping("/verify-user/{id}")
//    public ResponseEntity<?> verifyIdentity(@PathVariable Long id) {
//        userService.verifyUser(id);
//        return ResponseEntity.ok(Map.of(
//                "message", "User identity verified.",
//                "userId", id
//        ));
//    }

    }

