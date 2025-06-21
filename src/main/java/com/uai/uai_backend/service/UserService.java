package com.uai.uai_backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uai.uai_backend.dto.LoginRequest;
import com.uai.uai_backend.dto.RegisterRequest;
import com.uai.uai_backend.model.User;
import com.uai.uai_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> registerUser(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("User is already registered");
        }
        User user = new User();
        user.setFullName(request.getFullName());
        user.setContactNumber(request.getContactNumber());
        user.setEmail(request.getEmail());
        user.setEmergencyContactNumber(request.getEmergencyContactNumber());
        user.setIdImageBase64(request.getIdImageBase64());
        user.setSelfieImageBase64(request.getSelfieImageBase64());
//        boolean isVerified = isIdentityVerified(user);
//        if(!isVerified){
//            return ResponseEntity.badRequest().body("Identity verification failed");
//        }
//        user.setLocalDateTime(LocalDateTime.now());
//        user.setVerified(true);
//        user.setVerificationMethod("AI");
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully with identification verification");
    }

    public ResponseEntity<?> loginUser(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return ResponseEntity.ok("Login successful");
                    } else {
                        return ResponseEntity.status(401).body("UNAUTHORIZED");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(404).body("USER NOT FOUND"));
    }

    public void saveUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void verifyUser(Long userID){
        User user = userRepository.findById(userID).orElseThrow(()-> new IllegalArgumentException("User not found"));
        user.setVerified(true);
        user.setLocalDateTime(LocalDateTime.now());
        user.setVerificationMethod("Manual");

        userRepository.save(user);
    }

    public boolean isIdentityVerified(User user) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            String requestBody = new ObjectMapper().writeValueAsString(Map.of(
                    "idImageBase64", user.getIdImageBase64(),
                    "selfieImageBase64", user.getSelfieImageBase64()
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:5000/verify-face"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> result = mapper.readValue(response.body(), new TypeReference<>() {
            });
            return (Boolean) result.get("match");

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
