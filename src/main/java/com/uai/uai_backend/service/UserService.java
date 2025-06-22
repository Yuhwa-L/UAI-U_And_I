package com.uai.uai_backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uai.uai_backend.dto.BioRequest;
import com.uai.uai_backend.dto.LoginRequest;
import com.uai.uai_backend.dto.MultipleChoiceAnswersRequest;
import com.uai.uai_backend.dto.RegisterRequest;
import com.uai.uai_backend.model.User;
import com.uai.uai_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.restTemplate = restTemplate;
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
        user.setGender(request.getGender());
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
        System.out.println("I'm here");
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        System.out.println("code is reaching out here");
                        return ResponseEntity.ok("Login successful");
                    } else {
                        return ResponseEntity.status(401).body("UNAUTHORIZED");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(404).body("USER NOT FOUND"));
    }

    public ResponseEntity<?> saveBioForUser(BioRequest request) {
        System.out.println("code is reaching out here for bio data");
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    user.setBio(request.getBio());
                    user.setProfilePhoto(request.getProfilePhoto());
                    userRepository.save(user);
                    return ResponseEntity.ok("Bio updated successfully");
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }
    public ResponseEntity<User> getUserDetailsByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    public ResponseEntity<?> saveMultipleChoiceAnswers(MultipleChoiceAnswersRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    user.setQuestionAnswers(request.getAnswers());
                    userRepository.save(user);
                    return ResponseEntity.ok("Answers saved successfully");
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
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

    // public ResponseEntity<?> saveMultipleChoiceAnswersForAI(MultipleChoiceAnswersRequest request) {
    //     return userRepository.findByEmail(request.getEmail())
    //             .map(user -> {
    //                 user.setQuestionAnswers(request.getAnswers());
    //                 userRepository.save(user);

    //                 // Construct AI payload
    //                 Map<String, Object> aiPayload = new HashMap<>();
    //                 aiPayload.put("email", user.getEmail());
    //                 aiPayload.put("bio", user.getBio());
    //                 aiPayload.put("answers", user.getQuestionAnswers());

    //                 // Call AI service (Python)
    //                 restTemplate.postForObject("http://localhost:5000/generate-questions", aiPayload, String.class);

    //                 return ResponseEntity.ok("Answers saved & sent to AI for question generation");
    //             })
    //             .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    // }
    public ResponseEntity<?> saveMultipleChoiceAnswersForAI(String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    // Prepare payload to send to Flask
                    Map<String, Object> aiPayload = new HashMap<>();
                    aiPayload.put("answers", user.getQuestionAnswers());
                    aiPayload.put("bio", user.getBio());

                    try {
                        // Send HTTP POST to Flask
                        ObjectMapper mapper = new ObjectMapper();
                        String requestBody = mapper.writeValueAsString(aiPayload);

                        HttpRequest httpRequest = HttpRequest.newBuilder()
                                .uri(URI.create("http://localhost:5000/generate_questions"))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                                .build();

                        HttpClient client = HttpClient.newHttpClient();
                        HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

                        if (response.statusCode() == 200) {
                            // Parse returned questions
                            List<Map<String, String>> questionList = mapper.readValue(
                                    response.body(), new TypeReference<>() {}
                            );

                            // Optionally: save to DB or attach to user

                            return ResponseEntity.ok(questionList);  // ✅ Send to frontend
                        } else {
                            return ResponseEntity.status(502).body("Flask service error: " + response.body());
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(500).body("AI service call failed: " + e.getMessage());
                    }

                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }


}
